'use client';

import { useEffect, useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";

interface OrderInfo {
  id: string;
  token: string | null;
  hasDigital: boolean;
  hasPhysical: boolean;
  email: string;
  total: number;
  items: Array<{name: string; quantity: number}>;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer la commande depuis le localStorage (stockée avant redirection paiement)
    const pendingOrder = localStorage.getItem('taka-pending-order');
    
    if (pendingOrder) {
      try {
        const parsed = JSON.parse(pendingOrder);
        setOrder(parsed);
        setLoading(false);
        // Nettoyer le pending order après affichage
        localStorage.removeItem('taka-pending-order');
        // Vider le panier
        localStorage.removeItem('taka-cart');
      } catch {
        setError('Impossible de récupérer les détails de la commande');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-taka-yellow mx-auto mb-4" />
            <p className="text-taka-gray">Vérification du paiement...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          {/* Succès */}
          <div className="w-20 h-20 rounded-full bg-taka-green/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Paiement confirmé !</h1>

          {order?.hasDigital && (
            <div className="bg-taka-green/10 border border-taka-green/30 rounded-xl p-6 mb-6">
              <p className="text-sm font-semibold mb-2">🎵 Votre contenu digital est prêt</p>
              {order.token ? (
                <div>
                  <a
                    href={`/telecharger/${order.token}`}
                    className="inline-block bg-taka-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all mb-2"
                  >
                    Télécharger maintenant →
                  </a>
                  <p className="text-xs text-taka-gray">Lien valable 7 jours, 3 téléchargements max.</p>
                </div>
              ) : (
                <p className="text-sm text-taka-gray">
                  Un email avec le lien de téléchargement sera envoyé à {order.email} dès que le paiement sera finalisé.
                </p>
              )}
            </div>
          )}

          {order?.hasPhysical && (
            <div className="bg-taka-yellow/10 border border-taka-yellow/30 rounded-xl p-6 mb-6">
              <p className="text-sm font-semibold mb-2">📦 Livraison en cours de préparation</p>
              <p className="text-sm text-taka-gray">
                Vous recevrez un email de confirmation avec les détails de livraison à {order.email}.
              </p>
            </div>
          )}

          {!order && (
            <p className="text-taka-gray mb-8">
              Merci pour votre soutien à Taka Inside. Vous recevrez un email de confirmation sous peu avec les détails de votre commande.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique"
              className="bg-taka-yellow text-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Retourner à la boutique
            </Link>
            <Link
              href="/"
              className="border border-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-taka-black hover:text-white transition-all"
            >
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
