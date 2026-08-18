import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList, getImageUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Label Musical",
  description: "Découvrez les artistes du label Taka Inside - musique béninoise et culture béninoise.",
};

export default async function LabelMusicalPage() {
  const artistesData = await fetchStrapiList("artistes?populate[photo][fields][0]=url&populate[photo][fields][1]=alternativeText&sort=nom:asc");
  const artistes = artistesData && Array.isArray(artistesData) ? artistesData : [];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-taka-black text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-taka-yellow via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
              </svg>
              Label Musical
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Notre <span className="text-taka-red">Label</span>
            </h1>
            <p className="text-lg md:text-xl text-taka-gray max-w-2xl mb-8">
              Taka Inside déniche, accompagne et met en lumière les artistes béninois et africains émergents.
              Écoutez, découvrez, soutenez les talents de demain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#artistes" className="inline-flex items-center justify-center px-6 py-3 bg-taka-yellow text-taka-black rounded-full font-semibold hover:bg-opacity-90 transition-all">
                Découvrir les artistes
              </Link>
              <Link href="/boutique" className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all">
                Boutique artistes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats teaser */}
      <section className="bg-taka-cream py-12 border-b border-taka-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${artistes.length}+`, label: "Artistes signés" },
              { value: "24/7", label: "Diffusion radio" },
              { value: "100%", label: "Culture béninoise" },
              { value: "Bénin", label: "Depuis Marseille" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-taka-black">{stat.value}</p>
                <p className="text-taka-gray text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artistes */}
      <section id="artistes" className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="text-taka-red font-semibold uppercase text-sm tracking-wide">Artistes du label</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Les talents <span className="text-taka-yellow">Taka Inside</span></h2>
            </div>
            <p className="text-taka-gray max-w-md">
              Cliquez sur une carte pour découvrir la biographie, la discographie, les actualités et les produits liés à chaque artiste.
            </p>
          </div>
          
          {artistes.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-taka-gray-light">
              <p className="text-taka-gray">Aucun artiste pour le moment. Revenez bientôt !</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistes.map((artiste) => {
              const id = String(artiste.documentId || "");
              const slug = String(artiste.slug || "");
              const artistPath = slug ? `/label-musical/${slug}` : (id ? `/label-musical/${id}` : '/label-musical');
              const nom = String(artiste.nom || "");
              const genre = String(artiste.genre_musical || artiste.genre || "Artiste");
              const bio = String(artiste.biographie || "");
              const photoUrl = getImageUrl(artiste.photo as { url: string } | null);
              if (!id) return null;
              return (
                <Link href={artistPath} key={id} className="group bg-white rounded-2xl overflow-hidden border border-taka-gray-light hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="aspect-[4/3] bg-taka-gray-light relative overflow-hidden">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={nom} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-taka-gray font-display font-bold text-6xl">
                        {nom.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-taka-black/80 text-white text-xs font-semibold backdrop-blur-sm">
                        {genre}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold group-hover:text-taka-yellow transition-colors">{nom}</h3>
                    <p className="text-taka-gray mt-2 line-clamp-3">{bio}</p>
                    <span className="inline-flex items-center mt-4 text-sm font-semibold text-taka-black group-hover:text-taka-yellow transition-colors">
                      Voir la page artiste
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-taka-yellow py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-taka-black mb-4">
            Vous êtes artiste et souhaitez rejoindre le label ?
          </h2>
          <p className="text-taka-black/80 mb-8 max-w-2xl mx-auto">
            Taka Inside accompagne les artistes émergents dans la production, la diffusion et la promotion de leurs œuvres.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/devenir-benevole" className="inline-flex items-center justify-center px-8 py-3 bg-taka-black text-white rounded-full font-semibold hover:bg-opacity-90 transition-all">
              Nous contacter
            </Link>
            <Link href="/association" className="inline-flex items-center justify-center px-8 py-3 border-2 border-taka-black text-taka-black rounded-full font-semibold hover:bg-taka-black hover:text-white transition-all">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
