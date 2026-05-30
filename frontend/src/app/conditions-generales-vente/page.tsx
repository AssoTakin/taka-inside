import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "CGV de la boutique Taka Inside.",
};

export default function CGVPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Conditions Générales de Vente</h1>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-8">
            <article>
              <h2 className="font-display text-xl font-bold mb-3">1. Préambule</h2>
              <p className="text-taka-gray">Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées sur la boutique en ligne de Taka Inside (CDS, t-shirts, produits dérivés, artisanat). En passant commande, vous acceptez sans réserve ces CGV.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">2. Prix et paiement</h2>
              <p className="text-taka-gray">Les prix sont indiqués en FCFA et sont sujets à modification sans préavis. Le paiement est sécurisé via Stripe, PayPal ou Mobile Money (FedaPay). La commande est validée après confirmation du paiement.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">3. Livraison</h2>
              <p className="text-taka-gray">Les produits physiques sont livrés via BeniExpress au Bénin ou par services postaux à l'international. Les délais estimés sont de 2 à 5 jours ouvrés au Bénin et 7 à 21 jours à l'international. Les frais de livraison sont calculés au moment de la commande.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">4. Livraison numérique</h2>
              <p className="text-taka-gray">Les contenus numériques (téléchargements musicaux, fichiers personnalisés) sont livrés par email avec lien de téléchargement sécurisé dès confirmation du paiement. Le lien est valable 30 jours.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">5. Droit de rétractation</h2>
              <p className="text-taka-gray">Conformément à la législation en vigueur au Bénin, vous disposez d'un délai de 7 jours pour exercer votre droit de rétractation sur les produits physiques. Les produits numériques téléchargés ne sont pas remboursables une fois livrés.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">6. Contact</h2>
              <p className="text-taka-gray">Pour toute question relative à une commande : contact@takainside.org</p>
            </article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
