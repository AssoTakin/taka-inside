import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchHomepage, fetchHomepageLight, fetchSiteConfig, fetchStrapiList, getImageUrl, extractData, fetchGlobalCta } from "@/lib/api";
import { formatPrice } from "@/lib/price";
import { Metadata } from "next";

function statutLabel(s: string) {
  switch (s) {
    case 'en_cours': return 'En cours';
    case 'a_venir': return 'À venir';
    case 'urgent': return 'Urgent';
    case 'termine': return 'Terminé';
    default: return s;
  }
}

function statutColor(s: string) {
  switch (s) {
    case 'en_cours': return 'bg-taka-green';
    case 'a_venir': return 'bg-taka-yellow text-taka-black';
    case 'urgent': return 'bg-taka-red';
    case 'termine': return 'bg-taka-gray text-white';
    default: return 'bg-taka-gray';
  }
}

function extractUrl(image: unknown): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image !== null) {
    const img = image as Record<string, unknown>;
    if (img.url && typeof img.url === 'string') return img.url;
    if (img.data && typeof img.data === 'object') {
      const data = img.data as Record<string, unknown>;
      if (data.attributes && typeof data.attributes === 'object') {
        const attrs = data.attributes as Record<string, unknown>;
        if (attrs.url && typeof attrs.url === 'string') return attrs.url;
      }
      if (data.url && typeof data.url === 'string') return data.url;
    }
  }
  return null;
}

function RichTextToPlain({ text }: { text?: string }) {
  if (!text) return null;
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return <>{plain}</>;
}

function CtaButton({ cta, baseClass }: { cta?: Record<string, unknown> | null; baseClass?: string }) {
  if (!cta) return null;
  const label = String(cta.label || '');
  const link = String(cta.link || '/');
  const isExternal = Boolean(cta.isExternal);
  const style = String(cta.style || 'primary');
  const icon = cta.icon ? String(cta.icon) : null;

  const styleClass =
    style === 'secondary'
      ? 'bg-taka-yellow text-taka-black hover:bg-opacity-90'
      : style === 'outline'
        ? 'border border-white/30 text-white hover:bg-white/5'
        : 'bg-taka-yellow text-taka-black hover:bg-opacity-90';

  const className = `${baseClass || ''} ${styleClass} px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 w-full sm:w-[200px] text-center whitespace-nowrap`;

  const content = (
    <>
      {label}
      {icon && <span>{icon}</span>}
    </>
  );

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={link} className={className}>
      {content}
    </Link>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await fetchHomepage();
  const data = extractData(homepage);
  const seo = data?.seo as Record<string, unknown> | undefined;
  return {
    title: String(seo?.metaTitle || "Taka Inside"),
    description: String(seo?.metaDescription || "L'Art au Service de l'Humain"),
  };
}

