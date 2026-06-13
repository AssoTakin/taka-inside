import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { items, customer, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name || "Produit Taka Inside" },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.nextUrl.origin}/paiement/confirmation?status=success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/checkout?status=cancelled`,
      customer_email: customer?.email,
      metadata: {
        nom: customer?.nom || "",
        prenom: customer?.prenom || "",
        telephone: customer?.telephone || "",
        adresse: customer?.adresse || "",
        ville: customer?.ville || "",
        code_postal: customer?.codePostal || "",
        pays: customer?.pays || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe Checkout error:", err);
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
