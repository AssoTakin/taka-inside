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
      console.error("[FedaPay] FEDAPAY_SECRET_KEY manquante");
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }

    // Conversion EUR → XOF (FedaPay ne supporte que XOF)
    const inputCurrency = currency.toUpperCase();
    let finalAmount = Math.round(amount * 100); // centimes
    let finalCurrency = inputCurrency;
    
    if (inputCurrency === 'EUR') {
      const EUR_TO_XOF = 655.957;
      finalAmount = Math.round(amount * EUR_TO_XOF); // pas de centimes en XOF
      finalCurrency = 'XOF';
    }

    const response = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description || "Don Taka Inside",
        amount: finalAmount,
        currency: { iso: finalCurrency },
        callback_url:
          callback_url ||
          `${process.env.NEXT_PUBLIC_APP_URL || "https://frontend-mu-one-82.vercel.app"}/paiement/confirmation?method=fedapay`,
      }),
    });

    const txData = await response.json();
    console.log("[FedaPay] Response:", JSON.stringify(txData).slice(0, 1000));
    const tx = txData["v1/transaction"] || txData["transaction"] || txData;

    if (!response.ok || !tx?.id) {
      console.error("[FedaPay] Create error:", JSON.stringify(txData).slice(0, 500));
      return NextResponse.json(
        { error: "Impossible de créer le paiement — réessayez plus tard" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
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
      originalAmount: amount,
      originalCurrency: inputCurrency,
      convertedAmount: finalAmount,
      convertedCurrency: finalCurrency,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: unknown) {
    console.error("FedaPay error:", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
