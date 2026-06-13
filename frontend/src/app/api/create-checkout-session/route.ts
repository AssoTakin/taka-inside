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
    const body = await req.json();
    const { items, customer, hasDigital, hasPhysical, successUrl, cancelUrl, amount, frequency } = body;

    // ─── Mode DON (legacy / faire-un-don.html) ───
    if (amount && !items) {
      const mode = frequency === 'monthly' ? 'subscription' : 'payment';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: {
              name: frequency === 'monthly' ? "Don mensuel Taka Inside" : "Don ponctuel Taka Inside",
            },
            unit_amount: Math.round(amount * 100),
            ...(frequency === 'monthly' && {
              recurring: { interval: 'month' as const },
            }),
          },
          quantity: 1,
        }],
        mode: mode as "payment" | "subscription",
        success_url: successUrl || `${req.nextUrl.origin}/paiement/confirmation?status=success`,
        cancel_url: cancelUrl || `${req.nextUrl.origin}/faire-un-don.html?status=cancelled`,
        metadata: {
          type: "don",
          amount: String(amount),
          frequency: frequency || "one-time",
        },
      });
      return NextResponse.json({ url: session.url });
    }

    // ─── Mode BOUTIQUE (checkout.html) ───
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
        nomClient: `${customer?.prenom || ""} ${customer?.nom || ""}`.trim() || "Client",
        email: customer?.email || "",
        telephone: customer?.telephone || "",
        adresse: customer?.adresse || "",
        ville: customer?.ville || "",
        code_postal: customer?.codePostal || "",
        pays: customer?.pays || "",
        produits: JSON.stringify(items.map((item: any) => ({ name: item.name, quantity: item.quantity, price: item.price, type: item.productType || 'physique' }))),
        hasDigital: String(hasDigital || false),
        hasPhysical: String(hasPhysical || false),
        type_livraison: hasPhysical ? 'physique' : 'digital',
        cout_livraison: '0',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe Checkout error:", err);
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
