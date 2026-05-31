import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Comment Taka Inside protège vos données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Politique de Confidentialité</h1>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-8">
            <article>
              <h2 className="font-display text-xl font-bold mb-3">1. Données collectées</h2>
              <p className="text-taka-gray">Nous collectons uniquement les données nécessaires à votre interaction avec Taka Inside : nom, email, téléphone (facultatif), et informations de paiement (gérées par Stripe/PayPal). Ces données sont transmises volontairement via nos formulaires.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">2. Utilisation des données</h2>
              <p className="text-taka-gray">Vos données sont utilisées pour : répondre à vos messages, gérer vos dons et commandes, vous informer de nos activités (avec consentement), et améliorer nos services. Nous ne vendons jamais vos données à des tiers.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">3. Base légale (RGPD)</h2>
              <p className="text-taka-gray">Le traitement de vos données repose sur votre consentement (formulaires), l'exécution d'un contrat (achats, dons), ou notre intérêt légitime (sécurité du site). Vous pouvez retirer votre consentement à tout moment.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">4. Vos droits</h2>
              <p className="text-taka-gray">Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits : kwabo@takainside.org.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">5. Sécurité</h2>
              <p className="text-taka-gray">Vos données sont stockées de manière sécurisée (chiffrement SSL, accès restreint). Les paiements sont traités par Stripe et PayPal ; nous ne stockons pas vos données bancaires.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">6. Modifications</h2>
              <p className="text-taka-gray">Cette politique peut être mise à jour. La date de dernière révision est indiquée ci-dessous.</p>
              <p className="text-taka-gray mt-2">Dernière mise à jour : Mai 2025</p>
            </article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
