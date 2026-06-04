"use client";

import { useState } from "react";
import { toFCFA } from "@/lib/price";

interface FedaPayDonButtonProps {
  /** Montant en EUR (ex: 12.50 pour 12,50 €) */
  amountEUR: number;
  onSuccess?: () => void;
  description?: string;
}

export default function FedaPayDonButton({ amountEUR, onSuccess, description }: FedaPayDonButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");

    // Convertir EUR → FCFA pour l'API FedaPay (qui attend un montant entier en XOF)
    const fcfaAmount = Math.round(toFCFA(amountEUR));

    if (fcfaAmount <= 0 || Number.isNaN(fcfaAmount)) {
      setError("Veuillez sélectionner un montant valide");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: fcfaAmount,
        description: description || `Paiement Taka Inside — ${amountEUR.toFixed(2)} €`,
      };

      const res = await fetch("/api/fedapay/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        console.error("[FedaPay] Invalid JSON response");
      }

      if (!res.ok || data.error) {
        setError("Paiement indisponible — réessayez plus tard");
        setLoading(false);
        return;
      }

      if (typeof data.url === "string" && data.url) {
        window.location.href = data.url;
      } else {
        setError("Paiement indisponible — réessayez plus tard");
        setLoading(false);
      }
    } catch (err) {
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
