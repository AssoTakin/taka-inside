import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, callback_url, currency = "xof" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "FedaPay non configuré — ajoutez FEDAPAY_SECRET_KEY dans les variables d'environnement" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description || "Don Taka Inside",
        amount: amount,
        currency: { code: currency.toUpperCase(), name: currency.toUpperCase() },
        callback_url:
          callback_url ||
          `${process.env.NEXT_PUBLIC_APP_URL || "https://frontend-mu-one-82.vercel.app"}/paiement/confirmation?method=fedapay`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("FedaPay error:", data);
      return NextResponse.json(
        { error: data.message || "Erreur FedaPay" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: data.url || data.data?.url,
      transactionId: data.id || data.data?.id,
    });
  } catch (err: unknown) {
    console.error("FedaPay error:", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
