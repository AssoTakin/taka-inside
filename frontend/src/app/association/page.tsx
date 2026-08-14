import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://taka-inside-production.up.railway.app";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function getAssociationPage() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/page-contents?filters[slug]=association&populate=*`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const item = json.data?.[0];
    if (!item) return null;
    const attrs = item.attributes || item;

    // Hero image
    const hero = attrs.heroImage;
    let imageUrl = null;
    if (hero && typeof hero === "object") {
      const url = hero.url || hero.data?.attributes?.url;
      if (url) imageUrl = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
    }

    // Texte dynamique depuis content blocks
    const contentBlocks = Array.isArray(attrs.content) ? attrs.content : [];
    const paragraphs = contentBlocks
      .filter((b: any) => b.type === "paragraph")
      .map((b: any) => b.children?.map((c: any) => c.text).join("") || "")
      .filter(Boolean);

    // Stats depuis formConfig
    const rawStats = attrs.formConfig?.stats || [];
    const stats = Array.isArray(rawStats) && rawStats.length === 4
      ? rawStats
      : [
          { number: "10+", label: "Projets réalisés", color: "text-taka-yellow" },
          { number: "5+", label: "Artistes signés", color: "text-taka-red" },
          { number: "3", label: "Années d'existence", color: "text-taka-green" },
          { number: "50+", label: "Bénévoles actifs", color: "text-taka-black" },
        ];

    return {
      imageUrl,
      paragraphs,
      stats,
    };
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "L'Association",
  description: "Découvrez Taka Inside, carrefour culturel et label musical associatif basé au Bénin.",
};

export default async function AssociationPage() {
  const pageData = await getAssociationPage();
  const imageUrl = pageData?.imageUrl || `${STRAPI_URL}/uploads/Takin_logo_final_sans_229_7671f0d3ab.png`;
  const paragraphs = pageData?.paragraphs || [
    "Taka Inside est un carrefour culturel et un label musical associatif dédié à mettre l'art au service de l'humain à travers des projets innovants et authentiques au Bénin et dans le monde.",
    "Convaincue que les cultures sont des ponts entre les peuples, Taka Inside œuvre pour la promotion du Bénin à travers le monde. Nous croyons que l'art a le pouvoir de transformer, d'unir et d'inspirer.",
  ];
  const stats = pageData?.stats || [
    { number: "10+", label: "Projets réalisés", color: "text-taka-yellow" },
    { number: "5+", label: "Artistes signés", color: "text-taka-red" },
    { number: "3", label: "Années d'existence", color: "text-taka-green" },
    { number: "50+", label: "Bénévoles actifs", color: "text-taka-black" },
  ];
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-green/15 text-taka-green text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Association à but non lucratif
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Qui sommes-<span className="text-taka-green">nous ?</span></h1>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-taka-green font-semibold text-sm uppercase tracking-wider mb-3">Notre mission</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                L&apos;Art au Service de
                <span className="text-taka-yellow"> l&apos;Humain</span>
              </h2>
              {paragraphs.map((text: string, idx: number) => (
                <p key={idx} className="text-taka-gray text-lg leading-relaxed mb-6">{text}</p>
              ))}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 border border-taka-gray-light">
                    <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.number}</p>
                    <p className="text-taka-gray text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-taka-gray-light flex items-center justify-center relative">
                <Image
                  src={imageUrl}
                  alt="Taka Inside - Logo de l'association"
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-taka-yellow rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-taka-red rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-12 text-center">Nos valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Authenticité", color: "text-taka-yellow", bg: "bg-taka-yellow/15", desc: "Nous valorisons les expressions culturelles authentiques du Bénin, sans compromis ni dilution." },
              { title: "Inclusion", color: "text-taka-green", bg: "bg-taka-green/15", desc: "Tous les talents sont les bienvenus, quels que soient leur parcours ou leur origine." },
              { title: "Impact", color: "text-taka-red", bg: "bg-taka-red/15", desc: "Chaque projet doit avoir un impact mesurable sur la communauté et la culture." },
            ].map((valeur) => (
              <div key={valeur.title} className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                <div className={`w-12 h-12 rounded-xl ${valeur.bg} flex items-center justify-center mb-4`}>
                  <span className={`${valeur.color} font-display font-bold text-xl`}>{valeur.title[0]}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{valeur.title}</h3>
                <p className="text-taka-gray text-sm">{valeur.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-taka-black text-white rounded-2xl p-8 md:p-12">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Soutenez-nous</h3>
              <p className="text-taka-gray mb-6">Votre don permet de financer nos projets culturels, d'accompagner les artistes et de promouvoir le Bénin.</p>
              <Link href="/faire-un-don" className="bg-taka-green text-white px-8 py-4 rounded-xl font-semibold text-center block hover:bg-opacity-90 transition-all">Je fais un don</Link>
            </div>
            <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-taka-black">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Rejoignez-nous</h3>
              <p className="text-taka-gray mb-6">Rejoignez notre communauté de passionnés et contribuez activement à la promotion de la culture béninoise.</p>
              <Link href="/devenir-benevole" className="bg-taka-yellow text-taka-black px-8 py-4 rounded-xl font-semibold text-center block border-2 border-taka-black hover:bg-opacity-90 transition-all">Devenir bénévole</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
