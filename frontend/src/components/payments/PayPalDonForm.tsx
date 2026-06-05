'use client';

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { formatPrice } from "@/lib/price";

interface PayPalDonFormProps {
  amount: number;
  frequency?: "one-time" | "monthly";
  onSuccess?: () => void;
}

export default function PayPalDonForm({ amount, frequency = "one-time", onSuccess }: PayPalDonFormProps) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <div className="space-y-4">
      {success ? (
        <div className="bg-taka-green/15 text-taka-green p-4 rounded-xl text-center">
          <p className="font-semibold">✅ Paiement PayPal confirmé !</p>
          <p className='text-sm'>Merci pour votre don de {formatPrice(amount)}.</p>
        </div>
      ) : (
        <>
          <PayPalButtons
            style={{ layout: "vertical", color: "black", shape: "pill" }}
            createOrder={async () => {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount,
                  currency: "EUR", // PayPal gère l'EUR directement
                  description: `Don Taka Inside - ${frequency === "monthly" ? "Mensuel" : "Ponctuel"}`,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Erreur PayPal");
              return data.id;
            }}
            onApprove={async (data) => {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              });
              const captureData = await res.json();
              if (res.ok) {
                setSuccess(true);
                setMessage("");
                onSuccess?.();
              } else {
                setMessage(captureData.error || "Erreur lors de la capture");
              }
            }}
            onError={(err) => {
              setMessage("Erreur PayPal: " + (err instanceof Error ? err.message : String(err)));
            }}
          />
          {message && (
            <div className="bg-taka-red/15 text-taka-red p-3 rounded-lg text-sm">{message}</div>
          )}
        </>
      )}
    </div>
  );
}
