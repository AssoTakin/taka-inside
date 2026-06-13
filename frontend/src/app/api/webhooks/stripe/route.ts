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
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const strapiToken = process.env.STRAPI_API_TOKEN;

  switch (event.type) {
    // ─── Événement principal : session checkout complétée ───
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const transaction_id = session.payment_intent as string || session.id;

      // Idempotence
      const existingRes = await fetch(
        `${strapiUrl}/api/commandes?filters[transaction_id][$eq]=${transaction_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
          },
        }
      );

      if (existingRes.ok) {
        const existing = await existingRes.json();
        if (existing.data?.length > 0) {
          console.log(`[Webhook] Commande déjà existante pour ${transaction_id}`);
          return;
        }
      }

      // ─── Fusion données : formulaire (metadata) + Stripe Checkout ───
      const meta = session.metadata || {};
      const cust = session.customer_details;

      // Nom : Stripe Checkout > formulaire
      const nomClient = cust?.name?.trim()
        || meta.nomClient
        || "Client Stripe";

      // Email : Stripe Checkout > formulaire
      const email = cust?.email?.trim()
        || meta.email
        || "";

      // Téléphone : Stripe Checkout > formulaire
      const telephone = cust?.phone?.trim()
        || meta.telephone
        || "";

      // Adresse : fusion intelligente
      const stripeAddr = cust?.address;
      const needsInvoice = meta.needsInvoice === "true" || meta.type_livraison === "physique";

      // Si l'utilisateur a rempli l'adresse sur notre formulaire, on la garde
      // Sinon, on prend celle de Stripe Checkout si disponible
      const adresse = meta.adresse?.trim()
        || stripeAddr?.line1
        || (needsInvoice ? "" : "N/A — Contenu digital");

      const ville = meta.ville?.trim()
        || stripeAddr?.city
        || (needsInvoice ? "" : "N/A");

      const code_postal = meta.code_postal?.trim()
        || stripeAddr?.postal_code
        || (needsInvoice ? "" : "N/A");

      const pays = meta.pays?.trim()
        || stripeAddr?.country
        || "FR";

      const type_livraison = meta.type_livraison || "digital";
      const cout_livraison = Number(meta.cout_livraison) || 0;
      const produitsRaw = meta.produits || "[]";
      const hasDigital = meta.hasDigital === "true";

      let produits = [];
      try {
        produits = JSON.parse(produitsRaw);
      } catch {
        produits = [];
      }

      // Token téléchargement si digital
      let token_telechargement = null;
      let date_expiration_telechargement = null;
      if (hasDigital) {
        token_telechargement = crypto.randomUUID();
        const exp = new Date();
        exp.setDate(exp.getDate() + 7);
        date_expiration_telechargement = exp.toISOString();
      }

      const total = (session.amount_total || 0) / 100;

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
          produits,
          total,
          montant_paye: total,
          methode_paiement: "stripe",
          transaction_id,
          statut: "paye",
          token_telechargement,
          date_expiration_telechargement,
          nombre_telechargements: 0,
          stripe_event_id: event.id,
          // ─── Infos facturation ───
          needs_invoice: needsInvoice,
          adresse_facturation: needsInvoice ? {
            ligne1: stripeAddr?.line1 || meta.adresse || "",
            ligne2: stripeAddr?.line2 || "",
            ville: stripeAddr?.city || meta.ville || "",
            code_postal: stripeAddr?.postal_code || meta.code_postal || "",
            pays: stripeAddr?.country || meta.pays || "",
          } : null,
        },
      };

      const createRes = await fetch(`${strapiUrl}/api/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
        body: JSON.stringify(commandePayload),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(
          `Erreur création commande: ${err.error?.message || createRes.statusText}`
        );
      }

      const data = await createRes.json();
      console.log(`[Webhook] Commande créée: ${data.data?.id} pour ${transaction_id}`);

      // ─── Envoi email de confirmation ───
      await sendConfirmationEmail({
        email,
        nomClient,
        commande: data.data,
        hasDigital,
        token_telechargement,
        type_livraison,
        needsInvoice,
        produits,
        total,
      });

      break;
    }

    // ─── Fallback : payment_intent.succeeded (pour compatibilité) ───
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { id: transaction_id, metadata, amount } = paymentIntent;

      // Idempotence
      const existingRes = await fetch(
        `${strapiUrl}/api/commandes?filters[transaction_id][$eq]=${transaction_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
          },
        }
      );

      if (existingRes.ok) {
        const existing = await existingRes.json();
        if (existing.data?.length > 0) {
          console.log(`[Webhook] Commande déjà existante pour ${transaction_id}`);
          return;
        }
      }

      const nomClient = metadata?.nomClient || "Client Stripe";
      const email = metadata?.email || paymentIntent.receipt_email || "";
      const telephone = metadata?.telephone || "";
      const adresse = metadata?.adresse || "";
      const ville = metadata?.ville || "";
      const code_postal = metadata?.code_postal || "";
      const pays = metadata?.pays || "FR";
      const type_livraison = metadata?.type_livraison || "digital";
      const cout_livraison = Number(metadata?.cout_livraison) || 0;
      const produitsRaw = metadata?.produits || "[]";
      const hasDigital = metadata?.hasDigital === "true";
      const needsInvoice = metadata?.needsInvoice === "true" || type_livraison === "physique";

      let produits = [];
      try {
        produits = JSON.parse(produitsRaw);
      } catch {
        produits = [];
      }

      let token_telechargement = null;
      let date_expiration_telechargement = null;
      if (hasDigital) {
        token_telechargement = crypto.randomUUID();
        const exp = new Date();
        exp.setDate(exp.getDate() + 7);
        date_expiration_telechargement = exp.toISOString();
      }

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
          produits,
          total: amount / 100,
          montant_paye: amount / 100,
          methode_paiement: "stripe",
          transaction_id,
          statut: "paye",
          token_telechargement,
          date_expiration_telechargement,
          nombre_telechargements: 0,
          stripe_event_id: event.id,
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

      const createRes = await fetch(`${strapiUrl}/api/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
        body: JSON.stringify(commandePayload),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(
          `Erreur création commande: ${err.error?.message || createRes.statusText}`
        );
      }

      const data = await createRes.json();
      console.log(`[Webhook] Commande créée (fallback PI): ${data.data?.id} pour ${transaction_id}`);

      await sendConfirmationEmail({
        email,
        nomClient,
        commande: data.data,
        hasDigital,
        token_telechargement,
        type_livraison,
        needsInvoice,
        produits,
        total: amount / 100,
      });

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

