import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquante");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

function getEndpointSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://takainside.org";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(payload, signature, getEndpointSecret());
  } catch (err: unknown) {
    console.error("[Stripe Webhook] Signature invalide:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Répondre 200 rapidement à Stripe pour éviter les retries
  const response = NextResponse.json({ received: true });

  // Traitement asynchrone
  processEvent(event).catch((err) => {
    console.error("[Stripe Webhook] Erreur traitement async:", err);
  });

  return response;
}

async function processEvent(event: Stripe.Event) {
  switch (event.type) {
    // ─── Événement principal : session checkout complétée ───
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const transaction_id = session.payment_intent as string || session.id;
      await createOrderFromStripeSession(session, event.id, transaction_id);
      break;
    }

    // ─── Fallback : payment_intent.succeeded (pour compatibilité) ───
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await createOrderFromPaymentIntent(paymentIntent, event.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Paiement échoué: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`[Webhook] Événement non géré: ${event.type}`);
  }
}

async function createOrderFromStripeSession(session: Stripe.Checkout.Session, eventId: string, transaction_id: string) {
  // Idempotence
  const existing = await findOrderByTransactionId(transaction_id);
  if (existing) {
    console.log(`[Webhook] Commande déjà existante pour ${transaction_id}`);
    return;
  }

  const meta = session.metadata || {};
  const cust = session.customer_details;

  // Fusion : formulaire prioritaire, fallback Stripe
  const nomClient = sanitizeString(meta.nom || cust?.name, 200) || sanitizeString(meta.nomClient, 200) || "Client Stripe";
  const prenom = sanitizeString(meta.prenom, 100);
  const nom = sanitizeString(meta.nom, 100);
  const email = sanitizeString(meta.email || cust?.email, 100) || "";
  const telephone = sanitizeString(meta.telephone || cust?.phone, 100) || "";

  const stripeAddr = cust?.address;
  const cartHasPhysical = meta.hasPhysical === "true";
  const needsInvoice = meta.needsInvoice === "true" || cartHasPhysical;

  const adresse = sanitizeString(meta.adresse, 200)
    || stripeAddr?.line1
    || (needsInvoice ? "" : "N/A — Contenu digital");

  const ville = sanitizeString(meta.ville, 100)
    || stripeAddr?.city
    || (needsInvoice ? "" : "N/A");

  const code_postal = sanitizeString(meta.code_postal, 20)
    || stripeAddr?.postal_code
    || (needsInvoice ? "" : "N/A");

  const pays = sanitizeString(meta.pays, 50)
    || stripeAddr?.country
    || "FR";

  const type_livraison = meta.type_livraison || (cartHasPhysical ? "physique" : "digital");
  const cout_livraison = Number(meta.cout_livraison) || 0;
  const poids_kg = Number(meta.poids_kg) || 0;
  const shipping_type = sanitizeString(meta.shipping_type, 50) || 'standard';

  const produits = parseProduits(meta.produits);
  const hasDigital = meta.hasDigital === "true" || produits.some((p: any) => p.type === 'digital');

  const { token, expiration } = hasDigital ? generateDownloadToken() : { token: null, expiration: null };

  const total = (session.amount_total || 0) / 100;

  const commandePayload = {
    data: {
      nomClient: `${prenom} ${nom}`.trim() || nomClient,
      email,
      telephone,
      adresse,
      ville,
      code_postal,
      pays,
      type_livraison,
      cout_livraison,
      poids_kg,
      shipping_type,
      produits,
      total,
      montant_paye: total,
      methode_paiement: "stripe",
      transaction_id,
      statut: "paye",
      token_telechargement: token,
      date_expiration_telechargement: expiration,
      nombre_telechargements: 0,
      stripe_event_id: eventId,
      needs_invoice: needsInvoice,
      adresse_facturation: needsInvoice ? {
        ligne1: stripeAddr?.line1 || sanitizeString(meta.adresse, 200) || "",
        ligne2: stripeAddr?.line2 || "",
        ville: stripeAddr?.city || sanitizeString(meta.ville, 100) || "",
        code_postal: stripeAddr?.postal_code || sanitizeString(meta.code_postal, 20) || "",
        pays: stripeAddr?.country || sanitizeString(meta.pays, 50) || "",
      } : null,
    },
  };

  const commande = await createOrder(commandePayload, transaction_id);

  await sendConfirmationEmail({
    email,
    nomClient: commandePayload.data.nomClient,
    commande,
    hasDigital,
    token,
    type_livraison,
    needsInvoice,
    produits,
    total,
    methode: 'Stripe',
  });
}

