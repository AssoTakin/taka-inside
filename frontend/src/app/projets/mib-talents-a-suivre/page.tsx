import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "MIB Talents À Suivre | Taka Inside",
  description: "Programme pluriannuel d'accompagnement et de rayonnement de 2 artistes béninois de musique urbaine émergents. #MibTalentsASuivre • Made In Bénin Radio • 120% Bénin.",
};

const phases = [
  {
    step: "01",
    titre: "Sélection",
    desc: "Appel à candidatures public, jury d'experts, sélection rigoureuse de 2 talents sur critères de potentiel, authenticité et engagement.",
  },
  {
    step: "02",
    titre: "Direction Artistique",
    desc: "24 mois d'accompagnement professionnel : coaching régulier, construction d'identité de scène, plan artistique individuel sur-mesure.",
  },
  {
    step: "03",
    titre: "Production",
    desc: "EP professionnel masterisé, distribué mondialement sur toutes les plateformes. Clip vidéo de qualité internationale.",
  },
  {
    step: "04",
    titre: "Résidence France",
    desc: "Résidence artistique obligatoire de 2 mois minimum en France. Constitution d'un réseau professionnel européen.",
  },
  {
    step: "05",
    titre: "Tournée & Diaspora",
    desc: "Minimum 3 dates nationales au Bénin + 1 concert dans la diaspora. Rayonnement sur la scène internationale.",
  },
  {
    step: "06",
    titre: "Autonomie",
    desc: "Structure créée, catalogue maîtrisé, artiste prêt à approcher l'industrie en toute autonomie à l'issue du programme.",
  },
];

const valeurs = [
  { titre: "Excellence", desc: "Chaque action est menée avec des professionnels du secteur. Seul le meilleur représente le Bénin." },
  { titre: "Authenticité", desc: "Les artistes restent ancrés dans leur identité béninoise, même dans leur exploration de la musique urbaine." },
  { titre: "Solidarité", desc: "MIB Radio, la diaspora, les institutions et les fans, tous mobilisés derrière les talents." },
  { titre: "Mesurabilité", desc: "Chaque étape génère des livrables concrets, publics et évaluables." },
  { titre: "Durabilité", desc: "Un programme institutionnel pérenne dont le modèle économique évolue vers l'autonomie financière." },
];

export default function MibTalentsPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                Programme Phare
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                MIB <span className="text-taka-red">Talents</span><br />
                <span className="text-taka-yellow">À Suivre</span>
              </h1>
              <p className="text-taka-gray mt-6 text-lg leading-relaxed max-w-lg">
                Programme pluriannuel d'accompagnement et de rayonnement de <strong className="text-white">2 artistes béninois</strong> de musique urbaine émergents. Une certification de qualité, un ambassadeur de la culture béninoise dans le monde.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/faire-un-don" className="bg-taka-yellow text-taka-black px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all inline-flex items-center gap-2">
                  Soutenir le programme
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
                <a href="#phases" className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:border-taka-yellow hover:text-taka-yellow transition-all">
                  Découvrir le parcours
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-taka-red shadow-2xl shadow-taka-red/20">
                <Image
                  src="/images/mib-talents-a-suivre-logo.png"
                  alt="MIB Talents À Suivre — Programme d'accompagnement artistique"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-taka-yellow text-taka-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                120% Bénin
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-taka-cream py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-taka-black mb-6">
            De la <span className="text-taka-red">visibilité</span> à l'<span className="text-taka-green">action</span>
          </h2>
          <p className="text-taka-gray text-lg leading-relaxed max-w-3xl mx-auto">
            La scène musicale urbaine béninoise regorge de talents. Pourtant, la majorité des artistes émergents se heurtent à des obstacles structurels : absence d'accompagnement professionnel, coûts de production élevés, faible exposition médiatique, et peu de liens avec la diaspora.
          </p>
          <p className="text-taka-black mt-6 text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            MIB Talents À Suivre est la réponse opérationnelle : structurée, ambitieuse, mesurable et pérenne. Un parcours d'excellence qui propulse des artistes authentiques sur la scène nationale et internationale.
          </p>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-taka-yellow py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-taka-black">Impact sur les talents émergents</h2>
            <p className="text-taka-black/70 mt-3 max-w-xl mx-auto">Un programme conçu pour transformer le potentiel brut en carrière artistique durable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { chiffre: "2", label: "Artistes accompagnés sur 24 mois", detail: "Sélection rigoureuse, potentiel exceptionnel et authenticité culturelle" },
              { chiffre: "24", label: "Mois de direction artistique", detail: "Coaching régulier, identité de scène, plan artistique individuel" },
              { chiffre: "∞", label: "Portée internationale", detail: "Résidence en France, distribution mondiale, concert diaspora" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-8 text-center border-2 border-taka-black">
                <div className="font-display text-5xl font-bold text-taka-red mb-3">{item.chiffre}</div>
                <h3 className="font-semibold text-taka-black text-lg mb-2">{item.label}</h3>
                <p className="text-taka-gray text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section id="phases" className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Le parcours en <span className="text-taka-yellow">6 phases</span></h2>
            <p className="text-taka-gray mt-3">De la sélection à l'autonomie totale — une feuille de route claire et exigeante.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div key={phase.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-taka-yellow/50 transition-all group">
                <div className="text-taka-yellow font-display text-4xl font-bold mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  {phase.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{phase.titre}</h3>
                <p className="text-taka-gray text-sm leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="bg-taka-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-taka-black">Nos <span className="text-taka-green">valeurs</span> fondatrices</h2>
            <p className="text-taka-gray mt-3">Les piliers qui guident chaque décision du programme.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valeurs.map((v) => (
              <div key={v.titre} className="bg-white rounded-2xl p-6 border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all">
                <h3 className="font-display text-lg font-bold text-taka-black mb-2">{v.titre}</h3>
                <p className="text-taka-gray text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-taka-red py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Propulsons ensemble la prochaine génération
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            MIB Talents À Suivre est plus qu'un programme : c'est un mouvement. Rejoignez-nous pour identifier, accompagner et propulser les talents qui porteront le Bénin sur la scène mondiale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/faire-un-don" className="bg-white text-taka-red px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
              Soutenir MIB Talents À Suivre
            </Link>
            <Link href="/devenir-benevole" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-taka-red transition-all inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Devenir bénévole
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
