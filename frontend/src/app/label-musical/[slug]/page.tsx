import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList, getImageUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Artiste du label",
  description: "Découvrez un artiste du label Taka Inside.",
};

type Artiste = {
  documentId?: string;
  nom?: string;
  genre?: string;
  biographie?: string;
  photo?: { url?: string } | null;
};

export default async function ArtistePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artistesData = await fetchStrapiList("artistes?populate=*");
  const artistes: Artiste[] = artistesData && Array.isArray(artistesData) ? artistesData : [];

  const artiste = artistes.find((a) => a.documentId === slug);

  if (!artiste) {
    notFound();
  }

  const nom = String(artiste.nom || "");
  const genre = String(artiste.genre || "");
  const bio = String(artiste.biographie || "");
  const photoUrl = getImageUrl(artiste.photo as { url: string } | null);

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/label-musical" className="text-taka-gray hover:text-white transition-colors inline-flex items-center gap-2 mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            Retour au label
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-2xl bg-taka-gray-light overflow-hidden relative">
                {photoUrl ? (
                  <Image src={photoUrl} alt={nom} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-taka-gray font-display font-bold text-6xl">{nom.charAt(0)}</div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-taka-red font-medium mb-2">{genre}</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">{nom}</h1>
              <p className="text-taka-gray text-lg leading-relaxed whitespace-pre-line">{bio}</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