export default async function HomePage() {
  const [homepage, configRaw, ctaRaw, projetsData, artistesData] = await Promise.all([
    fetchHomepage().catch(() => fetchHomepageLight()).catch(() => null),
    fetchSiteConfig().catch(() => null),
    fetchGlobalCta('header-don').catch(() => null),
    fetchStrapiList("projets?populate=*&sort=createdAt:desc").catch(() => null),
    fetchStrapiList("artistes?populate=*&sort=createdAt:desc").catch(() => null),
  ]);

  const homepageData = extractData(homepage) || {};
  const config = extractData(configRaw) || {};
  const ctaDon = extractData(ctaRaw);
  const headerDonLabel = (ctaDon?.label as string) || 'Faire un Don';
  const headerDonUrl = (ctaDon?.url as string) || '/faire-un-don';

  const rawSocials = config?.socialLinks as unknown[] | undefined;
  const socialLinks: { platform: string; url: string }[] = [];
  if (Array.isArray(rawSocials)) {
    rawSocials.forEach((s) => {
      if (s && typeof s === 'object') {
        const item = s as Record<string, unknown>;
        if (item.url && item.platform) {
          socialLinks.push({ platform: String(item.platform), url: String(item.url) });
        }
      }
    });
  }

  const projets = (projetsData && Array.isArray(projetsData) ? projetsData : []) as Record<string, unknown>[];
  const artistes = (artistesData && Array.isArray(artistesData) ? artistesData : []) as Record<string, unknown>[];

  const hero = homepageData.hero as Record<string, unknown> | undefined;
  const sections = (homepageData.sections as Record<string, unknown>[] | undefined) || [];

  // Fallback hero si Strapi vide
  const heroBadge = String(hero?.badgeText || "Association culturelle · Label musical · Bénin");
  const heroTitle = String(hero?.title || "L'Art au Service de");
  const heroHighlighted = String((hero?.highlightedWord as string) || "l'Humain");
  const heroDescription = String(
    (hero?.description as string) ||
      "Taka Inside est un carrefour culturel et un label musical associatif dédié à mettre l'art au service de l'humain à travers des projets innovants et authentiques au Bénin et dans le monde."
  );
  const heroPrimaryCta = (hero?.primaryCta as Record<string, unknown>) || { label: "Découvrir nos projets", link: "/projets", style: "primary" };
  const heroSecondaryCta = hero?.secondaryCta as Record<string, unknown> | undefined;
  const heroBg = extractUrl(hero?.backgroundImage);

  // Sections statiques par défaut si aucune section Strapi
  const defaultSections = [
    { __component: 'homepage.radio-section', title: 'LA Radio des Béninois', subtitle: 'Radio', description: 'La radio des Béninois — 100% culture béninoise, 24H/24 et 7J/7.', logo: '/images/madeinbeninradio-logo-new.jpg', listenCta: { label: "Écouter la radio", link: "/projets/made-in-benin-radio", style: "primary", icon: "play" }, projectLink: '/projets/made-in-benin-radio', links: [
      { label: 'Facebook', link: 'https://www.facebook.com/takainside', style: 'primary', icon: 'facebook' },
      { label: 'Instagram', link: 'https://www.instagram.com/takainside_asso', style: 'primary', icon: 'instagram' },
      { label: 'X', link: 'https://x.com/takainsideasso', style: 'primary', icon: 'twitter' },
    ]},
    { __component: 'homepage.about-section', title: 'À Propos', description: 'Convaincue que les cultures sont des ponts entre les peuples...', image: '/images/logo-taka-inside.jpg', cta: { label: 'En savoir plus', link: '/association', style: 'outline' } },
    { __component: 'homepage.featured-projects-section', title: 'Nos projets', description: 'Projets en vedette', numberToDisplay: 3, cta: { label: 'Voir tous', link: '/projets', style: 'primary' } },
    { __component: 'homepage.featured-artists-section', title: 'Artistes du label', description: 'Nos artistes', numberToDisplay: 2, cta: { label: 'Découvrir le label', link: '/label-musical', style: 'primary' } },
    { __component: 'homepage.cta-don-section', title: headerDonLabel, description: 'Votre soutien permet de financer nos projets culturels...', amounts: '10,15,25,50', button: { label: 'Je fais un don', link: headerDonUrl, style: 'primary' } },
    { __component: 'homepage.cta-benevole-section', title: 'Devenir Bénévole', description: 'Rejoignez notre communauté de passionnés et contribuez activement à la promotion de la culture béninoise.', items: [
      { value: '', label: "Organisation d'événements" },
      { value: '', label: "Communication & réseaux sociaux" },
      { value: '', label: "Accompagnement artistique" },
    ], button: { label: "Rejoindre l'équipe", link: '/devenir-benevole', style: 'primary' } },
  ];

  const activeSections = sections.length > 0 ? sections : defaultSections;

  // Extract stats section so it can be merged with AboutSection
  const statsSection = activeSections.find(s => s.__component === 'homepage.stats-section') as Record<string, unknown> | undefined;
  const stats = statsSection?.stats as Record<string, unknown>[] | undefined;

  // Use default stats if Strapi stats are empty/missing
  const effectiveStats = (stats && stats.length > 0) ? stats : [
    { value: "10+", label: "Projets réalisés" },
    { value: "5+", label: "Artistes signés" },
    { value: "3", label: "Années d'existence" },
    { value: "50+", label: "Bénévoles actifs" },
  ];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-taka-black text-white relative overflow-hidden">
        {heroBg && (
          <div className="absolute inset-0 -z-10">
            <Image src={getImageUrl({ url: heroBg }) || heroBg} alt="" fill className="object-cover opacity-30" priority />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-taka-yellow animate-pulse"></span>
              {heroBadge}
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              {heroTitle}
              <span className="text-taka-yellow"> {heroHighlighted}</span>
            </h1>
            <p className="text-lg md:text-xl text-taka-gray mb-8 max-w-2xl">
              <RichTextToPlain text={heroDescription} />
            </p>
            <div className="flex flex-wrap gap-4">
              <CtaButton cta={heroPrimaryCta} baseClass="text-lg" />
              {heroSecondaryCta && <CtaButton cta={heroSecondaryCta} baseClass="text-lg" />}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-taka-cream to-transparent"></div>
      </section>

      {/* Dynamic sections */}
      {activeSections.map((section, idx) => {
        const comp = String(section.__component || '');
        if (comp === 'homepage.radio-section') {
          return <RadioSection key={idx} section={section} socialLinks={socialLinks} />;
        }
        if (comp === 'homepage.about-section') {
          return <AboutSection key={idx} section={section} stats={effectiveStats} />;
        }
        if (comp === 'homepage.featured-projects-section') {
          return <FeaturedProjectsSection key={idx} section={section} projets={projets} />;
        }
        if (comp === 'homepage.featured-artists-section') {
          return <FeaturedArtistsSection key={idx} section={section} artistes={artistes} />;
        }
        if (comp === 'homepage.stats-section') {
          // Stats are rendered inside AboutSection when both exist
          return stats ? null : <StatsSection key={idx} section={section} />;
        }
        if (comp === 'homepage.newsletter-section') {
          return <NewsletterSection key={idx} section={section} />;
        }
        if (comp === 'homepage.cta-don-section') {
          const bSection = activeSections.find(s => s.__component === 'homepage.cta-benevole-section');
          return <CtaDonSection key={idx} section={section} benevoleSection={bSection} />;
        }
        if (comp === 'homepage.cta-benevole-section') {
          // Skip standalone benevole section since it's merged with CTA don
          return null;
        }
        if (comp === 'homepage.social-section') {
          return <SocialSection key={idx} section={section} socialLinks={socialLinks} />;
        }
        return null;
      })}
    </SiteLayout>
  );
}

function SectionWrapper({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

function RadioSection({ section, socialLinks }: { section: Record<string, unknown>; socialLinks: { platform: string; url: string }[] }) {
  const title = String(section.title || 'LA Radio des Béninois');
  const subtitle = String(section.subtitle || 'Radio');
  const description = String(section.description || 'La radio des Béninois — 100% culture béninoise, 24H/24 et 7J/7.');
  const logo = extractUrl(section.logo);
  const listenCta = (section.listenCta as Record<string, unknown> | undefined) || { label: 'Écouter la radio', link: '/projets/made-in-benin-radio', style: 'primary' };
  const rawLinks = (section.links as unknown[]) || [];
  const links: { label: string; link: string; icon?: string; isExternal?: boolean }[] = [];
  if (Array.isArray(rawLinks)) {
    rawLinks.forEach((l) => {
      if (l && typeof l === 'object') {
        const item = l as Record<string, unknown>;
        if (item.label && item.link) {
          links.push({ label: String(item.label), link: String(item.link), icon: item.icon ? String(item.icon) : undefined, isExternal: Boolean(item.isExternal) });
        }
      }
    });
  }

  return (
    <SectionWrapper className="py-12 md:py-20 bg-taka-yellow relative overflow-hidden">
      <span className="absolute top-6 left-8 text-white/40 text-3xl animate-float-note" style={{ animationDelay: '0s' }}>🎵</span>
      <span className="absolute top-12 right-20 text-white/30 text-2xl animate-float-note" style={{ animationDelay: '1s' }}>🎶</span>
      <span className="absolute bottom-8 left-1/4 text-white/25 text-xl animate-float-note" style={{ animationDelay: '2s' }}>🎵</span>
      <span className="absolute bottom-10 right-1/3 text-white/35 text-2xl animate-float-note" style={{ animationDelay: '0.5s' }}>🎶</span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              {logo ? (
                <Image src={getImageUrl({ url: logo }) || logo} alt={title} width={120} height={120} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-contain relative z-10 hover:animate-spin-slow transition-transform duration-300" />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-taka-black flex items-center justify-center text-white font-display text-xl">
                  {title.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-semibold mb-3 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-taka-red animate-pulse"></span>
                EN DIRECT
                <span className="flex items-end gap-[2px] h-3 ml-1">
                  <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0s' }}></span>
                  <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.45s' }}></span>
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-taka-black mb-2">
                {title.includes('Bénin') ? (
                  <>{title.split('Bénin')[0]}<span className="text-taka-red">Bénin</span>{title.split('Bénin')[1]}</>
                ) : (
                  title
                )}
              </h2>
              <p className="text-taka-black/70 mb-4">
                <span className="font-semibold text-taka-black">{subtitle}</span> — <RichTextToPlain text={description} />
              </p>
              <div className="flex flex-wrap gap-3">
                <CtaButton cta={listenCta} baseClass="relative overflow-hidden animate-glow" />
                <a
                  href="https://play.google.com/store/apps/details?id=com.radioking.mibradio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-taka-black text-taka-black px-5 py-3 rounded-xl font-semibold hover:bg-taka-black hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.303 2.303-8.633-8.635z"/>
                  </svg>
                  Télécharger l'appli
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end gap-3">
            {links.length > 0 ? (
              links.map((link, idx) => (
                <a
                  key={`${link.label}-${idx}`}
                  href={link.link}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-xl bg-taka-black flex items-center justify-center text-white hover:bg-white hover:text-taka-black transition-all"
                  aria-label={link.label}
                >
                  <SocialIcon platform={link.icon || link.label} />
                </a>
              ))
            ) : socialLinks.length > 0 ? (
              socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-taka-black flex items-center justify-center text-white hover:bg-white hover:text-taka-black transition-all"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))
            ) : (
              <p className="text-taka-black/50 text-sm">Réseaux sociaux à venir...</p>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function AboutSection({ section, stats }: { section: Record<string, unknown>; stats?: Record<string, unknown>[] }) {
  const title = String(section.title || 'À Propos');
  const description = String(section.description || '');
  const image = extractUrl(section.image);
  const cta = section.cta as Record<string, unknown> | undefined;

  const titleParts = title.split(' ');
  const lastWord = titleParts.pop() || '';
  const titleStart = titleParts.join(' ');

  const colorClasses = ['text-taka-yellow', 'text-taka-red', 'text-taka-green', 'text-taka-black'];

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {title && (
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">{title}</p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              {titleStart} <span className="text-taka-red">{lastWord}</span>
            </h2>
            <div className="text-taka-gray text-lg leading-relaxed mb-6">
              <RichTextToPlain text={description} />
            </div>

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, i) => {
                  const value = String(stat.value || '0');
                  const label = String(stat.label || '');
                  return (
                    <div key={label + i} className="bg-white rounded-xl p-4 border border-taka-gray-light">
                      <p className={`font-display text-3xl font-bold ${colorClasses[i % 4]}`}>{value}</p>
                      <p className="text-taka-gray text-sm">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {cta && (
              <Link
                href={String(cta.link || '/association')}
                className="inline-flex items-center gap-2 text-taka-black font-semibold hover:gap-4 hover:text-taka-yellow transition-all group"
              >
                {String(cta.label || 'En savoir plus')}
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-taka-gray-light flex items-center justify-center">
              {image ? (
                <Image src={getImageUrl({ url: image }) || image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <span className="text-taka-gray">Image association</span>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-taka-yellow rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-taka-red rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function FeaturedProjectsSection({ section, projets }: { section: Record<string, unknown>; projets: Record<string, unknown>[] }) {
  const title = String(section.title || 'Nos projets');
  const description = String(section.description || '');
  const numberToDisplay = Math.min(Math.max(Number(section.numberToDisplay) || 3, 1), 6);
  const cta = section.cta as Record<string, unknown> | undefined;

  const titleParts = title.split(' ');
  const lastWord = titleParts.pop() || '';
  const titleStart = titleParts.join(' ');

  const featured = projets.slice(0, numberToDisplay);

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            {description && description !== title && (
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">{description}</p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold">{titleStart} <span className="text-taka-yellow">{lastWord}</span></h2>
          </div>
          {cta && <div className="sm:ml-auto"><CtaButton cta={cta} /></div>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((projet) => {
            const slug = String(projet.slug || '');
            const statut = String(projet.statut || '');
            const coverUrl =
              slug === "made-in-benin-radio"
                ? "/images/madeinbeninradio-logo-new.jpg"
                : slug === "mib-talents-a-suivre"
                  ? "/images/mib-talents-logo.jpg"
                  : getImageUrl(projet.image_couverture as { url: string } | null) || "/images/logo-taka-inside.jpg";
            const desc = String(projet.description || '').substring(0, 120);
            const ctaDon = Boolean(projet.cta_don) && statut !== "termine";
            const ctaBenevole = Boolean(projet.cta_benevole) && statut !== "termine";

            return (
              <div key={slug} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col">
                <Link href={`/projets/${slug}`} className="block">
                  <div className="aspect-[16/10] bg-taka-gray-light relative">
                    {coverUrl ? (
                      <Image src={coverUrl} alt={String(projet.titre)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-taka-yellow/30 to-taka-green/30 flex items-center justify-center">
                        <Image src="/images/logo-taka-inside.jpg" alt={String(projet.titre)} width={120} height={120} className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover opacity-90" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${statutColor(statut)} text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>{statutLabel(statut)}</span>
                    <span className="text-taka-gray text-xs">{String(projet.tags || 'Projet')}</span>
                  </div>
                  <Link href={`/projets/${slug}`}>
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-taka-yellow transition-colors">{String(projet.titre)}</h3>
                  </Link>
                  <p className="text-taka-gray text-sm mb-4 flex-1">{desc}{desc.length >= 120 ? '...' : ''}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/projets/${slug}`} className="text-sm font-medium text-taka-black hover:text-taka-yellow transition-colors">
                      En savoir plus →
                    </Link>
                    {ctaDon && (
                      <Link href="/faire-un-don" className="text-sm font-medium text-taka-red hover:text-taka-red/80 transition-colors">
                        Soutenir 💛
                      </Link>
                    )}
                    {ctaBenevole && (
                      <Link href="/devenir-benevole" className="text-sm font-medium text-taka-green hover:text-taka-green/80 transition-colors">
                        Bénévolat 🌱
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

function FeaturedArtistsSection({ section, artistes }: { section: Record<string, unknown>; artistes: Record<string, unknown>[] }) {
  const title = String(section.title || 'Nos artistes');
  const description = String(section.description || '');
  const numberToDisplay = Math.min(Math.max(Number(section.numberToDisplay) || 2, 1), 6);
  const cta = section.cta as Record<string, unknown> | undefined;

  const titleParts = title.split(' ');
  const lastWord = titleParts.pop() || '';
  const titleStart = titleParts.join(' ');

  const featured = artistes.slice(0, numberToDisplay);

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            {description && description !== title && (
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">{description}</p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold">{titleStart} <span className="text-taka-red">{lastWord}</span></h2>
          </div>
          {cta && <div className="sm:ml-auto"><CtaButton cta={cta} /></div>}
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {featured.map((artiste) => {
            const slug = String(artiste.slug || '');
            const nom = String(artiste.nom || 'Artiste');
            const bio = String(artiste.bio || '');
            const photoUrl =
              getImageUrl(artiste.photo as { url: string } | null) || "/images/logo-taka-inside.jpg";

            return (
              <Link
                key={slug}
                href={`/label-musical/${slug}`}
                className="bg-white rounded-2xl p-6 border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all group flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-taka-gray-light">
                  <Image src={photoUrl} alt={nom} width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs text-taka-green font-semibold uppercase">Artiste</span>
                  <h3 className="font-display text-xl font-bold group-hover:text-taka-yellow transition-colors">{nom}</h3>
                  <p className="text-taka-gray text-sm line-clamp-2">{bio}</p>
                  <span className="text-sm font-medium text-taka-black group-hover:text-taka-yellow transition-colors">Écouter →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

function StatsSection({ section }: { section: Record<string, unknown> }) {
  const stats = (section.stats as Record<string, unknown>[] | undefined) || [];

  const colorClasses = ['text-taka-yellow', 'text-taka-red', 'text-taka-green', 'text-taka-black'];

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const value = String(stat.value || '0');
            const label = String(stat.label || '');
            return (
              <div key={label + i} className="bg-white rounded-2xl p-6 text-center border border-taka-gray-light">
                <p className={`font-display text-4xl font-bold ${colorClasses[i % 4]}`}>{value}</p>
                <p className="text-taka-gray mt-1">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

function NewsletterSection({ section }: { section: Record<string, unknown> }) {
  const title = String(section.title || 'Newsletter');
  const description = String(section.description || '');
  const placeholder = String(section.placeholder || 'Votre email');
  const buttonText = String(section.buttonText || 'S\'inscrire');

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        {description && <p className="text-taka-gray mb-8 max-w-2xl mx-auto">{description}</p>}
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input type="email" placeholder={placeholder} className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-taka-gray focus:outline-none focus:border-taka-yellow" />
          <button type="submit" className="px-6 py-3 bg-taka-yellow text-taka-black rounded-xl font-semibold hover:bg-opacity-90 transition-all">{buttonText}</button>
        </form>
      </div>
    </SectionWrapper>
  );
}

function CtaDonSection({ section, benevoleSection }: { section: Record<string, unknown>; benevoleSection?: Record<string, unknown> }) {
  const title = String(section.title || 'Faire un Don');
  const description = String(section.description || '');
  const amountsStr = String(section.amounts || '10,15,25,50');
  const amounts = amountsStr.split(',').map(a => Number(a.trim())).filter(Boolean);
  const button = (section.button as Record<string, unknown>) || { label: 'Je fais un don', link: '/faire-un-don', style: 'primary' };

  const bTitle = String(benevoleSection?.title || 'Devenir Bénévole');
  const bDescription = String(benevoleSection?.description || 'Rejoignez notre communauté de passionnés et contribuez activement à la promotion de la culture béninoise.');
  const bButton = (benevoleSection?.button as Record<string, unknown>) || { label: "Rejoindre l'équipe", link: '/devenir-benevole', style: 'primary' };

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-taka-black text-white rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-taka-green/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{title}</h3>
            <div className="text-taka-gray mb-8">
              <RichTextToPlain text={description} />
            </div>
            {amounts.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {amounts.map((amount) => (
                  <span key={amount} className='bg-white/10 px-4 py-2 rounded-lg font-semibold'>{formatPrice(amount)}</span>
                ))}
              </div>
            )}
            <div className="mt-auto">
              <CtaButton cta={button} baseClass="w-full justify-center text-center block py-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-taka-black flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-taka-yellow/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-taka-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{bTitle}</h3>
            <p className="text-taka-gray mb-8">{bDescription}</p>
            <div className="mt-auto">
              <CtaButton cta={bButton} baseClass="w-full justify-center text-center block py-4 border-2 border-taka-black" />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function CtaBenevoleSection({ section }: { section: Record<string, unknown> }) {
  const title = String(section.title || 'Devenir Bénévole');
  const description = String(section.description || '');
  const items = (section.items as Record<string, unknown>[] | undefined) || [];
  const button = (section.button as Record<string, unknown>) || { label: "Rejoindre l'équipe", link: '/devenir-benevole', style: 'primary' };

  const defaultItems = [
    { value: '', label: "Organisation d'événements" },
    { value: '', label: "Communication & réseaux sociaux" },
    { value: '', label: "Accompagnement artistique" },
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <SectionWrapper className="py-16 md:py-24 bg-taka-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-taka-black">
          <div className="w-14 h-14 rounded-xl bg-taka-yellow/20 flex items-center justify-center mb-6">
            <svg className="w-7 h-7 text-taka-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{title}</h3>
          <div className="text-taka-gray mb-8">
            <RichTextToPlain text={description} />
          </div>
          <ul className="space-y-3 mb-8 text-taka-gray">
            {list.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                {String(item.value || '') && <span className="mr-1">{String(item.value)}</span>}
                {String(item.label)}
              </li>
            ))}
          </ul>
          <CtaButton cta={button} baseClass="w-full justify-center text-center block" />
        </div>
      </div>
    </SectionWrapper>
  );
}

function SocialSection({ section, socialLinks }: { section: Record<string, unknown>; socialLinks: { platform: string; url: string }[] }) {
  const description = String(section.description || '');
  const useGlobal = section.useGlobalSocials !== false;
  const links = useGlobal ? socialLinks : [];

  return (
    <SectionWrapper className="py-12 bg-taka-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {description && <p className="text-taka-black/70 mb-4">{description}</p>}
        <div className="flex justify-center gap-3">
          {links.length > 0 ? (
            links.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-taka-black flex items-center justify-center text-white hover:bg-white hover:text-taka-black transition-all"
                aria-label={social.platform}
              >
                <SocialIcon platform={social.platform} />
              </a>
            ))
          ) : (
            <p className="text-taka-black/50 text-sm">Réseaux sociaux à venir...</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const size = "w-5 h-5";
  const key = platform.toLowerCase().trim();
  const icons: Record<string, React.JSX.Element> = {
    facebook: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    twitter: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    x: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.37-.01-.74-.01-1.11h4.03c.01 1.23.22 2.46.89 3.53.67 1.01 1.78 1.69 2.98 1.78 1.18.09 2.41-.33 3.18-1.28.63-.82.89-1.88.86-2.91-.02-2.57.01-5.14-.02-7.71-1.67 1.02-3.63 1.42-5.57 1.33V5.69c2.02.01 3.94-.77 5.39-2.15.81-.78 1.45-1.73 1.81-2.79.36-.99.49-2.05.46-3.1-.01-.55-.01-1.1-.01-1.63z" />
      </svg>
    ),
    linkedin: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    spotify: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.365-2.111-10.542-1.151-.418.091-.779-.181-.869-.539-.09-.421.18-.78.54-.87 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.252 1.02zm1.44-3.3c-.301.449-.839.6-1.287.3-3.225-1.98-8.142-2.551-11.958-1.396-.539.18-1.08-.12-1.26-.66-.18-.539.12-1.08.66-1.26 4.35-1.32 9.72-.66 13.485 1.621.449.24.599.779.36 1.396zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.18-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.021.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  };

  return icons[key] || (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
