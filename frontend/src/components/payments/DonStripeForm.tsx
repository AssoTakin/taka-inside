'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatPrice } from '@/lib/price';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function DonForm({ amount, frequency }: { amount: number; frequency: 'one-time' | 'monthly' }) {
  const stripe = useStripe();
  const elements = useElements();
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
      setMessage('Don effectué ! Merci pour votre générosité.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('succès') || message.includes('Don effectué') ? 'bg-taka-green/15 text-taka-green' : 'bg-taka-red/15 text-taka-red'}`}>
          {message}
        </div>
      )}
      <button
        disabled={!stripe || isLoading}
        className="w-full bg-taka-green text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Traitement...' : `Donner ${formatPrice(amount)} ${frequency === 'monthly' ? '/mois' : ''}`}
      </button>
    </form>
  );
}

export default function DonStripeForm({ amount, frequency }: { amount: number; frequency: 'one-time' | 'monthly' }) {
  const [clientSecret, setClientSecret] = useState('');
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    stripePromise.then(() => setStripeReady(true)).catch((err) => {
      console.error('Stripe load error:', err);
    });
  }, []);

  useEffect(() => {
    if (amount > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,               // ← montant en EUR
          currency: 'eur',     // ← API Stripe attend EUR
          metadata: {
            order_type: 'don',
            frequency,
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
        .catch((err) => console.error('Erreur:', err));
    }
  }, [amount, frequency]);

  const options = useMemo<StripeElementsOptions>(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1B8A3A',
        colorBackground: '#F5F3EF',
        colorText: '#0A0A0A',
        borderRadius: '12px',
      },
    },
  }), [clientSecret]);

  if (!clientSecret || !stripeReady) {
    return <div className="text-center py-4 text-taka-gray text-sm">Chargement du paiement...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <DonForm amount={amount} frequency={frequency} />
    </Elements>
  );
}
