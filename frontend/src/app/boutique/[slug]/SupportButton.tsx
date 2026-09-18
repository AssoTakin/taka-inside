'use client';

import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/price";

interface Product {
  id: number;
  documentId: string;
  nom: string;
  prix: number;
  type: string;
  image: string | null;
  slug: string;
  description: string;
  activer_soutien?: boolean;
  soutien_min_supplement?: number;
  soutien_label_bouton?: string;
  soutien_prix_libre_label?: string;
  soutien_message?: string;
}

export default function SupportButton({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart();
  const [isOpen, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [added, setAdded] = useState(false);

  const minSupport = useMemo(
    () => product.prix + (product.soutien_min_supplement ?? 5),
    [product.prix, product.soutien_min_supplement]
  );

  if (!product.activer_soutien) return null;

  const handleAdd = () => {
    const numericAmount = Number(amount.replace(",", "."));
    if (!amount || Number.isNaN(numericAmount) || numericAmount < minSupport) {
      setError(`Le montant minimum est de ${formatPrice(minSupport)}.`);
      return;
    }
    setError("");

    const supportId = `${product.id}-support`;
    addItem({
      id: supportId,
      name: `${product.nom} — Soutien`,
      price: numericAmount,
      quantity: 1,
      image: product.image || undefined,
      productType: "support",
    });

    setAdded(true);
    setTimeout(() => {
      setIsOpen(true);
      setAdded(false);
      setOpen(false);
      setAmount("");
    }, 500);
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all min-w-[220px] text-center border-2 border-taka-yellow text-taka-black bg-taka-yellow hover:bg-taka-black hover:text-taka-yellow hover:border-taka-black"
        >
          {product.soutien_label_bouton || "Soutenir le produit"}
        </button>
      ) : (
        <div className="w-full md:w-auto rounded-xl border border-taka-gray-light bg-white p-4 shadow-sm">
          <p className="text-sm text-taka-gray mb-2">
            {product.soutien_message || "Soutenez ce produit en proposant un prix libre."}
          </p>
          <label htmlFor="support-amount" className="block text-sm font-medium text-taka-black mb-1">
            {product.soutien_prix_libre_label || "Votre montant (€)"}
          </label>
          <input
            id="support-amount"
            type="number"
            min={minSupport}
            step="0.01"
            placeholder={`Min. ${formatPrice(minSupport)}`}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2 rounded-lg border border-taka-gray-light focus:outline-none focus:ring-2 focus:ring-taka-yellow mb-3"
          />
          {error && (
            <p className="text-taka-red text-sm mb-2">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-base transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-taka-yellow text-taka-black hover:bg-taka-black hover:text-taka-yellow"
              }`}
            >
              {added ? "✓ Ajouté !" : "Ajouter au panier"}
            </button>
            <button
              onClick={() => { setOpen(false); setAmount(""); setError(""); }}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-taka-gray hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
