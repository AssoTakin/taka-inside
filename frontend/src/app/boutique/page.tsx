'use client';

import SiteLayout from "@/components/layout/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, documentId: 'cd-taka-v1', name: "CD - Taka Volume 1", prix: 5000, type: "fixe" as const },
  { id: 2, documentId: 'tshirt-taka', name: "T-shirt Taka Inside", prix: 7500, type: "fixe" as const },
  { id: 3, documentId: 'album-tomiwa', name: "Album Digital - Tomiwa Kéfil", prix: 2500, type: "fixe" as const },
  { id: 4, documentId: 'tshirt-custom', name: "T-shirt Personnalisé", prix: 8000, type: "personnalisable" as const },
  { id: 5, documentId: 'cd-ami', name: "CD - Ami Sêdjro", prix: 4500, type: "fixe" as const },
  { id: 6, documentId: 'sac-wax', name: "Sac en wax Taka", prix: 12000, type: "fixe" as const },
  { id: 7, documentId: 'bracelet', name: "Bracelet artisanal", prix: 2000, type: "fixe" as const },
  { id: 8, documentId: 'poster', name: "Poster A3 artiste", prix: 3500, type: "fixe" as const },
];

export default function BoutiquePage() {
  const { addItem, setIsOpen } = useCart();
  const [customTexts, setCustomTexts] = useState<Record<number, string>>({});

  const handleAdd = (product: typeof PRODUCTS[0]) => {
    addItem({
      id: product.id,
      documentId: product.documentId,
      name: product.name,
      price: product.prix,
      quantity: 1,
      slug: product.documentId,
      type: product.type,
      customization: product.type === 'personnalisable' ? customTexts[product.id] : undefined,
    });
  };

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Boutique en ligne
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Notre <span className="text-taka-yellow">Boutique</span></h1>
            <p className="text-taka-gray mt-4 max-w-xl">
              CDS, t-shirts, produits dérivés et artisanat béninois. Livraison via BeniExpress ou rétrait sur place à Cotonou.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold">Nos produits</h2>
            <div className="text-sm text-taka-gray">
              Paiement sécurisé via <span className="font-semibold">Stripe</span> · <span className="font-semibold">PayPal</span> · <span className="font-semibold">Mobile Money</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-taka-gray-light group hover:shadow-lg transition-all">
                <div className="aspect-square bg-taka-gray-light flex items-center justify-center">
                  <span className="text-taka-gray">{product.type === 'fixe' ? 'Image produit' : 'Personnalisable'}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-sm">{product.name}</h3>

                  {product.type === 'personnalisable' && (
                    <input
                      type="text"
                      placeholder="Texte personnalisé..."
                      value={customTexts[product.id] || ''}
                      onChange={(e) => setCustomTexts(prev => ({ ...prev, [product.id]: e.target.value }))}
                      className="w-full mt-2 px-3 py-1.5 rounded-lg border border-taka-gray-light text-sm focus:border-taka-yellow outline-none"
                    />
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold">{product.prix.toLocaleString()} FCFA</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className="bg-taka-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-taka-yellow hover:text-taka-black transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
