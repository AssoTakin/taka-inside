import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { AudioPreviewPlayer } from "@/components/artistes/AudioPreviewPlayer";
import { fetchStrapiList, getImageUrl } from "@/lib/api";
import type { Artiste, Produit } from "@/types";

const platformIcons: Record<string, string> = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  youtube_music: "YouTube Music",
  deezer: "Deezer",
  tidal: "Tidal",
  soundcloud: "SoundCloud",
  bandcamp: "Bandcamp",
  amazon_music: "Amazon Music",
  boomplay: "Boomplay",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

const shortLabels: Record<string, string> = {
  spotify: "Spotify",
  apple_music: "Apple",
  youtube_music: "YT Music",
  deezer: "Deezer",
  tidal: "Tidal",
  soundcloud: "SoundCloud",
  bandcamp: "Bandcamp",
  amazon_music: "Amazon",
  boomplay: "Boomplay",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

function asArray(item: unknown): unknown[] {
  return Array.isArray(item) ? item : [];
}

function asString(item: unknown): string {
  return typeof item === "string" ? item : "";
}

function formatDate(dateRaw: string): string {
  const date = new Date(dateRaw);
  return isNaN(date.getTime()) ? dateRaw : date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artiste = await fetchArtiste(slug);
  if (!artiste) return { title: "Artiste non trouvé" };
  const nom = asString(artiste.nom);
  const genre = asString(artiste.genre_musical || artiste.genre);
  return {
    title: `${nom}${genre ? ` — ${genre}` : ""} | Label Musical Taka Inside`,
    description: `Découvrez ${nom}, artiste du label Taka Inside. Biographie, discographie, actualités et concerts.`,
  };
}

async function fetchArtiste(slug: string) {
  const qs = new URLSearchParams({
    "populate[photo][fields][0]": "url",
    "populate[photo][fields][1]": "alternativeText",
    "populate[photo_cover][fields][0]": "url",
    "populate[photo_cover][fields][1]": "alternativeText",
    "populate[liens]": "true",
    "populate[liens_streaming]": "true",
    "populate[discographie][populate]": "*",
    "populate[actualites][populate]": "*",
    "populate[concerts]": "true",
    "populate[produits_lies][populate]": "*",
  });
  const artistesData = await fetchStrapiList(`artistes?${qs.toString()}`);
  const artistes: Artiste[] = artistesData && Array.isArray(artistesData) ? (artistesData as unknown as Artiste[]) : [];
  return artistes.find((a) => (a.slug && a.slug === slug) || a.documentId === slug) || null;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const artistesData = await fetchStrapiList("artistes?fields[0]=slug&fields[1]=documentId");
  const artistes = artistesData && Array.isArray(artistesData) ? artistesData : [];
  return artistes
    .filter((a) => a.slug || a.documentId)
    .map((a) => ({ slug: String(a.slug || a.documentId) }));
}

export default async function ArtistePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artiste = await fetchArtiste(slug);
  if (!artiste) notFound();

  const nom = asString(artiste.nom);
  const genre = asString(artiste.genre_musical || artiste.genre);
  const biographie = asString(artiste.biographie);
  const citation = asString(artiste.citation);
  const photoUrl = getImageUrl(artiste.photo) || "/images/logo-taka-inside.jpg";
  const coverUrl = getImageUrl(artiste.photo_cover);

  const liensSociaux = asArray(artiste.liens)[0] as Record<string, unknown> | undefined;
  const liensStreaming = asArray(artiste.liens_streaming) as Record<string, unknown>[];
  const discographie = asArray(artiste.discographie) as Record<string, unknown>[];
  const actualites = asArray(artiste.actualites) as Record<string, unknown>[];
  const concerts = asArray(artiste.concerts) as Record<string, unknown>[];
  const produits = asArray(artiste.produits_lies) as Produit[];

  // Combine social + streaming links into one list for display
  const socialLinks: { platform: string; url: string; type: "social" | "streaming" }[] = [];
  if (liensSociaux) {
    ["facebook", "instagram", "twitter", "youtube", "spotify", "tiktok", "linkedin"].forEach((p) => {
      const url = asString(liensSociaux[p]);
      if (url) socialLinks.push({ platform: p, url, type: "social" });
    });
  }
  liensStreaming.forEach((l) => {
    const platform = asString(l.platform);
    const url = asString(l.url);
    if (platform && url) socialLinks.push({ platform, url, type: "streaming" });
  });

  const hasContent = discographie.length > 0 || actualites.length > 0 || concerts.length > 0 || produits.length > 0 || socialLinks.length > 0;

  return (
    <SiteLayout>
      {/* Hero / Cover */}
      <section className="relative bg-taka-black text-white overflow-hidden">
        {coverUrl ? (
          <div className="absolute inset-0 z-0">
            <Image src={coverUrl} alt={nom} fill className="object-cover opacity-30" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-taka-black/80 via-taka-black/60 to-taka-black" />
          </div>
        ) : null}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link href="/label-musical" className="text-taka-gray hover:text-white transition-colors inline-flex items-center gap-2 mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            Retour au label
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end md:items-end">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-taka-gray-light flex-shrink-0 border-4 border-white/10 shadow-2xl relative">
              <Image src={photoUrl} alt={nom} fill className="object-cover" sizes="(max-width: 768px) 160px, 224px" priority />
            </div>
            <div className="flex-1 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/20 text-taka-red text-sm font-medium mb-3">
                {genre || "Artiste du label"}
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{nom}</h1>
              {citation ? <p className="text-lg md:text-xl text-taka-gray italic max-w-2xl">"{citation}"</p> : null}

              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3 mt-6">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform + link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        link.type === "streaming"
                          ? "bg-taka-yellow text-taka-black hover:bg-white"
                          : "bg-white/10 text-white hover:bg-white hover:text-taka-black"
                      }`}
                    >
                      {platformIcons[link.platform] || shortLabels[link.platform] || link.platform}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-16">
              {/* Biographie */}
              {biographie ? (
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-taka-black mb-4">Biographie</h2>
                  <div className="prose prose-lg max-w-none text-taka-black/80 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: biographie }} />
                </section>
              ) : null}

              {/* Discographie */}
              {discographie.length > 0 ? (
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-taka-black mb-6">Discographie</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {discographie.map((album, idx) => {
                      const titre = asString(album.titre);
                      const type = asString(album.type) || "single";
                      const dateSortie = asString(album.date_sortie || album.annee);
                      const description = asString(album.description);
                      const cover = getImageUrl(album.pochette as { url: string } | null);
                      const extraitAudio = album.extrait_audio as { url?: string } | null;
                      const audioUrl = asString(album.audio_url) || (extraitAudio?.url ? getImageUrl(extraitAudio as { url: string }) : "");
                      const audioType = asString(album.audio_type || "preview");
                      const soutienLabel = asString(album.cta_soutien_label);
                      const soutienUrl = asString(album.cta_soutien_lien);
                      const streamLinks = [
                        { key: "lien_spotify", label: "Spotify" },
                        { key: "lien_apple", label: "Apple Music" },
                        { key: "lien_youtube", label: "YouTube" },
                        { key: "lien_deezer", label: "Deezer" },
                        { key: "lien_tidal", label: "Tidal" },
                        { key: "lien_soundcloud", label: "SoundCloud" },
                        { key: "lien_bandcamp", label: "Bandcamp" },
                      ].filter((l) => asString(album[l.key as keyof typeof album] as unknown));

                      return (
                        <div key={idx} className="bg-white rounded-2xl p-4 border border-taka-gray-light shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <div className="w-28 h-28 rounded-xl bg-taka-gray-light overflow-hidden relative flex-shrink-0">
                              {cover ? (
                                <Image src={cover} alt={titre} fill className="object-cover" sizes="112px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-taka-gray font-display font-bold text-2xl">{nom.charAt(0)}</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-taka-red font-semibold uppercase">{type}</p>
                              <h3 className="font-display text-lg font-bold text-taka-black truncate">{titre}</h3>
                              {dateSortie ? <p className="text-sm text-taka-gray">{dateSortie}</p> : null}
                            </div>
                          </div>
                          {description ? <p className="text-sm text-taka-black/70 mt-3 line-clamp-3">{description}</p> : null}
                          {audioUrl ? (
                            <div className="mt-3">
                              <AudioPreviewPlayer url={audioUrl} title={`${titre} — ${audioType === "full" ? "morceau complet" : "extrait"}`} />
                            </div>
                          ) : null}
                          {soutienLabel && soutienUrl ? (
                            <div className="mt-4">
                              <a
                                href={soutienUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-taka-yellow text-taka-black text-sm font-bold hover:bg-taka-red hover:text-white transition-colors"
                              >
                                {soutienLabel}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                              </a>
                            </div>
                          ) : null}
                          {streamLinks.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {streamLinks.map((l) => (
                                <a
                                  key={l.key}
                                  href={asString(album[l.key as keyof typeof album] as unknown)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-full bg-taka-cream text-taka-black text-xs font-medium hover:bg-taka-yellow transition-colors"
                                >
                                  {l.label}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* Actualités */}
              {actualites.length > 0 ? (
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-taka-black mb-6">Actualités</h2>
                  <div className="space-y-6">
                    {actualites.map((actu, idx) => {
                      const titre = asString(actu.titre);
                      const date = asString(actu.date);
                      const contenu = asString(actu.contenu);
                      const image = getImageUrl(actu.image as { url: string } | null);
                      const lien = asString(actu.lien);
                      return (
                        <article key={idx} className="bg-white rounded-2xl p-6 border border-taka-gray-light shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6">
                            {image ? (
                              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                                <Image src={image} alt={titre} fill className="object-cover" sizes="(max-width: 768px) 100vw, 192px" />
                              </div>
                            ) : null}
                            <div className="flex-1">
                              {date ? <time className="text-sm text-taka-red font-medium">{formatDate(date)}</time> : null}
                              <h3 className="font-display text-xl font-bold text-taka-black mt-1">{titre}</h3>
                              {contenu ? <div className="prose prose-sm max-w-none text-taka-black/80 mt-2" dangerouslySetInnerHTML={{ __html: contenu }} /> : null}
                              {lien ? (
                                <a href={lien} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-taka-red font-medium mt-3 hover:underline">
                                  Lire la suite
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </div>

            {/* Colonne latérale */}
            <aside className="space-y-10">
              {/* Concerts */}
              {concerts.length > 0 ? (
                <section className="bg-white rounded-2xl p-6 border border-taka-gray-light shadow-sm">
                  <h2 className="font-display text-xl font-bold text-taka-black mb-4">Prochains concerts</h2>
                  <div className="space-y-4">
                    {concerts.map((concert, idx) => {
                      const ville = asString(concert.ville);
                      const salle = asString(concert.salle);
                      const dateRaw = asString(concert.date);
                      const lienTicket = asString(concert.lien_ticket);
                      return (
                        <div key={idx} className="border-l-4 border-taka-red pl-4">
                          <p className="text-sm text-taka-red font-semibold">{formatDate(dateRaw)}</p>
                          <p className="font-bold text-taka-black">{ville}{salle ? ` — ${salle}` : ""}</p>
                          {lienTicket ? (
                            <a href={lienTicket} target="_blank" rel="noopener noreferrer" className="text-sm text-taka-red hover:underline mt-1 inline-block">Billetterie →</a>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* Produits liés */}
              {produits.length > 0 ? (
                <section className="bg-white rounded-2xl p-6 border border-taka-gray-light shadow-sm">
                  <h2 className="font-display text-xl font-bold text-taka-black mb-4">Boutique &amp; billets</h2>
                  <div className="space-y-4">
                    {produits.map((produit) => {
                      const image = produit.images?.[0]?.url ? getImageUrl(produit.images[0]) : null;
                      const prix = typeof produit.prix === "number" ? produit.prix : Number(produit.prix || 0);
                      const devise = asString((produit as unknown as Record<string, unknown>).devise) || "EUR";
                      const symbol = devise === "FCFA" ? "FCFA" : "€";
                      return (
                        <Link key={produit.documentId} href={`/boutique/${produit.slug || produit.documentId}`} className="flex gap-4 group">
                          <div className="w-20 h-20 rounded-xl bg-taka-gray-light overflow-hidden relative flex-shrink-0">
                            {image ? (
                              <Image src={image} alt={produit.nom} fill className="object-cover" sizes="80px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-taka-gray font-bold">{produit.nom.charAt(0)}</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-taka-black group-hover:text-taka-yellow transition-colors">{produit.nom}</p>
                            <p className="text-sm text-taka-gray">{produit.prix === 0 ? "Gratuit" : `${prix.toFixed(2)} ${symbol}`}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link href="/boutique" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-taka-black text-white text-sm font-medium hover:bg-taka-red transition-colors">
                    Voir la boutique
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </section>
              ) : null}

              {/* CTA Label */}
              <section className="bg-taka-black rounded-2xl p-6 text-white">
                <h2 className="font-display text-xl font-bold mb-2">Découvrir le label</h2>
                <p className="text-taka-gray text-sm mb-4">Explorez tous les artistes, albums et projets du label Taka Inside.</p>
                <Link href="/label-musical" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-taka-yellow text-taka-black text-sm font-bold hover:bg-white transition-colors">
                  Tous les artistes
                </Link>
              </section>
            </aside>
          </div>

          {!hasContent ? (
            <div className="mt-16 text-center">
              <p className="text-taka-gray">Plus de contenu à venir prochainement pour {nom}.</p>
              <Link href="/label-musical" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-taka-yellow text-taka-black font-bold hover:bg-taka-red hover:text-white transition-colors">
                Découvrir les autres artistes
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </SiteLayout>
  );
}
