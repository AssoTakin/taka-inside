import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "xof", metadata = {} } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Montant invalide" },
        { status: 400 }
      );
    }

    // Stripe API key depuis les variables d'environnement
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe non configuré" },
        { status: 500 }
      );
    }

    // Construire le body avec les metadata
    const bodyParams = new URLSearchParams();
    bodyParams.append("amount", String(amount));
    bodyParams.append("currency", currency);
    bodyParams.append("automatic_payment_methods[enabled]", "true");
    
    Object.entries(metadata).forEach(([k, v]) => {
      bodyParams.append(`metadata[${k}]`, String(v));
    });

    // Appel API Stripe pour créer un PaymentIntent
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Erreur Stripe" },
        { status: 500 }
      );
    }

    const paymentIntent = await response.json();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Erreur création PaymentIntent:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
