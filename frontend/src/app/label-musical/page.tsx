import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Label Musical",
  description: "Découvrez les artistes du label Taka Inside - musique béninoise et africaine.",
};

export default function LabelMusicalPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
              </svg>
              Label Musical
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Notre <span className="text-taka-red">Label</span></h1>
            <p className="text-taka-gray mt-4 max-w-xl">
              Taka Inside est aussi un label musical dédié à la promotion des artistes béninois et africains. Écoutez, découvrez, soutenez.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold mb-8">Artistes du label</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Tomiwa Kéfil", genre: "Afrobeat · World", bio: "Chanteur et auteur-compositeur, fusionne les rythmes traditionnels du Bénin avec l'afrobeat contemporain." },
              { name: "Ami Sêdjro", genre: "Traditionnel · Jazz", bio: "Vocaliste et percussionniste, porte-voix des traditions vodun et des mélodies ancestrales du Sud-Bénin." },
              { name: "Koffi Agbossou", genre: "Hip-Hop · Afrotrap", bio: "Rappeur engagé, mêle francais, fon et anglais pour raconter le quotidien des jeunes Béninois." },
            ].map((artiste) => (
              <div key={artiste.name} className="bg-white rounded-2xl p-6 border border-taka-gray-light flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-taka-gray-light flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-taka-black/10 flex items-center justify-center text-taka-gray text-xs">Photo</div>
                </div>
                <div>
                  <p className="text-taka-red text-sm font-medium">{artiste.genre}</p>
                  <h3 className="font-display text-xl font-bold mt-1">{artiste.name}</h3>
                  <p className="text-taka-gray text-sm mt-2">{artiste.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
