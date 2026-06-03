'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/price";

interface Product {
  id: number;
  documentId: string;
  nom: string;
  prix: number;
  devise: "EUR" | "FCFA";
  type: "fixe" | "personnalisable" | "digital" | "album" | "single" | "merch" | "ticket";
  image: string | null;
  slug: string;
  description: string;
}

export default function BoutiquePage() {
  const { addItem, setIsOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [customTexts, setCustomTexts] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/produits")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.produits || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      documentId: product.documentId,
      name: product.nom,
      price: product.prix,
      currency: product.devise,
      quantity: 1,
      slug: product.slug || product.documentId,
      type: product.type,
      image: product.image || undefined,
      productType: product.type === "digital" || product.type === "album" || product.type === "single" ? product.type : undefined,
      customization: product.type === "personnalisable" ? customTexts[product.id] : undefined,
    });
  };

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-taka-yellow border-t-transparent rounded-full animate-spin" />
              <p className="text-taka-gray mt-4">Chargement des produits...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-taka-gray">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-taka-gray-light group hover:shadow-lg transition-all flex flex-col">
                  <Link href={`/boutique/${product.slug}`} className="block relative">
                    <div className="aspect-square bg-taka-gray-light flex items-center justify-center relative overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.nom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-taka-gray">{product.type === "personnalisable" ? "Personnalisable" : "Image produit"}</span>
                      )}
                      {product.type === "digital" && (
                        <span className="absolute top-3 left-3 bg-taka-red text-white text-xs font-bold px-2 py-1 rounded-lg">
                          ALBUM DIGITAL
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/boutique/${product.slug}`} className="block hover:text-taka-red transition-colors">
                      <h3 className="font-display font-semibold text-sm mb-1">{product.nom}</h3>
                    </Link>
                    {product.description && (
                      <div className="mb-2">
                        <p className="text-taka-gray text-xs line-clamp-2">{product.description}</p>
                        <Link href={`/boutique/${product.slug}`} className="text-xs text-taka-red font-medium hover:underline mt-0.5 inline-block">
                          En savoir plus →
                        </Link>
                      </div>
                    )}

                    {product.type === "personnalisable" && (
                      <input
                        type="text"
                        placeholder="Texte personnalisé..."
                        value={customTexts[product.id] || ""}
                        onChange={(e) => setCustomTexts((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        className="w-full mt-2 px-3 py-1.5 rounded-lg border border-taka-gray-light text-sm focus:border-taka-yellow outline-none"
                      />
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="font-bold">{formatPrice(product.prix, product.devise)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                        className="bg-taka-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-taka-yellow hover:text-taka-black transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