async function createOrderFromPaymentIntent(paymentIntent: Stripe.PaymentIntent, eventId: string) {
  const { id: transaction_id, metadata, amount } = paymentIntent;

  const existing = await findOrderByTransactionId(transaction_id);
  if (existing) {
    console.log(`[Webhook] Commande déjà existante pour ${transaction_id}`);
    return;
  }

  const meta = metadata || {};
  const cartHasPhysical = meta.hasPhysical === "true";
  const needsInvoice = meta.needsInvoice === "true" || cartHasPhysical;

  const produits = parseProduits(meta.produits);
  const hasDigital = meta.hasDigital === "true" || produits.some((p: any) => p.type === 'digital');
  const { token, expiration } = hasDigital ? generateDownloadToken() : { token: null, expiration: null };

  const nomClient = sanitizeString(meta.nomClient, 200) || "Client Stripe";
  const email = sanitizeString(meta.email || paymentIntent.receipt_email, 100) || "";
  const telephone = sanitizeString(meta.telephone, 100) || "";
  const adresse = sanitizeString(meta.adresse, 200) || (needsInvoice ? "" : "N/A — Contenu digital");
  const ville = sanitizeString(meta.ville, 100) || (needsInvoice ? "" : "N/A");
  const code_postal = sanitizeString(meta.code_postal, 20) || (needsInvoice ? "" : "N/A");
  const pays = sanitizeString(meta.pays, 50) || "FR";
  const type_livraison = meta.type_livraison || (cartHasPhysical ? "physique" : "digital");
  const cout_livraison = Number(meta.cout_livraison) || 0;
  const shipping_type = sanitizeString(meta.shipping_type, 50) || 'standard';

  const commandePayload = {
    data: {
      nomClient,
      email,
      telephone,
      adresse,
      ville,
      code_postal,
      pays,
      type_livraison,
      cout_livraison,
      shipping_type,
      produits,
      total: amount / 100,
      montant_paye: amount / 100,
      methode_paiement: "stripe",
      transaction_id,
      statut: "paye",
      token_telechargement: token,
      date_expiration_telechargement: expiration,
      nombre_telechargements: 0,
      stripe_event_id: eventId,
      needs_invoice: needsInvoice,
      adresse_facturation: needsInvoice ? {
        ligne1: adresse,
        ligne2: "",
        ville,
        code_postal,
        pays,
      } : null,
    },
  };

  const commande = await createOrder(commandePayload, transaction_id);

  await sendConfirmationEmail({
    email,
    nomClient,
    commande,
    hasDigital,
    token,
    type_livraison,
    needsInvoice,
    produits,
    total: amount / 100,
    methode: 'Stripe',
  });
}

