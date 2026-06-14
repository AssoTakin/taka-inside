"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/api";

interface Projet {
  [key: string]: unknown;
  titre?: string;
  slug?: string;
  statut?: string;
  categorie?: string;
  description?: string;
  image_couverture?: { url: string } | null;
  cta_don?: boolean;
  cta_benevole?: boolean;
}

const filters = [
  { id: "all", label: "Tous les projets" },
  { id: "en_cours", label: "En cours" },
  { id: "a_venir", label: "À venir" },
  { id: "termine", label: "Terminés" },
  { id: "urgent", label: "Urgents" },
];

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

export default function ProjectGrid({ projets }: { projets: Projet[] }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? projets
    : projets.filter((p) => String(p.statut || "") === activeFilter);

  return (
    <>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Projets culturels, musicaux et sociaux
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Nos <span className="text-taka-yellow">Projets</span></h1>
            <p className="text-taka-gray mt-4 max-w-xl">Découvrez les initiatives que nous portons pour promouvoir la culture béninoise et soutenir la communauté.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  activeFilter === f.id
                    ? "border-taka-yellow text-taka-yellow bg-taka-yellow/10"
                    : "border-white/20 hover:border-taka-yellow hover:text-taka-yellow"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <h2 className="font-display text-2xl font-bold mb-4">Aucun projet dans cette catégorie</h2>
              <p className="text-taka-gray">Revenez bientôt pour découvrir nos nouvelles initiatives.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((projet, i) => {
              const titre = String(projet.titre || "");
              const slug = String(projet.slug || `projet-${i}`);
              const statut = String(projet.statut || "");
              const categorie = String(projet.categorie || "");
              const description = String(projet.description || "");
              const coverUrl =
                slug === "made-in-benin-radio"
                  ? "/images/madeinbeninradio-logo-new.jpg"
                  : getImageUrl(projet.image_couverture || null) || "/images/logo-taka-inside.jpg";
              const ctaDon = Boolean(projet.cta_don) && statut !== "termine";
              const ctaBenevole = Boolean(projet.cta_benevole) && statut !== "termine";

              return (
                <div key={slug} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-taka-gray-light group flex flex-col">
                  <div className="aspect-[16/10] relative">
                    {coverUrl ? (
                      <Image src={coverUrl} alt={titre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-taka-gray-light flex items-center justify-center">
                        <span className="text-taka-gray text-sm">Image du projet</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${statutColor(statut)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{statutLabel(statut)}</span>
                      {categorie && <span className="text-taka-gray text-xs">{categorie}</span>}
                    </div>
                    <Link href={`/projets/${slug}`} className="font-display text-xl font-bold mb-2 hover:text-taka-yellow transition-colors">
                      {titre}
                    </Link>
                    <p className="text-taka-gray text-sm flex-1">{description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/projets/${slug}`} className="text-sm font-medium text-taka-black hover:text-taka-yellow transition-colors">
                        En savoir plus →
                      </Link>
                      {ctaDon && (
                        <a href="/faire-un-don" className="text-sm font-medium text-taka-red hover:text-taka-red/80 transition-colors">
                          Soutenir 💛
                        </a>
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
    </>
  );
}
