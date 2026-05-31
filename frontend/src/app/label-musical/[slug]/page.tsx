import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList, fetchStrapiSingle, getImageUrl } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const data = await fetchStrapiList("artistes?fields[0]=slug");
  if (!data) return [];
  return data.map((a) => ({ slug: String(a.slug || "") })).filter((a) => a.slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await fetchStrapiSingle(`artistes?filters[slug][$eq]=${slug}&populate=*`);
  if (!a) return { title: "Artiste | Taka Inside" };
  return {
    title: `${a.nom} | Taka Inside`,
    description: String(a.biographie || "").substring(0, 160),
  };
}

export default async function ArtistePage({ params }: Props) {
  const { slug } = await params;
  const artiste = await fetchStrapiSingle(`artistes?filters[slug][$eq]=${slug}&populate=*`);

  if (!artiste) notFound();

  const photoUrl = getImageUrl(artiste.photo as { url: string } | null);
  const biographie = String(artiste.biographie || "");
  const genre = String(artiste.genre_musical || "");
  const liens = (artiste.liens_externes || {}) as Record<string, string>;
  const albums = (artiste.albums || []) as Array<{ titre?: string; annee?: string; lien_spotify?: string }>;
  const concerts = (artiste.concerts || []) as Array<{ ville?: string; date?: string; salle?: string; lien_ticket?: string }>;
  const nom = String(artiste.nom || "");

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/label-musical" className="text-taka-gray hover:text-white text-sm mb-4 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Retour au label
            </Link>
          </div>
          <div className="flex items-start gap-8">
            {photoUrl ? (
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <Image src={photoUrl} alt={nom} fill className="object-cover" sizes="128px" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-taka-gray-light flex items-center justify-center flex-shrink-0">
                <span className="text-taka-gray font-display font-bold text-3xl">{nom.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="text-taka-red font-medium text-sm mb-1">{genre || "Artiste"}</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold">{nom}</h1>
              {liens.spotify && (
                <a href={liens.spotify} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-taka-yellow hover:underline">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.141-1.02-.12-1.141-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {biographie && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Biographie</h2>
                  <div className="text-taka-gray leading-relaxed whitespace-pre-line">{biographie}</div>
                </div>
              )}

              {albums.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-4">Discographie</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {albums.map((album, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-taka-gray-light">
                        <h3 className="font-display font-bold">{String(album.titre || "Album")}</h3>
                        <p className="text-taka-gray text-sm">{String(album.annee || "")}</p>
                        {album.lien_spotify && String(album.lien_spotify).startsWith("http") && (
                          <a href={String(album.lien_spotify)} target="_blank" rel="noopener noreferrer"
                            className="text-taka-green text-sm hover:underline">Écouter →</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {concerts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <h3 className="font-display text-lg font-bold mb-4">Concerts à venir</h3>
                  <div className="space-y-4">
                    {concerts.map((concert, i) => (
                      <div key={i} className="border-b border-taka-gray-light pb-4 last:border-0 last:pb-0">
                        <p className="font-semibold">{String(concert.ville || "")}</p>
                        <p className="text-taka-gray text-sm">
                          {concert.date ? new Date(String(concert.date)).toLocaleDateString("fr-FR") : ""}
                          {concert.salle && ` · ${String(concert.salle)}`}
                        </p>
                        {concert.lien_ticket && (
                          <a href={String(concert.lien_ticket)} target="_blank" rel="noopener noreferrer"
                            className="text-taka-yellow text-sm hover:underline">Billetterie →</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                <h3 className="font-display text-lg font-bold mb-4">Réseaux sociaux</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(liens).filter(([, url]) => url).map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg border border-taka-gray-light text-sm hover:border-taka-yellow hover:text-taka-yellow transition-all">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </a>
                  ))}
                </div>
              </div>

              <Link href="/boutique" className="bg-taka-yellow text-taka-black px-6 py-3 rounded-xl font-semibold text-center block hover:bg-opacity-90 transition-all">
                Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
