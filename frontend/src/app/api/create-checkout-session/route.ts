import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-\(\)\.]{8,20}$/.test(phone.trim()) && phone.replace(/[^0-9]/g, '').length >= 8;
}

function sanitizeString(str: unknown, maxLength = 200): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.json();
    const { items, customer, hasDigital, hasPhysical, successUrl, cancelUrl, amount, frequency, shipping } = body;

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
      return NextResponse.json({ url: session.url, sessionId: session.id, metadata: session.metadata });
    }

    // ─── Mode BOUTIQUE (checkout.html) ───
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    // Validation serveur des données client
    const email = sanitizeString(customer?.email, 100);
    const nom = sanitizeString(customer?.nom, 100);
    const prenom = sanitizeString(customer?.prenom, 100);
    const telephone = sanitizeString(customer?.telephone, 50);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (!nom || nom.length < 2) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (!prenom || prenom.length < 2) {
      return NextResponse.json({ error: "Prénom invalide" }, { status: 400 });
    }
    if (!telephone || !isValidPhone(telephone)) {
      return NextResponse.json({ error: "Téléphone invalide" }, { status: 400 });
    }

    // Validation adresse si nécessaire
    const cartHasPhysical = items.some((item: any) => !isDigitalItem(item));
    const needsInvoice = !!customer?.needsInvoice || cartHasPhysical;

    let adresse = '';
    let ville = '';
    let codePostal = '';
    let pays = sanitizeString(customer?.pays, 50) || 'FR';

    if (needsInvoice || cartHasPhysical) {
      adresse = sanitizeString(customer?.adresse, 200);
      ville = sanitizeString(customer?.ville, 100);
      codePostal = sanitizeString(customer?.codePostal, 20);

      if (!adresse || adresse.length < 5) {
        return NextResponse.json({ error: "Adresse invalide" }, { status: 400 });
      }
      if (!ville || ville.length < 2) {
        return NextResponse.json({ error: "Ville invalide" }, { status: 400 });
      }
      if (!codePostal || codePostal.length < 3) {
        return NextResponse.json({ error: "Code postal invalide" }, { status: 400 });
      }
    }

    // Construction des line_items
    const lineItems = items.map((item: any) => {
      const name = sanitizeString(item.name, 100) || "Produit Taka Inside";
      const description = item.productType
        ? (isDigitalItem(item) ? "Téléchargement digital" : "Produit physique")
        : undefined;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name,
            ...(description ? { description } : {}),
          },
          unit_amount: Math.round((Number(item.price) || 0) * 100),
        },
        quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
      };
    });

    // Frais de livraison
    const shippingCost = Math.max(0, Number(shipping?.cost) || 0);
    if (cartHasPhysical && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: `Livraison ${sanitizeString(shipping?.type, 50) || 'standard'}` },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Calcul poids pour metadata
    const poidsKg = estimateWeight(items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.nextUrl.origin}/paiement/confirmation?status=success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/checkout?status=cancelled`,
      customer_email: email,
      billing_address_collection: needsInvoice ? 'required' : 'auto',
      shipping_address_collection: cartHasPhysical ? {
        allowed_countries: ['FR', 'BE', 'CH', 'CA', 'BJ', 'CI', 'TG', 'US', 'GB', 'DE', 'IT', 'ES', 'NL'],
      } : undefined,
      metadata: {
        nomClient: `${prenom} ${nom}`.trim(),
        email,
        prenom,
        nom,
        telephone,
        adresse,
        ville,
        code_postal: codePostal,
        pays,
        needsInvoice: needsInvoice ? "true" : "false",
        produits: JSON.stringify(items.map((item: any) => ({
          id: String(item.id || ''),
          name: sanitizeString(item.name, 100),
          quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
          price: Number(item.price) || 0,
          type: isDigitalItem(item) ? 'digital' : 'physique',
          productType: sanitizeString(item.productType, 50),
          size: sanitizeString(item.size, 20),
        }))),
        hasDigital: String(!!items.some(isDigitalItem)),
        hasPhysical: String(cartHasPhysical),
        type_livraison: cartHasPhysical ? 'physique' : 'digital',
        cout_livraison: String(shippingCost),
        poids_kg: String(poidsKg),
        shipping_type: sanitizeString(shipping?.type, 50) || 'standard',
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id, metadata: session.metadata });
  } catch (err: unknown) {
    console.error("Stripe Checkout error:", err);
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function isDigitalItem(item: any): boolean {
  return item.productType === 'digital' || item.productType === 'album' || item.productType === 'single';
}

function estimateWeight(items: any[]): number {
  const physicalCount = items
    .filter(item => !isDigitalItem(item))
    .reduce((sum, item) => sum + Math.max(1, Math.round(Number(item.quantity) || 1)), 0);
  return Math.max(0.3, physicalCount * 0.3);
}
