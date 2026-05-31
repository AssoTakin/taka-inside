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
      // Ne jamais exposer les détails de configuration côté client
      console.error("[FedaPay] FEDAPAY_SECRET_KEY manquante");
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 503 }
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
        currency: { iso: currency.toUpperCase() },
        callback_url:
          callback_url ||
          `${process.env.NEXT_PUBLIC_APP_URL || "https://frontend-mu-one-82.vercel.app"}/paiement/confirmation?method=fedapay`,
      }),
    });

    const txData = await response.json();
    const tx = txData["v1/transaction"];

    if (!response.ok || !tx?.id) {
      console.error("[FedaPay] Create error:", JSON.stringify(txData).slice(0, 500));
      // Message générique côté client, détails dans les logs serveur
      return NextResponse.json(
        { error: "Impossible de créer le paiement — réessayez plus tard" },
        { status: 500 }
      );
    }

    // Générer le token/payment page
    const tokenRes = await fetch(`https://api.fedapay.com/v1/transactions/${tx.id}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });
    const tokenData = await tokenRes.json();

    return NextResponse.json({
      url: tokenData.url,
      token: tokenData.token,
      transactionId: tx.id,
      reference: tx.reference,
    });
  } catch (err: unknown) {
    console.error("FedaPay error:", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
