import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Projets",
  description: "Découvrez les projets culturels, musicaux et sociaux de Taka Inside au Bénin.",
};

const filters = [
  { id: 'all', label: 'Tous les projets' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'a_venir', label: 'À venir' },
  { id: 'termine', label: 'Terminés' },
  { id: 'urgent', label: 'Urgents' },
];

export default function ProjetsPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Projets culturels, musicaux et sociaux
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Nos <span className="text-taka-yellow">Projets</span></h1>
            <p className="text-taka-gray mt-4 max-w-xl">Découvrez les initiatives que nous portons pour promouvoir la culture béninoise et soutenir la communauté.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 hover:border-taka-yellow hover:text-taka-yellow transition-all"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-taka-yellow/20 mb-6">
              <svg className="w-8 h-8 text-taka-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">Projets en cours de chargement</h2>
            <p className="text-taka-gray max-w-lg mx-auto">
              Les projets seront bientôt disponibles depuis l'administration Strapi. Pour le moment, voici un aperçu des projets prévus :
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
              {[
                { titre: "Made In Bénin Radio", statut: "En cours", statutColor: "bg-taka-green", categorie: "Radio · Média", description: "Web radio dédiée à la promotion de la musique béninoise et africaine." },
                { titre: "Taka Culture Festival", statut: "À venir", statutColor: "bg-taka-yellow text-taka-black", categorie: "Festival · Événement", description: "Grand festival culturel annuel réunissant artistes et artisans." },
                { titre: "Ateliers Jeunes Talents", statut: "Urgent", statutColor: "bg-taka-red", categorie: "Éducation · Social", description: "Programme d'accompagnement des jeunes artistes béninois." },
                { titre: "Taka Inside Village", statut: "À venir", statutColor: "bg-taka-yellow text-taka-black", categorie: "Social · Culturel", description: "Création d'un espace culturel communautaire avec bibliothèque, studio et salle de répétition." },
                { titre: "Brassage Culturel", statut: "En cours", statutColor: "bg-taka-green", categorie: "Culturel · International", description: "Échanges artistiques entre le Bénin et d'autres pays du monde." },
                { titre: "Taka Boutique Collective", statut: "En cours", statutColor: "bg-taka-green", categorie: "Économique · Art", description: "Plateforme e-commerce pour la vente d'artisanat et produits culturels béninois." },
              ].map((projet) => (
                <div key={projet.titre} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-taka-gray-light group">
                  <div className="aspect-[16/10] bg-taka-gray-light relative flex items-center justify-center">
                    <span className="text-taka-gray text-sm">Image du projet</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${projet.statutColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{projet.statut}</span>
                      <span className="text-taka-gray text-xs">{projet.categorie}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{projet.titre}</h3>
                    <p className="text-taka-gray text-sm">{projet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
