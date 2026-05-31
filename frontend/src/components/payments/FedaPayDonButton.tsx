"use client";

import { useState } from "react";

export default function FedaPayDonButton({ amount }: { amount: number | string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");

    // === DEBUG ===
    console.log("[FedaPay] Raw amount prop:", amount, "type:", typeof amount);

    // Robustesse: convertir en nombre entier
    const numericAmount = typeof amount === 'string' ? parseInt(amount, 10) || 0 : Math.round(Number(amount) || 0);

    console.log("[FedaPay] Parsed amount:", numericAmount);

    if (numericAmount <= 0 || Number.isNaN(numericAmount)) {
      setError("Veuillez sélectionner un montant valide");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: numericAmount,
        description: `Don Taka Inside — ${numericAmount.toLocaleString()} FCFA`,
      };
      console.log("[FedaPay] Sending payload:", payload);

      const res = await fetch("/api/fedapay/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[FedaPay] Response status:", res.status);

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        console.error("[FedaPay] Invalid JSON response");
      }

      console.log("[FedaPay] Response data:", data);

      if (!res.ok || data.error) {
        console.error("[FedaPay] Server error:", res.status, data.error);
        setError("Paiement indisponible — réessayez plus tard");
        setLoading(false);
        return;
      }

      if (typeof data.url === "string" && data.url) {
        console.log("[FedaPay] Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error("[FedaPay] Missing URL in response");
        setError("Paiement indisponible — réessayez plus tard");
        setLoading(false);
      }
    } catch (err) {
      console.error("[FedaPay] Network error:", err);
      setError("Connexion instable — vérifiez votre réseau");
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-6">
      <p className="text-taka-gray text-sm mb-4">
        Paiement sécurisé via Mobile Money (MTN, Moov, Celtiis)
      </p>

      {error && (
        <div className="bg-taka-red/15 text-taka-red rounded-xl p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-taka-yellow text-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirection...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Payer avec Mobile Money
          </>
        )}
      </button>
    </div>
  );
}
