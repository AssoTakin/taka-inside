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
  soutien_titre_dialogue?: string;
  soutien_label_valider?: string;
}

interface SupportButtonProps {
  product: Product;
}

export default function SupportButton({ product }: SupportButtonProps) {
  const { addItem } = useCart();
  const [isOpen, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const minAmount = useMemo(() => {
    const supplement = Number(product.soutien_min_supplement ?? 5);
    return product.prix + (isNaN(supplement) ? 5 : supplement);
  }, [product.prix, product.soutien_min_supplement]);

  const currentValue = useMemo(() => {
    const val = parseFloat(amount.replace(",", "."));
    return isNaN(val) ? 0 : val;
  }, [amount]);

  const isValid = currentValue >= minAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    addItem({
      id: `${product.documentId}-support`,
      name: product.nom,
      price: currentValue,
      quantity: 1,
      image: product.image || undefined,
      productType: "support",
      isSupport: true,
    });
    setOpen(false);
    setAmount("");
  };

  if (product.activer_soutien === false) return null;

  const label = product.soutien_label_bouton?.trim() || "Soutenir le produit";
  const priceLabel = product.soutien_prix_libre_label?.trim() || "Votre montant (€)";
  const message = (product.soutien_message?.trim() || "Soutenez ce produit en proposant un prix libre, supérieur au montant affiché.").replace("{min}", String(minAmount));
  const title = product.soutien_titre_dialogue?.trim() || "Soutenir ce produit";
  const validateLabel = product.soutien_label_valider?.trim() || "Ajouter au panier";

  return (
    <div className="w-full md:w-auto">
      {!isOpen ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all min-w-[220px] text-center border-2 border-taka-yellow text-taka-yellow hover:bg-taka-yellow hover:text-black"
        >
          {label}
        </button>
      ) : (
        <div className="w-full md:w-[300px] bg-white rounded-xl border border-taka-yellow p-4 shadow-lg">
          <p className="font-bold text-black mb-2">{title}</p>
          <p className="text-sm text-gray-700 mb-3">{message}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm text-gray-800">
              {priceLabel}
              <input
                type="number"
                inputMode="decimal"
                min={minAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min. ${formatPrice(minAmount)}`}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-taka-yellow focus:ring-taka-yellow"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="flex-1 px-4 py-2 rounded-lg bg-taka-yellow text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validateLabel}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
