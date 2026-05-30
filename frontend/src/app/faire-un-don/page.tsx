import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faire un Don",
  description: "Soutenez les projets de Taka Inside par un don ponctuel ou mensuel. Toutes les transactions sont sécurisées.",
};

export default function DonPage() {
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
          <h2 className="font-display text-2xl font-bold text-center mb-12">Choisissez votre montant</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Don Ponctuel */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-taka-gray-light">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-taka-green/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Don ponctuel</h3>
                  <p className="text-taka-gray text-sm">Un soutien unique, quand vous le souhaitez.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {["5 000", "10 000", "25 000", "50 000", "100 000", "Autre"].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="py-3 rounded-xl border border-taka-gray-light font-semibold hover:border-taka-green hover:text-taka-green transition-all"
                  >
                    {amount} {amount !== "Autre" && "FCFA"}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Ou montant personnalisé (FCFA)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="Entrez un montant"
                />
              </div>

              <p className="text-sm text-taka-gray mb-6">
                Paiement sécurisé via Stripe. L'Hôtel Royal Palace appuie Taka Inside en facilitant les paiements.
              </p>

              <button className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all">
                Procéder au paiement
              </button>
            </div>

            {/* Don Mensuel */}
            <div className="bg-taka-black text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-taka-red text-white text-xs font-semibold px-3 py-1 rounded-full">Recommandé</div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-taka-yellow/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-taka-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Don mensuel</h3>
                  <p className="text-taka-gray text-sm">Un engagement régulier pour un impact durable.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {["5 000", "10 000", "25 000", "50 000"].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="py-3 rounded-xl border border-white/20 font-semibold hover:border-taka-yellow hover:text-taka-yellow transition-all"
                  >
                    {amount} FCFA/mois
                  </button>
                ))}
              </div>

              <p className="text-sm text-taka-gray mb-6">
                Engagement résiliable à tout moment via votre espace. Paiement automatique sécurisé.
              </p>

              <button className="w-full bg-taka-yellow text-taka-black py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all">
                Devenir donateur régulier
              </button>
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
                <div className="w-8 h-8 bg-taka-black rounded-md"></div>
                <span className="text-sm font-semibold">Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-taka-black rounded-md"></div>
                <span className="text-sm font-semibold">PayPal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-taka-black rounded-md"></div>
                <span className="text-sm font-semibold">FedaPay</span>
              </div>
              <p className="text-sm text-taka-gray ml-auto">
                Transactions cryptées SSL. Données protégées. Annulation possible à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
