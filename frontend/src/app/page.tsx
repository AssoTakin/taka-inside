import Image from "next/image";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapi, getImageUrl } from "@/lib/api";

/* ─── Mock fallback ─── */
const MOCK_PROJETS = [
  { id: 1, titre: "Made In Bénin Radio", statut: "en_cours", tags: "Radio · Média", description: "Web radio dédiée à la promotion de la musique béninoise et africaine.", slug: "made-in-benin-radio" },
  { id: 2, titre: "Taka Culture Festival", statut: "a_venir", tags: "Festival · Événement", description: "Grand festival culturel annuel réunissant artistes et artisans.", slug: "taka-culture-festival" },
  { id: 3, titre: "Ateliers Jeunes Talents", statut: "urgent", tags: "Éducation · Social", description: "Programme d'accompagnement des jeunes artistes béninois.", slug: "ateliers-jeunes-talents" },
];

const MOCK_ARTISTES = [
  { id: 1, nom: "Tomiwa Kéfil", genre_musical: "Afrobeat · World", biographie: "Chanteur et auteur-compositeur, fusionne les rythmes traditionnels du Bénin avec l'afrobeat contemporain.", slug: "tomiwa-kefil" },
  { id: 2, nom: "Ami Sêdjro", genre_musical: "Traditionnel · Jazz", biographie: "Vocaliste et percussionniste, porte-voix des traditions vodun et des mélodies ancestrales du Sud-Bénin.", slug: "ami-sedjro" },
];

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

  const projets = projetsRaw && Array.isArray(projetsRaw) && projetsRaw.length ? projetsRaw : MOCK_PROJETS as Record<string, unknown>[];
  const artistes = artistesRaw && Array.isArray(artistesRaw) && artistesRaw.length ? artistesRaw : MOCK_ARTISTES as Record<string, unknown>[];

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
              <Link href="/association" className="inline-flex items-center gap-2 text-taka-green font-semibold hover:gap-4 transition-all">
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
              return (
                <Link href={`/projets/${projet.slug || ''}`} key={String(projet.id)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="aspect-[16/10] bg-taka-gray-light relative">
                    {coverUrl ? (
                      <Image src={getImageUrl({ url: coverUrl }) || ''} alt={String(projet.titre)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-taka-yellow/20 to-taka-green/20" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${statutColor(String(projet.statut))} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{statutLabel(String(projet.statut))}</span>
                      <span className="text-taka-gray text-xs">{String(projet.tags || 'Projet')}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-taka-green transition-colors">{String(projet.titre)}</h3>
                    <p className="text-taka-gray text-sm mb-4">{desc}{desc.length >= 120 ? '...' : ''}</p>
                    <span className="text-taka-green font-semibold text-sm">En savoir plus →</span>
                  </div>
                </Link>
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
                {["5 000", "10 000", "25 000", "50 000"].map((amount) => (
                  <span key={amount} className="bg-white/10 px-4 py-2 rounded-lg font-semibold">{amount} FCFA</span>
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
