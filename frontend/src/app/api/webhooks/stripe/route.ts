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
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { id: transaction_id, metadata, amount } = paymentIntent;

      // Idempotence : vérifier si commande existe déjà
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

      // Extraction métadonnées
      const nomClient = metadata?.nomClient || "Client Stripe";
      const email = metadata?.email || paymentIntent.receipt_email || "";
      const telephone = metadata?.telephone || "";
      const adresse = metadata?.adresse || "";
      const ville = metadata?.ville || "";
      const code_postal = metadata?.code_postal || "";
      const pays = metadata?.pays || "Benin";
      const type_livraison = metadata?.type_livraison || "physique";
      const cout_livraison = Number(metadata?.cout_livraison) || 0;
      const produitsRaw = metadata?.produits || "[]";
      const hasDigital = metadata?.hasDigital === "true";

      let produits = [];
      try {
        produits = JSON.parse(produitsRaw);
      } catch {
        produits = [];
      }

      // Token téléchargement si contenu digital
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
          stripe_event_id: event.id, // idempotence côté Strapi
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

      // TODO: Envoyer email de confirmation via Resend quand la clé sera dispo
      // await sendConfirmationEmail(email, nomClient, data.data);

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Paiement échoué: ${paymentIntent.id}`);
      // TODO: Notifier l'admin / marquer commande en échec
      break;
    }

    default:
      console.log(`[Webhook] Événement non géré: ${event.type}`);
  }
}
