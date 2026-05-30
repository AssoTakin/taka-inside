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
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID manquant" }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      return NextResponse.json({ error: "PayPal non configuré" }, { status: 500 });
    }

    const accessToken = await getPayPalAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureRes.ok) {
      const err = await captureRes.json();
      return NextResponse.json(
        { error: err.message || "Erreur capture PayPal" },
        { status: 500 }
      );
    }

    const captureData = await captureRes.json();
    return NextResponse.json({
      status: captureData.status,
      payer: captureData.payer,
      purchase_units: captureData.purchase_units,
    });
  } catch (error) {
    console.error("Erreur PayPal capture:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