async function findOrderByTransactionId(transactionId: string) {
  try {
    const res = await fetch(
      `${strapiUrl}/api/commandes?filters[transaction_id][$eq]=${encodeURIComponent(transactionId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (err) {
    console.error("[Webhook] Erreur idempotence:", err);
    return null;
  }
}

async function createOrder(payload: any, transactionId: string) {
  const res = await fetch(`${strapiUrl}/api/commandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Erreur création commande: ${err.error?.message || res.statusText}`
    );
  }

  const data = await res.json();
  console.log(`[Webhook] Commande créée: ${data.data?.id} pour ${transactionId}`);
  return data.data;
}

function generateDownloadToken() {
  return {
    token: crypto.randomUUID(),
    expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function parseProduits(raw: string | undefined): any[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sanitizeString(str: unknown, maxLength = 200): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// ─── Email de confirmation ───
async function sendConfirmationEmail(props: {
  email: string;
  nomClient: string;
  commande: any;
  hasDigital: boolean;
  token: string | null;
  type_livraison: string;
  needsInvoice: boolean;
  produits: any[];
  total: number;
  methode: string;
}) {
  const {
    email, nomClient, commande, hasDigital, token,
    type_livraison, needsInvoice, produits, total, methode,
  } = props;

  if (!email) {
    console.log("[Email] Pas d'email client — pas d'envoi");
    return;
  }

  const orderId = commande?.id || 'N/A';
  const orderNumber = typeof orderId === 'number' ? String(orderId).slice(-6).toUpperCase() : String(orderId).slice(-6).toUpperCase();

  const produitsList = produits.map(p =>
    `• ${sanitizeString(p.name, 100)} × ${p.quantity} — ${(p.price * p.quantity).toFixed(2).replace('.', ',')} €`
  ).join('\n');

  const digitalProducts = produits.filter(p => p.type === 'digital');
  const physicalProducts = produits.filter(p => p.type !== 'digital');

  const subject = needsInvoice
    ? `✅ Facture Taka Inside — Commande #${orderNumber}`
    : `✅ Confirmation d'achat — Taka Inside`;

  let body = `Bonjour ${nomClient},

${needsInvoice ? '🧾 FACTURE' : '📧 CONFIRMATION'} — Commande #${orderNumber}

Produits :
${produitsList}

Total : ${total.toFixed(2).replace('.', ',')} €
Moyen de paiement : ${methode}
`;

  if (digitalProducts.length > 0) {
    body += `
🎵 Téléchargement
`;
    digitalProducts.forEach(p => {
      body += `• ${p.name} : prêt à télécharger\n`;
    });
    if (token) {
      body += `Lien de téléchargement : ${appUrl}/telecharger/${token}\n`;
      body += `Ce lien est valable 7 jours et permet jusqu'à 3 téléchargements.\n`;
    }
    body += `Vous pouvez aussi consulter votre commande ici : ${appUrl}/commande/${orderId}\n`;
  }

  if (physicalProducts.length > 0) {
    body += `
📦 Livraison
Votre commande contient ${physicalProducts.length} article(s) physique(s).
Elle sera préparée et expédiée sous 2-3 jours ouvrés.
Vous recevrez un email avec le numéro de suivi dès l'expédition.
`;
  }

  if (needsInvoice) {
    body += `
🧾 Facture
Votre facture complète est jointe à cet email et disponible dans votre espace commande :
${appUrl}/commande/${orderId}
`;
  } else {
    body += `
📧 Reçu simplifié
Cet email fait office de reçu d'achat.
`;
  }

  body += `
Merci pour votre soutien !
L'équipe Taka Inside
${appUrl}
`;

  const html = buildEmailHtml({
    nomClient,
    orderNumber,
    produits,
    total,
    hasDigital,
    token,
    type_livraison,
    needsInvoice,
    digitalProducts,
    physicalProducts,
    orderId,
    methode,
  });

  try {
    const emailApiUrl = `${appUrl}/api/email/send`;
    await fetch(emailApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject,
        text: body,
        html,
        from: "Taka Inside <commandes@takainside.bj>",
      }),
    });

    console.log("[Email] Confirmation envoyée à", email);
  } catch (err) {
    console.error("[Email] Erreur envoi:", err);
  }
}

