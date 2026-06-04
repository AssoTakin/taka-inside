'use client';

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatPriceEUR } from "@/lib/price";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalEUR, itemCount, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-taka-gray-light">
          <h2 className="font-display text-xl font-bold">Mon Panier ({itemCount})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-taka-gray-light rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-taka-gray-light rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-taka-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-taka-gray">Votre panier est vide.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-taka-green font-semibold hover:underline"
              >
                Continuer les achats
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-taka-cream rounded-xl p-4">
                <div className="w-20 h-20 rounded-lg bg-taka-gray-light flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-taka-gray">Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                  {item.customization && (
                    <p className="text-xs text-taka-gray mt-1">Personnalisation : {item.customization}</p>
                  )}
                  <p className="font-bold mt-1">{formatPriceEUR(item.price, item.currency)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-taka-gray-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-taka-gray-light transition-colors"
                      >-</button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-taka-gray-light transition-colors"
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-taka-red text-sm hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-taka-gray-light p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-taka-gray">Sous-total</span>
              <span className="font-bold text-lg">{formatPrice(totalEUR)}</span>
            </div>
            <p className="text-xs text-taka-gray">Frais de livraison calculés à l'étape suivante.</p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-taka-black text-white text-center py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Passer la commande
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
