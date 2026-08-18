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
  const artistesData = await fetchStrapiList("artistes?populate=*");
  const artistes = artistesData && Array.isArray(artistesData) ? artistesData : [];

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
          
          {artistes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-taka-gray">Aucun artiste pour le moment. Revenez bientôt !</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistes.map((artiste) => {
              const id = String(artiste.documentId || "");
              const slug = String(artiste.slug || "");
              const artistPath = slug ? `/label-musical/${slug}` : (id ? `/label-musical/${id}` : '/label-musical');
              const nom = String(artiste.nom || "");
              const genre = String(artiste.genre || "");
              const bio = String(artiste.biographie || "");
              const photoUrl = getImageUrl(artiste.photo as { url: string } | null);
              if (!id) return null;
              return (
                <Link href={artistPath} key={id} className="bg-white rounded-2xl p-6 border border-taka-gray-light flex gap-4 hover:shadow-md transition-all group">
                  <div className="w-20 h-20 rounded-xl bg-taka-gray-light flex-shrink-0 overflow-hidden relative">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={nom} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-taka-gray font-display font-bold text-xl">{nom.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-taka-red text-sm font-medium">{genre}</p>
                    <h3 className="font-display text-xl font-bold mt-1 group-hover:text-taka-yellow transition-colors">{nom}</h3>
                    <p className="text-taka-gray text-sm mt-2 line-clamp-3">{bio}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