function buildEmailHtml(props: {
  nomClient: string;
  orderNumber: string;
  produits: any[];
  total: number;
  hasDigital: boolean;
  token: string | null;
  type_livraison: string;
  needsInvoice: boolean;
  digitalProducts: any[];
  physicalProducts: any[];
  orderId: string;
  methode: string;
}): string {
  const { nomClient, orderNumber, produits, total, token, needsInvoice, digitalProducts, physicalProducts, orderId, methode } = props;

  const produitsRows = produits.map(p => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #E5E7EB;">${sanitizeString(p.name, 100)}</td>
      <td style="padding:12px;border-bottom:1px solid #E5E7EB;text-align:center;">${p.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #E5E7EB;text-align:right;">${(p.price * p.quantity).toFixed(2).replace('.', ',')} €</td>
    </tr>
  `).join('');

  let digitalBlock = '';
  if (digitalProducts.length > 0) {
    digitalBlock = `
      <div style="background:#DCFCE7;border:1px solid #86EFAC;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;font-weight:700;color:#166534;">🎵 Votre contenu digital est prêt</p>
        ${token ? `<a href="${appUrl}/telecharger/${token}" style="display:inline-block;background:#16A34A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Télécharger maintenant →</a>
        <p style="margin:12px 0 0;font-size:12px;color:#15803D;">Lien valable 7 jours, 3 téléchargements maximum.</p>` : '<p style="margin:0;font-size:14px;color:#15803D;">Votre lien de téléchargement sera disponible dans votre espace commande.</p>'}
      </div>
    `;
  }

  let physicalBlock = '';
  if (physicalProducts.length > 0) {
    physicalBlock = `
      <div style="background:#FEF9C3;border:1px solid #FDE047;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 8px;font-weight:700;color:#854D0E;">📦 Livraison en cours de préparation</p>
        <p style="margin:0;font-size:14px;color:#854D0E;">Votre commande sera préparée et expédiée sous 2-3 jours ouvrés. Vous recevrez un email avec le numéro de suivi.</p>
      </div>
    `;
  }

  let invoiceBlock = '';
  if (needsInvoice) {
    invoiceBlock = `
      <div style="background:#0A0A0A;color:#F5F3EF;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 8px;font-weight:700;">🧾 Facture complète</p>
        <p style="margin:0;font-size:14px;color:#9CA3AF;">Votre facture légale est disponible dans votre espace commande : <a href="${appUrl}/commande/${orderId}" style="color:#E5B800;">Commande #${orderNumber}</a>.</p>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${needsInvoice ? 'Facture' : 'Confirmation'} Taka Inside</title>
  </head>
  <body style="margin:0;padding:0;background:#F5F3EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:white;">
      <div style="background:#0A0A0A;color:white;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;">${needsInvoice ? '🧾 Facture' : '✅ Confirmation'}</h1>
        <p style="margin:8px 0 0;color:#9CA3AF;">Commande #${orderNumber}</p>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">Bonjour ${nomClient},</p>
        <p style="font-size:14px;color:#6B7280;">Merci pour votre commande. Voici le récapitulatif :</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
          <thead>
            <tr style="background:#F3F4F6;">
              <th style="padding:12px;text-align:left;">Produit</th>
              <th style="padding:12px;text-align:center;">Qté</th>
              <th style="padding:12px;text-align:right;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${produitsRows}
          </tbody>
        </table>

        <div style="border-top:2px solid #E5E7EB;padding-top:16px;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;">
            <span>Total</span>
            <span>${total.toFixed(2).replace('.', ',')} €</span>
          </div>
          <p style="margin:8px 0 0;font-size:12px;color:#6B7280;">Moyen de paiement : ${methode}</p>
        </div>

        ${digitalBlock}
        ${physicalBlock}
        ${invoiceBlock}

        <p style="margin-top:24px;font-size:14px;">
          Vous pouvez consulter votre commande à tout moment :<br>
          <a href="${appUrl}/commande/${orderId}" style="color:#16A34A;font-weight:600;">${appUrl}/commande/${orderId}</a>
        </p>

        <p style="margin-top:24px;font-size:14px;color:#6B7280;">
          Merci pour votre soutien !<br>
          <strong>L'équipe Taka Inside</strong>
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}
