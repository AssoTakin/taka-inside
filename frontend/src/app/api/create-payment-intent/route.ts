import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquant");
  }
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const {
      amount,
      currency = "xof",
      metadata = {},
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
      hasDigital,
    } = await req.json();

    // Stripe exige un minimum de 50 cents (~300 FCFA au taux actuel)
    const minAmount = currency === 'xof' ? 300 : 50;
    if (!amount || amount < minAmount) {
      return NextResponse.json(
        { error: `Montant minimum: ${minAmount} ${currency.toUpperCase()}` },
        { status: 400 }
      );
    }

    // Métadonnées enrichies pour le webhook
    const enrichedMetadata = {
      ...metadata,
      ...(nomClient && { nomClient }),
      ...(email && { email }),
      ...(telephone && { telephone }),
      ...(adresse && { adresse }),
      ...(ville && { ville }),
      ...(code_postal && { code_postal }),
      ...(pays && { pays }),
      ...(type_livraison && { type_livraison }),
      ...(cout_livraison !== undefined && { cout_livraison: String(cout_livraison) }),
      ...(produits && { produits: JSON.stringify(produits) }),
      ...(hasDigital !== undefined && { hasDigital: String(hasDigital) }),
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: enrichedMetadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
