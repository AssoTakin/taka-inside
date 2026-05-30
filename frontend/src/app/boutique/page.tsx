import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Collection de produits Taka Inside : CDS, t-shirts, produits dérivés. Livraison partout au Bénin.",
};

export default function BoutiquePage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Boutique en ligne
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Notre <span className="text-taka-yellow">Boutique</span></h1>
            <p className="text-taka-gray mt-4 max-w-xl">
              CDS, t-shirts, produits dérivés et artisanat béninois. Livraison via BeniExpress ou rétrait sur place à Cotonou.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold">Nos produits</h2>
            <div className="text-sm text-taka-gray">
              Paiement sécurisé via <span className="font-semibold">Stripe</span> · <span className="font-semibold">PayPal</span> · <span className="font-semibold">Mobile Money</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { name: "CD - Taka Volume 1", prix: "5 000", type: "fixe" },
              { name: "T-shirt Taka Inside", prix: "7 500", type: "fixe" },
              { name: "Album Digital - Tomiwa Kéfil", prix: "2 500", type: "fixe" },
              { name: "T-shirt Personnalisé", prix: "À partir de 8 000", type: "variable" },
              { name: "CD - Ami Sêdjro", prix: "4 500", type: "fixe" },
              { name: "Sac en wax Taka", prix: "12 000", type: "fixe" },
              { name: "Bracelet artisanal", prix: "2 000", type: "fixe" },
              { name: "Poster A3 artiste", prix: "3 500", type: "fixe" },
            ].map((product) => (
              <div key={product.name} className="bg-white rounded-2xl overflow-hidden border border-taka-gray-light group hover:shadow-lg transition-all">
                <div className="aspect-square bg-taka-gray-light flex items-center justify-center">
                  <span className="text-taka-gray">{product.type === 'fixe' ? 'Image produit' : 'Personnalisable'}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-sm">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold">{product.prix} FCFA</span>
                    <button className="bg-taka-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-taka-yellow hover:text-taka-black transition-colors">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