// ─── Email de confirmation ───
async function sendConfirmationEmail(props: {
  email: string;
  nomClient: string;
  commande: any;
  hasDigital: boolean;
  token_telechargement: string | null;
  type_livraison: string;
  needsInvoice: boolean;
  produits: any[];
  total: number;
}) {
  const {
    email, nomClient, commande, hasDigital, token_telechargement,
    type_livraison, needsInvoice, produits, total,
  } = props;

  if (!email) {
    console.log("[Email] Pas d'email client — pas d'envoi");
    return;
  }

  const emailUrl = process.env.NEXT_PUBLIC_APP_URL || "https://takainside.org";

  // Corps du mail
  const produitsList = produits.map(p => `• ${p.name} × ${p.quantity} — ${(p.price * p.quantity).toFixed(2).replace('.', ',')} €`).join('\n');

  const subject = needsInvoice
    ? `✅ Facture Taka Inside — Commande #${commande?.id || 'N/A'}`
    : `✅ Confirmation d'achat — Taka Inside`;

  const body = `Bonjour ${nomClient},

${needsInvoice ? '🧾 FACTURE' : '📧 CONFIRMATION'} — Commande #${commande?.id || 'N/A'}

Produits :
${produitsList}

Total : ${total.toFixed(2).replace('.', ',')} €

${hasDigital ? `
🎵 Téléchargement
Votre contenu digital est prêt : ${emailUrl}/telecharger/${token_telechargement}
Lien valable 7 jours, 3 téléchargements maximum.` : ''}

${type_livraison === 'physique' ? `
📦 Livraison
Votre commande sera préparée et expédiée sous 2-3 jours ouvrés.
Vous recevrez un email avec le numéro de suivi.` : ''}

${needsInvoice ? `
🧾 Facture
Votre facture complète est disponible dans votre espace client.
` : ''}

Merci pour votre soutien !
L'équipe Taka Inside
`;

  try {
    // Appel API email interne (si configuré)
    const emailApiUrl = `${emailUrl}/api/email/send`;
    await fetch(emailApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject,
        text: body,
        from: "Taka Inside <noreply@takainside.org>",
      }),
    }).catch(() => {
      // Email non configuré — log seulement
      console.log("[Email] API email non disponible — contenu :");
    });

    console.log("[Email] Confirmation préparée pour", email);
    console.log("[Email] Sujet:", subject);
  } catch (err) {
    console.error("[Email] Erreur envoi:", err);
  }
}
