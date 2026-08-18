import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList, fetchStrapiSingle, getImageUrl, renderRichText, fetchLabelMusicalPage as fetchLabelMusicalPageData } from "@/lib/api";
import type { Artiste, LabelMusicalPage, CtaButton } from "@/types";

function buildCta(cta: CtaButton | Record<string, unknown> | undefined) {
  if (!cta || typeof cta !== 'object') return null;
  const label = String((cta as CtaButton).label || '').trim();
  const link = String((cta as CtaButton).link || '').trim();
  if (!label || !link) return null;
  return { ...(cta as CtaButton) };
}

function getPageMeta(page: LabelMusicalPage | null): Metadata {
  const seo = page?.seo;
  const defaultTitle = "Label Musical | Taka Inside";
  const defaultDesc = "Découvrez les artistes et les projets du label musical Taka Inside.";
  return {
    title: seo?.metaTitle || defaultTitle,
    description: seo?.metaDescription || defaultDesc,
    keywords: seo?.keywords,
    openGraph: seo?.ogImage?.url ? { images: [{ url: seo.ogImage.url, alt: seo.ogImage.alt || seo.metaTitle || defaultTitle }] } : undefined,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchLabelMusicalPage();
  return getPageMeta(page);
}

async function fetchLabelMusicalPage(): Promise<LabelMusicalPage | null> {
  const data = await fetchLabelMusicalPageData();
  return data as LabelMusicalPage | null;
}

function IconFor({ name }: { name?: string }) {
  const icon = name || 'music';
  const paths: Record<string, string> = {
    mic: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v2m0-14V3m-7 7a7 7 0 017-7 7 7 0 017 7',
    radio: 'M6.75 7.5l3 2.25-3 2.25m-3-2.25 3 2.25-3 2.25m15-4.5-3 2.25 3 2.25m-3-2.25 3 2.25-3 2.25M3.375 7.5h17.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 01-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125z',
    globe: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.959 11.959 0 013.685 6.698',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z',
    music: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
    users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128a23.91 23.91 0 013.183 1.133 9.386 9.386 0 01-5.26 2.068 9.389 9.389 0 01-5.26-2.068 23.918 23.918 0 013.183-1.133M15 19.128c.346.03.694.032 1.042.032a9.375 9.375 0 004.899-1.382M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128A23.91 23.91 0 005.817 20.26a9.386 9.01 0 005.26 2.068 9.389 9.389 0 005.26-2.068 23.918 23.918 0 01-3.183-1.133M9 19.128c-.346.03-.694.032-1.042.032a9.375 9.375 0 01-4.899-1.382M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z',
    star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    heart: 'M21 8.25c0 2.485-2.099 4.5-4.5 4.5S12 10.735 12 8.25 14.099 3.75 16.5 3.75 21 5.765 21 8.25zm0 0c0 2.485-2.099 4.5-4.5 4.5S12 10.735 12 8.25 14.099 3.75 16.5 3.75 21 5.765 21 8.25zM12 8.25c0 2.485-2.099 4.5-4.5 4.5S3 10.735 3 8.25 5.099 3.75 7.5 3.75 12 5.765 12 8.25zm0 0c0 2.485-2.099 4.5-4.5 4.5S3 10.735 3 8.25 5.099 3.75 7.5 3.75 12 5.765 12 8.25zM11.48 19.35l-5.23-5.23a2.25 2.25 0 013.182-3.182l2.048 2.048 2.048-2.048a2.25 2.25 0 013.182 3.182l-5.23 5.23c-.466.466-1.222.466-1.688 0z',
  };
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[icon] || paths.music} />
    </svg>
  );
}

