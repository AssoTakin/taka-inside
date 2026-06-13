'use client';

import { useState } from "react";
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
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id.toString(),
      name: product.nom,
      price: product.prix,
      quantity: 1,
      image: product.image || undefined,
      productType: product.type === "digital" || product.type === "album" || product.type === "single" ? product.type : undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setIsOpen(true);
      setAdded(false);
    }, 500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all ${
        added
          ? "bg-green-500 text-white"
          : "bg-taka-black text-white hover:bg-taka-yellow hover:text-taka-black"
      }`}
    >
      {added ? "✓ Ajouté !" : `Ajouter au panier — ${formatPrice(product.prix)}`}
    </button>
  );
}
