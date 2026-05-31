'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SiteLayout from '@/components/layout/SiteLayout';
import { useCart } from '@/contexts/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'Une erreur est survenue.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Paiement réussi ! Merci pour votre soutien.');
      clearCart();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className={`p-4 rounded-xl ${message.includes('succès') ? 'bg-taka-green/15 text-taka-green' : 'bg-taka-red/15 text-taka-red'}`}>
          {message}
        </div>
      )}

      <button
        disabled={!stripe || isLoading}
        className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Traitement en cours...' : `Payer ${total.toLocaleString('fr-FR')} FCFA`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    // Vérifier que Stripe est chargé
    stripePromise.then(() => setStripeReady(true)).catch((err) => {
      console.error('Stripe load error:', err);
    });
  }, []);

  useEffect(() => {
    if (total > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'xof',
          metadata: {
            order_type: 'shop',
            items_count: items.length,
          },
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else if (data.error) {
            console.error('API error:', data.error);
          }
        })
        .catch((err) => console.error('Erreur création intent:', err));
    }
  }, [total, items]);

  const options = useMemo<StripeElementsOptions>(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#E5B800',
        colorBackground: '#F5F3EF',
        colorText: '#0A0A0A',
        borderRadius: '12px',
      },
    },
  }), [clientSecret]);

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="min-h-[50vh] flex items-center justify-center bg-taka-cream">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Votre panier est vide</h1>
            <a href="/boutique" className="text-taka-green font-semibold hover:underline">
              Retourner à la boutique →
            </a>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold mb-8">Finaliser votre commande</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Récap commande */}
            <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
              <h2 className="font-display text-lg font-bold mb-4">Récapitulatif</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
                <div className="border-t border-taka-gray-light pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            {/* Paiement Stripe */}
            <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
              <h2 className="font-display text-lg font-bold mb-4">Paiement sécurisé</h2>
              {clientSecret && stripeReady ? (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <div className="text-center py-8 text-taka-gray">
                  {clientSecret && !stripeReady ? 'Initialisation de Stripe...' : 'Chargement du formulaire de paiement...'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