function CtaButtonLink({ cta, baseColor = 'yellow' }: { cta: CtaButton; baseColor?: 'yellow' | 'red' | 'white' }) {
  const colorClasses = {
    yellow: 'bg-taka-yellow text-taka-black hover:bg-taka-yellow/90',
    red: 'bg-taka-red text-white hover:bg-taka-red/90',
    white: 'bg-white text-taka-black hover:bg-white/90',
  };
  const outlineClasses = {
    yellow: 'border-2 border-taka-yellow text-taka-yellow hover:bg-taka-yellow hover:text-taka-black',
    red: 'border-2 border-taka-red text-taka-red hover:bg-taka-red hover:text-white',
    white: 'border-2 border-white text-white hover:bg-white hover:text-taka-black',
  };
  const cls = cta.style === 'outline' ? outlineClasses[baseColor] : colorClasses[baseColor];
  const target = cta.isExternal ? '_blank' : undefined;
  const rel = cta.isExternal ? 'noopener noreferrer' : undefined;
  return (
    <Link href={cta.link} target={target} rel={rel} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${cls}`}>
      {cta.label}
    </Link>
  );
}

export default async function LabelMusicalPage() {
  const [pageData, artistesData] = await Promise.all([
    fetchLabelMusicalPage(),
    fetchStrapiList("artistes?fields[0]=nom&fields[1]=slug&fields[2]=documentId&fields[3]=genre&fields[4]=biographie&fields[5]=genre_musical&populate[photo][fields][0]=url&populate[photo][fields][1]=alternativeText&sort[0]=nom:asc") as Promise<Record<string, unknown>[] | null>,
  ]);

  const page = pageData as LabelMusicalPage | null;
  const artistes = artistesData || [];

  const hero = page?.hero;
  const stats = page?.stats || [];
  const artistsSectionTitle = page?.artistsSectionTitle || 'Les talents Taka Inside';
  const artistsSectionDescription = page?.artistsSectionDescription || '';
  const artistsSectionCta = buildCta(page?.artistsSectionCta);
  const callout = page?.callout;
  const artistFallbackLabel = page?.artistFallbackLabel || 'Artiste';

  const heroBgUrl = hero?.backgroundImage ? getImageUrl(hero.backgroundImage as unknown as { url: string } | null) : null;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-taka-black text-white py-16 md:py-24 overflow-hidden">
        {heroBgUrl && (
          <div className="absolute inset-0 z-0">
            <Image src={heroBgUrl} alt="" fill className="object-cover opacity-30" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-taka-black via-taka-black/80 to-transparent" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {hero?.badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-medium mb-4">
                <IconFor name="music" />
                {hero.badgeText}
              </div>
            )}
            {hero?.title && (
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                {hero.title}
                {hero.highlightedWord && <span className="text-taka-red"> {hero.highlightedWord}</span>}
              </h1>
            )}
            {hero?.description && (
              <div className="text-lg md:text-xl text-taka-gray mb-8 leading-relaxed">
                {renderRichText(hero.description)}
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              {hero?.primaryCta && <CtaButtonLink cta={hero.primaryCta} baseColor="red" />}
              {hero?.secondaryCta && <CtaButtonLink cta={hero.secondaryCta} baseColor="white" />}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-12 md:py-16 bg-taka-cream border-y border-taka-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 text-center border border-taka-gray-light">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-taka-red/10 text-taka-red mb-4">
                    <IconFor name={stat.icon} />
                  </div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-taka-black">{stat.value}</p>
                  <p className="text-taka-black font-medium mt-1">{stat.label}</p>
                  {stat.description && <p className="text-taka-gray text-sm mt-1">{stat.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artists grid */}
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-taka-red text-sm font-semibold uppercase tracking-wider">Artistes du label</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-taka-black mt-2">{artistsSectionTitle}</h2>
              {artistsSectionDescription && (
                <div className="text-taka-gray mt-3 max-w-2xl">{renderRichText(artistsSectionDescription)}</div>
              )}
            </div>
            {artistsSectionCta && <CtaButtonLink cta={artistsSectionCta} baseColor="yellow" />}
          </div>

          {artistes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-taka-gray-light">
              <p className="text-taka-gray">Aucun artiste pour le moment. Revenez bientôt !</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistes.map((artiste) => {
              const id = String(artiste.documentId || "");
              const slug = String(artiste.slug || "");
              const artistPath = slug ? `/label-musical/${slug}` : (id ? `/label-musical/${id}` : '/label-musical');
              const nom = String(artiste.nom || "");
              const genre = String((artiste.genre_musical || artiste.genre) || "");
              const bio = String(artiste.biographie || "");
              const photoUrl = getImageUrl(artiste.photo as { url: string } | null);
              if (!id) return null;
              return (
                <Link href={artistPath} key={id} className="bg-white rounded-2xl p-6 border border-taka-gray-light flex gap-4 hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-20 h-20 rounded-xl bg-taka-gray-light flex-shrink-0 overflow-hidden relative flex items-center justify-center text-taka-gray font-display font-bold text-xl">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={nom} fill className="object-cover" sizes="80px" />
                    ) : (
                      nom.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-taka-red text-sm font-medium">{genre || artistFallbackLabel}</p>
                    <h3 className="font-display text-xl font-bold mt-1 group-hover:text-taka-yellow transition-colors">{nom}</h3>
                    {bio && <p className="text-taka-gray text-sm mt-2 line-clamp-3">{bio}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Callout */}
      {callout && (
        <section className="py-16 md:py-24 bg-taka-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{callout.title}</h2>
            {callout.description && <div className="text-taka-gray mb-8 text-lg">{renderRichText(callout.description)}</div>}
            <div className="flex flex-wrap justify-center gap-4">
              {callout.primaryCta && <CtaButtonLink cta={callout.primaryCta} baseColor="yellow" />}
              {callout.secondaryCta && <CtaButtonLink cta={callout.secondaryCta} baseColor="white" />}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
