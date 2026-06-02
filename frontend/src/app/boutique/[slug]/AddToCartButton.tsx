'use client';

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

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
      id: product.id,
      documentId: product.documentId,
      name: product.nom,
      price: product.prix,
      quantity: 1,
      slug: product.slug || product.documentId,
      type: product.type as "fixe" | "personnalisable" | "digital" | "album" | "single" | "merch" | "ticket",
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
      {added ? "✓ Ajouté !" : `Ajouter au panier — ${product.prix.toLocaleString("fr-FR")} FCFA`}
    </button>
  );
}
