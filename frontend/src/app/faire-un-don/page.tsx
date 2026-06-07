'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SiteLayout from "@/components/layout/SiteLayout";
import { formatPrice } from '@/lib/price';

// Chargement dynamique côté client uniquement pour éviter l'hydratation
const DonStripeForm = dynamic(() => import('@/components/payments/DonStripeForm'), { ssr: false });
const FedaPayDonButton = dynamic(() => import('@/components/payments/FedaPayDonButton'), { ssr: false });

type PaymentMethod = 'stripe' | 'paypal' | 'fedapay';
type Frequency = 'one-time' | 'monthly';

interface DonConfig {
  montant: number;
  frequence: Frequency;
  ordre: number;
}

export default function DonPage() {
  const [amount, setAmount] = useState(15);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [showPayment, setShowPayment] = useState(false);
  const [configs, setConfigs] = useState<DonConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les montants depuis Strapi
  useEffect(() => {
    fetch('/api/don-configs')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setConfigs(data);
          // Sélectionner le premier montant actif de la fréquence par défaut
          const first = data.find((c: DonConfig) => c.frequence === 'one-time');
          if (first) setAmount(first.montant);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback hardcodé en EUR
        setConfigs([
          { montant: 10, frequence: 'one-time', ordre: 1 },
          { montant: 15, frequence: 'one-time', ordre: 2 },
          { montant: 25, frequence: 'one-time', ordre: 3 },
          { montant: 50, frequence: 'one-time', ordre: 4 },
          { montant: 100, frequence: 'one-time', ordre: 5 },
          { montant: 10, frequence: 'monthly', ordre: 1 },
          { montant: 15, frequence: 'monthly', ordre: 2 },
          { montant: 25, frequence: 'monthly', ordre: 3 },
          { montant: 50, frequence: 'monthly', ordre: 4 },
        ]);
        setLoading(false);
      });
  }, []);

  const amounts = configs
    .filter((c) => c.frequence === frequency)
    .sort((a, b) => a.ordre - b.ordre)
    .map((c) => c.montant);

  // Fallback si Strapi vide
  const displayAmounts = amounts.length > 0 ? amounts : 
    (frequency === 'one-time' ? [10, 15, 25, 50, 100] : [10, 15, 25, 50]);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    setShowPayment(false);
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    setAmount(parseFloat(val) || 0);
    setShowPayment(false);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  return (
    <SiteLayout>
      <section className="bg-taka-yellow py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-taka-black">Soutenir <span className="text-taka-red">Taka Inside</span></h1>
          <p className="mt-4 max-w-xl text-taka-black/80">
            Votre soutien est essentiel pour financer nos projets culturels, accompagner les artistes et promouvoir le Bénin.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fréquence */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-xl p-1 border border-taka-gray-light">
              <button
                onClick={() => { setFrequency('one-time'); setShowPayment(false); }}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${frequency === 'one-time' ? 'bg-taka-black text-white' : 'text-taka-gray'}`}
              >
                Don ponctuel
              </button>
              <button
                onClick={() => { setFrequency('monthly'); setShowPayment(false); }}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${frequency === 'monthly' ? 'bg-taka-black text-white' : 'text-taka-gray'}`}
              >
                Don mensuel
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Sélection montant */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-taka-gray-light">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-taka-green/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{frequency === 'one-time' ? 'Don ponctuel' : 'Don mensuel'}</h3>
                  <p className="text-taka-gray text-sm">{frequency === 'one-time' ? 'Un soutien unique, quand vous le souhaitez.' : 'Un engagement régulier pour un impact durable.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {displayAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className={`py-3 rounded-xl border font-semibold transition-all ${
                      amount === val && !customAmount
                        ? 'border-taka-green bg-taka-green/10 text-taka-green'
                        : 'border-taka-gray-light hover:border-taka-green hover:text-taka-green'
                    }`}
                  >
                    {formatPrice(val)}
                  </button>
                ))}
                <button
                  onClick={() => { setCustomAmount(''); setAmount(0); setShowPayment(false); }}
                  className={`py-3 rounded-xl border font-semibold transition-all ${
                    customAmount || amount === 0
                      ? 'border-taka-green bg-taka-green/10 text-taka-green'
                      : 'border-taka-gray-light hover:border-taka-green hover:text-taka-green'
                  }`}
                >
                  Autre
                </button>
              </div>

              {(customAmount || amount === 0) && (
                <div className="mb-6">
                  <label className='block text-sm font-semibold mb-1'>Montant personnalisé (EUR)</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                    placeholder="Entrez un montant"
                    min={1}
                    step={0.01}
                  />
                </div>
              )}

              <div className="bg-taka-gray-light rounded-xl p-4 mb-6">
                <p className="text-sm text-taka-gray">Montant sélectionné :</p>
                <p className='font-display text-2xl font-bold'>{formatPrice(finalAmount)}</p>
              </div>

              {/* Méthodes de paiement */}
              <p className="text-sm font-semibold mb-3">Méthode de paiement :</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { id: 'stripe' as PaymentMethod, label: '💳 Stripe' },
                  { id: 'paypal' as PaymentMethod, label: '🅿️ PayPal', disabled: true },
                  { id: 'fedapay' as PaymentMethod, label: '📱 Mobile Money' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => { if (!method.disabled) { setPaymentMethod(method.id); setShowPayment(false); } }}
                    disabled={method.disabled}
                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                      paymentMethod === method.id
                        ? 'border-taka-green bg-taka-green/10 text-taka-green'
                        : method.disabled
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-taka-gray-light hover:border-taka-green'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPayment(true)}
                disabled={finalAmount <= 0}
                className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {showPayment ? 'Modifier' : 'Procéder au paiement'}
              </button>
            </div>

            {/* Paiement */}
            <div className="bg-taka-black text-white rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-bold mb-2">Paiement sécurisé</h3>
              <p className="text-taka-gray text-sm mb-6">
                {paymentMethod === 'stripe' && 'Carte bancaire via Stripe'}
                {paymentMethod === 'paypal' && 'PayPal — Bientôt disponible'}
                {paymentMethod === 'fedapay' && 'Mobile Money (MTN, Moov, Celtiis)'}
              </p>

              {showPayment && finalAmount > 0 ? (
                <>
                  {paymentMethod === 'stripe' && (
                    <>
                      <DonStripeForm amount={finalAmount} frequency={frequency} />
                      <p className="text-xs text-taka-gray mt-2">Paiement sécurisé via Stripe en EUR.</p>
                    </>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="text-center py-8 text-taka-gray">
                      <p className="mb-2">🅿️ PayPal sera bientôt disponible.</p>
                      <p className="text-sm">En attendant, utilisez Stripe ou Mobile Money.</p>
                    </div>
                  )}

                  {paymentMethod === 'fedapay' && (
                    <FedaPayDonButton amountEUR={finalAmount} />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-taka-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <p className="text-taka-gray">Sélectionnez un montant et cliquez sur "Procéder au paiement"</p>
                </div>
              )}
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Paiement sécurisé
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-taka-black rounded-md flex items-center justify-center text-white font-bold text-xs">S</div>
                <span className="text-sm font-semibold">Stripe (SSL 256-bit)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-taka-black rounded-md flex items-center justify-center text-white font-bold text-xs">P</div>
                <span className="text-sm font-semibold">PayPal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-taka-black rounded-md flex items-center justify-center text-white font-bold text-xs">F</div>
                <span className="text-sm font-semibold">FedaPay (Mobile Money)</span>
              </div>
              <p className="text-sm text-taka-gray ml-auto">
                Transactions cryptées. Données protégées. Annulation possible à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
