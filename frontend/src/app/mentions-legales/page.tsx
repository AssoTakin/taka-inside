import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site Taka Inside.",
};

export default function MentionsLegalesPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Mentions Légales</h1>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-8">
            <article>
              <h2 className="font-display text-xl font-bold mb-3">1. Éditeur du site</h2>
              <p className="text-taka-gray">Le site <strong>takainside.org</strong> est édité par l'association culturelle Taka Inside.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">2. Directeur de publication</h2>
              <p className="text-taka-gray">Le Directeur de la publication est le Président de l'association Taka Inside.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">3. Hébergement</h2>
              <p className="text-taka-gray">Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">4. Propriété intellectuelle</h2>
              <p className="text-taka-gray">Tous les contenus (textes, images, logos, vidéos) présents sur ce site sont la propriété exclusive de Taka Inside ou de ses partenaires. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">5. Cookies</h2>
              <p className="text-taka-gray">Le site utilise des cookies à des fins de sécurité et d'analyse de trafic. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.</p>
            </article>

            <article>
              <h2 className="font-display text-xl font-bold mb-3">6. Contact</h2>
              <p className="text-taka-gray">Pour toute question relative aux mentions légales : contact@takainside.org</p>
            </article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
