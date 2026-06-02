'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SiteLayout from '@/components/layout/SiteLayout';
import { useCart } from '@/contexts/CartContext';
import PayPalDonForm from '@/components/payments/PayPalDonForm';
import FedaPayDonButton from '@/components/payments/FedaPayDonButton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type PaymentMethod = 'stripe' | 'paypal' | 'fedapay';
type Step = 1 | 2 | 3;

type FormErrors = Partial<Record<string, string>>;

// ===========================================
// Composant formulaire de paiement Stripe
// ===========================================
function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { total } = useCart();
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
      setMessage(error.message || 'Une erreur est survenue lors du paiement.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.includes('soutien') ? 'bg-taka-green/15 text-taka-green' : 'bg-taka-red/15 text-taka-red'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Traitement en cours…' : `Payer ${total.toLocaleString('fr-FR')} FCFA`}
      </button>
    </form>
  );
}

// ===========================================
// Composant principal du checkout
// ===========================================
export default function CheckoutPage() {
  const { items, total, removeItem } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [stripeReady, setStripeReady] = useState(false);
  const [apiError, setApiError] = useState('');
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isDigitalOnly, setIsDigitalOnly] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Formulaire acheteur
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Benin',
    type_livraison: 'standard',
  });

  useEffect(() => {
    stripePromise.then(() => setStripeReady(true)).catch((err) => console.error('Stripe load error:', err));
  }, []);

  // Détecter si tous les produits sont digitaux
  useEffect(() => {
    const allDigital = items.every((item) =>
      item.productType === 'digital' || item.productType === 'album' || item.productType === 'single'
    );
    setIsDigitalOnly(allDigital);
    if (allDigital) setFormData((prev) => ({ ...prev, pays: 'Autre' }));
  }, [items]);

  // Supprimer les items prix corrompus
  useEffect(() => {
    items.forEach((item) => { if (item.price < 300) removeItem(item.id); });
  }, [items, removeItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.nom.trim()) errs.nom = 'Le nom est requis';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Email invalide';
    if (!formData.telephone.trim()) errs.telephone = 'Le téléphone est requis';
    else if (!/^\+?[\d\s]{8,15}$/.test(formData.telephone.replace(/\s/g, ''))) errs.telephone = 'Numéro invalide (ex: +22912345678)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (isDigitalOnly) return true;
    const errs: FormErrors = {};
    if (!formData.adresse.trim()) errs.adresse = 'L\'adresse est requise';
    if (!formData.ville.trim()) errs.ville = 'La ville est requise';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const createPaymentIntent = () => {
    setApiError('');
    const hasDigital = items.some((item) =>
      item.productType === 'digital' || item.productType === 'album' || item.productType === 'single'
    );

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        currency: 'xof',
        metadata: { order_type: 'shop', items_count: items.length },
        nomClient: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        code_postal: formData.code_postal,
        pays: formData.pays,
        type_livraison: isDigitalOnly ? 'numerique' : formData.type_livraison,
        cout_livraison: isDigitalOnly ? 0 : undefined,
        produits: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productType: item.productType,
        })),
        hasDigital,
      }),
    })
      .then((res) => { if (!res.ok) return res.json().then((d) => { throw new Error(d.error || `HTTP ${res.status}`); }); return res.json(); })
      .then((data) => { if (data.clientSecret) setClientSecret(data.clientSecret); })
      .catch((err) => { console.error('Erreur création intent:', err); setApiError(err.message || 'Erreur de paiement'); });
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      if (isDigitalOnly) {
        setStep(3);
        // Si digital only → étape paiement sans adresse
        if (!clientSecret) createPaymentIntent();
      } else {
        setStep(2);
      }
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      if (!clientSecret) createPaymentIntent();
    }
  };

  const prevStep = () => {
    if (step === 3 && !isDigitalOnly) setStep(2);
    else setStep(1);
  };

  const options = useMemo<StripeElementsOptions>(() => ({
    clientSecret,
    appearance: { theme: 'stripe', variables: { colorPrimary: '#E5B800', colorBackground: '#F5F3EF', colorText: '#0A0A0A', borderRadius: '12px' } },
  }), [clientSecret]);

  const handleSuccess = () => setPaymentSuccess(true);

  if (items.length === 0 && !paymentSuccess) return (
    <SiteLayout>
      <div className="min-h-[50vh] flex items-center justify-center bg-taka-cream">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Votre panier est vide</h1>
          <a href="/boutique" className="text-taka-green font-semibold hover:underline">Retourner à la boutique →</a>
        </div>
      </div>
    </SiteLayout>
  );

  if (paymentSuccess) return (
    <SiteLayout>
      <div className="min-h-[50vh] flex items-center justify-center bg-taka-cream">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-taka-green/15 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold mb-4">Paiement confirmé !</h1>
          <p className="text-taka-gray mb-6">Merci pour votre commande. Vous recevrez un email de confirmation sous peu.</p>
          <a href="/" className="inline-block bg-taka-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all">Retour à l'accueil</a>
        </div>
      </div>
    </SiteLayout>
  );

  return (
    <SiteLayout>
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold mb-8">Finaliser votre commande</h1>

          {/* Indicateur d'étapes */}
          <div className="flex items-center mb-8">
            <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 1 ? 'border-taka-black font-bold' : 'border-taka-gray-light'}`}>1. Informations</div>
            <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 2 ? 'border-taka-black font-bold' : 'border-taka-gray-light'}`}>{isDigitalOnly ? '—' : '2. Livraison'}</div>
            <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 3 ? 'border-taka-black font-bold' : 'border-taka-gray-light'}`}>{isDigitalOnly ? '2. Paiement' : '3. Paiement'}</div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Récapitulatif (toujours visible) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-taka-gray-light sticky top-24">
                <h2 className="font-display text-lg font-bold mb-4">Récapitulatif</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  ))}
                  <div className="border-t border-taka-gray-light pt-3 space-y-2">
                    {!isDigitalOnly && (
                      <div className="flex justify-between text-sm text-taka-gray">
                        <span>Livraison</span>
                        <span>Calculé à l'étape 2</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                {apiError ? (
                  <div className="p-4 rounded-xl bg-taka-red/15 text-taka-red text-sm mb-6">{apiError}</div>
                ) : null}

                {/* ÉTAPE 1 : Informations client */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Vos informations</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom complet *</label>
                        <input
                          type="text" name="nom" value={formData.nom} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-taka-red' : 'border-taka-gray-light'} bg-taka-cream focus:outline-none focus:border-taka-black`}
                          placeholder="Prénom et nom"
                        />
                        {errors.nom && <p className="text-taka-red text-xs mt-1">{errors.nom}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-taka-red' : 'border-taka-gray-light'} bg-taka-cream focus:outline-none focus:border-taka-black`}
                          placeholder="exemple@email.com"
                        />
                        {errors.email && <p className="text-taka-red text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone *</label>
                      <input
                        type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.telephone ? 'border-taka-red' : 'border-taka-gray-light'} bg-taka-cream focus:outline-none focus:border-taka-black`}
                        placeholder="+229 01 23 45 67 89"
                      />
                      {errors.telephone && <p className="text-taka-red text-xs mt-1">{errors.telephone}</p>}
                    </div>

                    <button
                      onClick={nextStep}
                      className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Continuer →
                    </button>
                  </div>
                )}

                {/* ÉTAPE 2 : Adresse de livraison (si physique) */}
                {step === 2 && !isDigitalOnly && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Adresse de livraison</h2>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse *</label>
                      <input
                        type="text" name="adresse" value={formData.adresse} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.adresse ? 'border-taka-red' : 'border-taka-gray-light'} bg-taka-cream focus:outline-none focus:border-taka-black`}
                        placeholder="Rue, quartier, immeuble"
                      />
                      {errors.adresse && <p className="text-taka-red text-xs mt-1">{errors.adresse}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ville *</label>
                        <input
                          type="text" name="ville" value={formData.ville} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.ville ? 'border-taka-red' : 'border-taka-gray-light'} bg-taka-cream focus:outline-none focus:border-taka-black`}
                          placeholder="Cotonou"
                        />
                        {errors.ville && <p className="text-taka-red text-xs mt-1">{errors.ville}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Code postal</label>
                        <input
                          type="text" name="code_postal" value={formData.code_postal} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-taka-gray-light bg-taka-cream focus:outline-none focus:border-taka-black"
                          placeholder="01 BP 1234"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Pays</label>
                        <select name="pays" value={formData.pays} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light bg-taka-cream focus:outline-none focus:border-taka-black">
                          <option value="Benin">Bénin</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Togo">Togo</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Cote d'Ivoire">Côte d'Ivoire</option>
                          <option value="France">France</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Type de livraison</label>
                        <select name="type_livraison" value={formData.type_livraison} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light bg-taka-cream focus:outline-none focus:border-taka-black">
                          <option value="standard">Standard (3-5 jours)</option>
                          <option value="express">Express (24-48h)</option>
                          <option value="economique">Économique (7-14 jours)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={prevStep} className="flex-1 bg-taka-gray-light text-taka-black py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all">
                        ← Retour
                      </button>
                      <button onClick={nextStep} className="flex-1 bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all">
                        Continuer →
                      </button>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 3 : Paiement */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Paiement sécurisé</h2>

                    <div className="bg-taka-cream rounded-xl p-4 text-sm space-y-2">
                      <div className="flex justify-between"><span>Client</span><span className="font-medium">{formData.nom}</span></div>
                      <div className="flex justify-between"><span>Email</span><span className="font-medium">{formData.email}</span></div>
                      <div className="flex justify-between"><span>Tél</span><span className="font-medium">{formData.telephone}</span></div>
                      {!isDigitalOnly && (
                        <div className="flex justify-between"><span>Livraison</span><span className="font-medium">{formData.adresse}, {formData.ville}</span></div>
                      )}
                    </div>

                    {/* Sélecteur méthode de paiement */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaymentMethod('stripe')}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${paymentMethod === 'stripe' ? 'bg-taka-black text-white' : 'bg-taka-cream text-taka-gray hover:text-taka-black'}`}
                      >Carte bancaire</button>
                      <button disabled className="flex-1 py-2 px-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed">PayPal — Bientôt</button>
                      <button
                        onClick={() => setPaymentMethod('fedapay')}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${paymentMethod === 'fedapay' ? 'bg-taka-black text-white' : 'bg-taka-cream text-taka-gray hover:text-taka-black'}`}
                      >Mobile Money</button>
                    </div>

                    {paymentMethod === 'stripe' && (
                      clientSecret && stripeReady ? (
                        <Elements stripe={stripePromise} options={options}>
                          <CheckoutForm onSuccess={handleSuccess} />
                        </Elements>
                      ) : (
                        <div className="text-center py-8 text-taka-gray">
                          {clientSecret && !stripeReady ? 'Initialisation de Stripe...' : 'Chargement du formulaire de paiement...'}
                        </div>
                      )
                    )}

                    {paymentMethod === 'paypal' && <PayPalDonForm amount={total} onSuccess={handleSuccess} />}

                    {paymentMethod === 'fedapay' && <FedaPayDonButton amount={total} onSuccess={handleSuccess} />}

                    <button onClick={prevStep} className="w-full bg-taka-gray-light text-taka-black py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all">
                      ← Modifier mes informations
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
