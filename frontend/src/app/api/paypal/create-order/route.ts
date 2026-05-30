import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Production: https://api-m.paypal.com

async function getPayPalAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Erreur authentification PayPal");
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "USD", description = "Don Taka Inside" } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      return NextResponse.json({ error: "PayPal non configuré" }, { status: 500 });
    }

    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: String(amount),
            },
            description,
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      return NextResponse.json(
        { error: err.message || "Erreur création commande PayPal" },
        { status: 500 }
      );
    }

    const order = await orderRes.json();
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("Erreur PayPal create-order:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
