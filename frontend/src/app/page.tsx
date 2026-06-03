import Image from "next/image";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapi, getImageUrl } from '@/lib/api';
import { formatPrice } from '@/lib/price';

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

export default async function HomePage() {
  const projetsData = await fetchStrapi('projets?populate=*&sort=createdAt:desc&pagination[pageSize]=3');
  const artistesData = await fetchStrapi('artistes?populate=*&sort=createdAt:desc&pagination[pageSize]=2');

  const projetsRaw = projetsData as Record<string, unknown>[] | null;
  const artistesRaw = artistesData as Record<string, unknown>[] | null;

  const projets = projetsRaw && Array.isArray(projetsRaw) ? projetsRaw : [];
  const artistes = artistesRaw && Array.isArray(artistesRaw) ? artistesRaw : [];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-taka-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-taka-yellow animate-pulse"></span>
              Association culturelle · Label musical · Bénin
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              L&apos;Art au Service de
              <span className="text-taka-yellow"> l&apos;Humain</span>
            </h1>
            <p className="text-lg md:text-xl text-taka-gray mb-8 max-w-2xl">
              Taka Inside est un carrefour culturel et un label musical associatif dédié à mettre l&apos;art au service de l&apos;humain à travers des projets innovants et authentiques au Bénin et dans le monde.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/projets" className="bg-taka-yellow text-taka-black px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 hover:bg-opacity-90 transition-all">
                Découvrir nos projets
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
              <Link href="/faire-un-don" className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-all">
                Soutenir notre action
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-taka-cream to-transparent"></div>
      </section>

      {/* Section Made In Bénin Radio en vedette */}
      <section className="py-12 md:py-20 bg-taka-yellow relative overflow-hidden">
        {/* Notes de musique flottantes */}
        <span className="absolute top-6 left-8 text-white/40 text-3xl animate-float-note" style={{ animationDelay: '0s' }}>🎵</span>
        <span className="absolute top-12 right-20 text-white/30 text-2xl animate-float-note" style={{ animationDelay: '1s' }}>🎶</span>
        <span className="absolute bottom-8 left-1/4 text-white/25 text-xl animate-float-note" style={{ animationDelay: '2s' }}>🎵</span>
        <span className="absolute bottom-10 right-1/3 text-white/35 text-2xl animate-float-note" style={{ animationDelay: '0.5s' }}>🎶</span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="flex items-center gap-6">
              {/* Logo - pas de halo, fond jaune déjà vibrant */}
              <div className="relative flex-shrink-0">
                <Image
                  src="/images/madeinbeninradio-logo.png"
                  alt="Made In Bénin Radio"
                  width={120}
                  height={120}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-contain relative z-10 hover:animate-spin-slow transition-transform duration-300"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-taka-red animate-pulse"></span>
                  EN DIRECT
                  {/* Petit égaliseur visuel */}
                  <span className="flex items-end gap-[2px] h-3 ml-1">
                    <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0s' }}></span>
                    <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.3s' }}></span>
                    <span className="w-[3px] bg-taka-red rounded-full animate-equalizer" style={{ animationDelay: '0.45s' }}></span>
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-taka-black mb-2">
                  Made In <span className="text-taka-red">Bénin</span> Radio
                </h2>
                <p className="text-taka-black/70 mb-4">
                  <span className="font-semibold text-taka-black">LA Radio des Béninois</span> — 100% culture béninoise, 24H/24 et 7J/7. Écoutez, partout, tout le temps.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/projets/made-in-benin-radio"
                    className="relative overflow-hidden inline-flex items-center gap-2 bg-taka-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all animate-glow"
                  >
                    <span className="absolute inset-0 animate-shimmer pointer-events-none"></span>
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="relative z-10">Écouter la radio</span>
                  </a>
                  <a
                    href="https://bit.ly/4uvR1sY"
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
              {[
                { name: "Facebook", href: "https://facebook.com/madeinbeninradio", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: "Instagram", href: "https://instagram.com/madeinbeninradio", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { name: "YouTube", href: "https://youtube.com/madeinbeninradio", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { name: "TikTok", href: "https://tiktok.com/@madeinbeninradio", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.37-.01-.74-.01-1.11h4.03c.01 1.23.22 2.46.89 3.53.67 1.01 1.78 1.69 2.98 1.78 1.18.09 2.41-.33 3.18-1.28.63-.82.89-1.88.86-2.91-.02-2.57.01-5.14-.02-7.71-1.67 1.02-3.63 1.42-5.57 1.33V5.69c2.02.01 3.94-.77 5.39-2.15.81-.78 1.45-1.73 1.81-2.79.36-.99.49-2.05.46-3.1-.01-.55-.01-1.1-.01-1.63z" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-taka-black flex items-center justify-center text-white hover:bg-white hover:text-taka-black transition-all"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* À Propos */}
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">À Propos</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Brassage culturel &amp; promotion du
                <span className="text-taka-red"> Bénin</span>
              </h2>
              <p className="text-taka-gray text-lg leading-relaxed mb-6">
                Convaincue que les cultures sont des ponts entre les peuples, Taka Inside œuvre pour la promotion du Bénin à travers le monde. Nous croyons que l&apos;art a le pouvoir de transformer, d&apos;unir et d&apos;inspirer.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { number: "10+", label: "Projets réalisés", color: "text-taka-yellow" },
                  { number: "5+", label: "Artistes signés", color: "text-taka-red" },
                  { number: "3", label: "Années d'existence", color: "text-taka-green" },
                  { number: "50+", label: "Bénévoles actifs", color: "text-taka-black" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 border border-taka-gray-light">
                    <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.number}</p>
                    <p className="text-taka-gray text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/association" className="inline-flex items-center gap-2 text-taka-black font-semibold hover:gap-4 hover:text-taka-yellow transition-all">
                En savoir plus
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-taka-gray-light flex items-center justify-center">
                <span className="text-taka-gray">Image association</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-taka-yellow rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-taka-red rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projets en vedette */}
      <section className="py-16 md:py-24 bg-taka-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">Nos Projets</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Projets en <span className="text-taka-yellow">vedette</span></h2>
            </div>
            <Link href="/projets" className="hidden md:inline-flex items-center gap-2 text-taka-green font-semibold hover:gap-4 transition-all">
              Voir tous
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projets.map((projet: Record<string, unknown>) => {
              const coverUrl = extractUrl(projet.image_couverture);
              const desc = String(projet.description || '').substring(0, 120);
              const statut = String(projet.statut || '');
              const slug = String(projet.slug || '');
              const ctaDon = Boolean(projet.cta_don) && statut !== "termine";
              const ctaBenevole = Boolean(projet.cta_benevole) && statut !== "termine";
              return (
                <div key={String(projet.id)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col">
                  <Link href={`/projets/${slug}`} className="block">
                    <div className="aspect-[16/10] bg-taka-gray-light relative">
                      {coverUrl ? (
                        <Image src={getImageUrl({ url: coverUrl }) || ''} alt={String(projet.titre)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-taka-yellow/20 to-taka-green/20" />
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${statutColor(statut)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{statutLabel(statut)}</span>
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
      </section>

      {/* Label Musical */}
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-taka-red font-semibold text-sm uppercase tracking-wider mb-3">Label Musical</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Nos <span className="text-taka-yellow">artistes</span></h2>
            </div>
            <Link href="/label-musical" className="hidden md:inline-flex items-center gap-2 text-taka-red font-semibold hover:gap-4 transition-all">
              Découvrir le label
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {artistes.map((artiste: Record<string, unknown>) => {
              const photoUrl = extractUrl(artiste.photo);
              const bio = String(artiste.biographie || '').substring(0, 140);
              return (
                <Link href={`/label-musical/${artiste.slug || ''}`} key={String(artiste.id)} className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer bg-taka-black">
                  {photoUrl && (
                    <Image src={getImageUrl({ url: photoUrl }) || ''} alt={String(artiste.nom)} fill className="object-cover opacity-60" sizes="(max-width: 768px) 100vw, 50vw" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-taka-black via-taka-black/50 to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                    <p className="text-taka-yellow font-medium text-sm mb-2">{String(artiste.genre_musical || 'Artiste')}</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{String(artiste.nom)}</h3>
                    <p className="text-taka-gray text-sm mb-4">{bio}{bio.length >= 140 ? '...' : ''}</p>
                    <span className="text-white/80 hover:text-taka-yellow transition-colors text-sm font-semibold">Écouter →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Don / Bénévole */}
      <section className="py-16 md:py-24 bg-taka-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-taka-black text-white rounded-2xl p-8 md:p-12">
              <div className="w-14 h-14 rounded-xl bg-taka-green/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Faire un Don</h3>
              <p className="text-taka-gray mb-8">Votre soutien permet de financer nos projets culturels, d&apos;accompagner les artistes et de promouvoir le Bénin.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[5000, 10000, 25000, 50000].map((amount) => (
                  <span key={amount} className='bg-white/10 px-4 py-2 rounded-lg font-semibold'>{formatPrice(amount, "FCFA")}</span>
                ))}
              </div>
              <Link href="/faire-un-don" className="bg-taka-green text-white px-8 py-4 rounded-xl font-semibold text-center block hover:bg-opacity-90 transition-all">Je fais un don</Link>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-taka-black">
              <div className="w-14 h-14 rounded-xl bg-taka-yellow/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-taka-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Devenir Bénévole</h3>
              <p className="text-taka-gray mb-8">Rejoignez notre communauté de passionnés ! Participez à l&apos;organisation d&apos;événements et à la promotion des artistes.</p>
              <ul className="space-y-3 mb-8 text-taka-gray">
                {["Organisation d'événements", "Communication & réseaux sociaux", "Accompagnement artistique"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/devenir-benevole" className="bg-taka-yellow text-taka-black px-8 py-4 rounded-xl font-semibold text-center block border-2 border-taka-black hover:bg-opacity-90 transition-all">Rejoindre l&apos;équipe</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
