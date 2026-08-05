import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" as any });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id manquant" },
        { status: 400 }
      );
    }

    if (!sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "session_id Stripe invalide" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }

    const isSuccess = session.payment_status === "paid";
    const amountTotal = session.amount_total ?? 0;
    const customerEmail = session.customer_details?.email || session.customer_email || "";
    const metadata = session.metadata || {};

    // Reconstituer les items depuis metadata si possible
    let items: Array<{ name: string; quantity: number; type?: string }> = [];
    try {
      if (metadata.produits) {
        const parsedProducts = JSON.parse(metadata.produits);
        items = parsedProducts.map((p: any) => ({
          name: String(p.name || ""),
          quantity: Number(p.quantity || 1),
          type: String(p.type || "physique") as "digital" | "physique",
        }));
      }
    } catch {
      items = [];
    }

    const shippingCost = Number(metadata.cout_livraison || 0);
    const shippingType = metadata.shipping_type || "standard";

    return NextResponse.json({
      ok: true,
      status: session.status,
      paymentStatus: session.payment_status,
      success: isSuccess,
      amount: amountTotal / 100,
      currency: session.currency,
      email: customerEmail,
      customerName: session.customer_details?.name || `${metadata.prenom || ""} ${metadata.nom || ""}`.trim() || "",
      hasDigital: metadata.hasDigital === "true" || items.some(i => i.type === "digital"),
      hasPhysical: metadata.hasPhysical === "true" || items.some(i => i.type !== "digital"),
      needsInvoice: metadata.needsInvoice === "true",
      items,
      shipping: shippingCost > 0 ? { type: shippingType, cost: shippingCost } : undefined,
      sessionId: session.id,
      metadata,
    });
  } catch (err: unknown) {
    console.error("Stripe verify checkout session error:", err);
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message, code: err.code, type: err.type },
        { status: err.statusCode || 500 }
      );
    }
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
