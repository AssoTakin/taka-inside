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
  const data = await fetchStrapiList("projets?fields[0]=slug");
  if (!data) return [];
  return data.map((p) => ({ slug: String(p.slug || "").toLowerCase() })).filter((p) => p.slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const p = await fetchStrapiSingle(`projets?filters[slug][$eqi]=${normalizedSlug}&populate=*`);
  if (!p) return { title: "Projet | Taka Inside" };
  return {
    title: `${p.titre} | Taka Inside`,
    description: String(p.description || "").substring(0, 160),
  };
}

function statutLabel(s: string) {
  switch (s) {
    case "en_cours": return "En cours";
    case "a_venir": return "À venir";
    case "urgent": return "Urgent";
    case "termine": return "Terminé";
    default: return s;
  }
}

function statutColor(s: string) {
  switch (s) {
    case "en_cours": return "bg-taka-green";
    case "a_venir": return "bg-taka-yellow text-taka-black";
    case "urgent": return "bg-taka-red";
    case "termine": return "bg-taka-gray text-white";
    default: return "bg-taka-gray";
  }
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const projet = await fetchStrapiSingle(`projets?filters[slug][$eqi]=${normalizedSlug}&populate=*`);

  if (!projet) notFound();

  const coverUrl = getImageUrl(projet.image_couverture as { url: string } | null);
  const description = String(projet.description || "");
  const objectifs = String(projet.objectifs || "");
  const titre = String(projet.titre || "");
  const localisation = String(projet.localisation || "");
  const statut = String(projet.statut || "");
  const tags = String(projet.tags || "");
  const partenaires = String(projet.partenaires || "");
  const dateDebut = String(projet.date_debut || "");
  const dateFin = String(projet.date_fin || "");
  const ctaDon = Boolean(projet.cta_don);
  const ctaBenevole = Boolean(projet.cta_benevole);

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/projets" className="text-taka-gray hover:text-white text-sm mb-4 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Retour aux projets
            </Link>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`${statutColor(statut)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {statutLabel(statut)}
            </span>
            {tags && (
              <span className="text-taka-gray text-xs">{tags}</span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{titre}</h1>
          {localisation && (
            <p className="text-taka-gray mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              {localisation}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              {coverUrl ? (
                <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl relative">
                  <Image src={coverUrl} alt={titre} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-2xl bg-taka-gray-light flex items-center justify-center">
                  <span className="text-taka-gray">Image du projet</span>
                </div>
              )}

              <div className="mt-8 grid gap-4">
                {ctaDon && (
                  <Link href="/faire-un-don" className="bg-taka-yellow text-taka-black px-6 py-3 rounded-xl font-semibold text-center hover:bg-opacity-90 transition-all">
                    Soutenir ce projet
                  </Link>
                )}
                {ctaBenevole && (
                  <Link href="/devenir-benevole" className="border-2 border-taka-black text-taka-black px-6 py-3 rounded-xl font-semibold text-center hover:bg-taka-black hover:text-white transition-all">
                    Devenir bénévole
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {description && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Description</h2>
                  <div className="text-taka-gray leading-relaxed whitespace-pre-line">{description}</div>
                </div>
              )}
              {objectifs && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Objectifs</h2>
                  <div className="text-taka-gray leading-relaxed whitespace-pre-line">{objectifs}</div>
                </div>
              )}
              {partenaires && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Partenaires</h2>
                  <p className="text-taka-gray">{partenaires}</p>
                </div>
              )}
              {(dateDebut || dateFin) && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Dates</h2>
                  <p className="text-taka-gray">
                    {dateDebut && `Début : ${dateDebut}`}
                    {dateDebut && dateFin && " · "}
                    {dateFin && `Fin : ${dateFin}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
