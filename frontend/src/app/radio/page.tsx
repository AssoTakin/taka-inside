import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Made In Bénin Radio",
  description: "LA Radio des Béninois. Web radio 100% culture béninoise, 24H/24 et 7J/7. #MibTalentASuivre, art, musique, podcasts, live et bien plus.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://frontend-mu-one-82.vercel.app/radio",
    siteName: "Made In Bénin Radio",
  },
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/madeinbeninradio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/madeinbeninradio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/madeinbeninradio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@madeinbeninradio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.37-.01-.74-.01-1.11h4.03c.01 1.23.22 2.46.89 3.53.67 1.01 1.78 1.69 2.98 1.78 1.18.09 2.41-.33 3.18-1.28.63-.82.89-1.88.86-2.91-.02-2.57.01-5.14-.02-7.71-1.67 1.02-3.63 1.42-5.57 1.33V5.69c2.02.01 3.94-.77 5.39-2.15.81-.78 1.45-1.73 1.81-2.79.36-.99.49-2.05.46-3.1-.01-.55-.01-1.1-.01-1.63z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/madeinbeninradio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function RadioPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-taka-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-taka-red/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo avec halo et rotation */}
            <div className="mb-8 flex justify-center relative">
              {/* Halo pulsant derrière le logo */}
              <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full bg-taka-yellow/20 animate-pulse-ring" />
              <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full bg-taka-red/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
              
              <div className="relative group">
                <Image
                  src="/images/madeinbeninradio-logo.png"
                  alt="Made In Bénin Radio"
                  width={140}
                  height={140}
                  className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg transition-transform duration-700 group-hover:animate-spin-slow"
                  priority
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-taka-red/20 border border-taka-red/30 text-taka-red text-sm font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-taka-red animate-pulse" />
                EN DIRECT
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-taka-yellow/20 border border-taka-yellow/30 text-taka-yellow text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24H/24 · 7J/7
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Made In <span className="text-taka-yellow">Bénin</span> Radio
            </h1>
            <p className="text-xl md:text-2xl text-taka-gray max-w-2xl mx-auto mb-4">
              <span className="text-white font-semibold">LA Radio des Béninois</span> — exclusivement dédiée à la culture béninoise.
            </p>
            <p className="text-taka-gray max-w-xl mx-auto">
              Art, musique béninoise d'hier, d'aujourd'hui et de demain. #MibTalentASuivre, émissions, podcasts, live et bien plus. Exclusivement culture béninoise.
            </p>
          </div>
        </div>
      </section>

      {/* Player + Écouter */}
      <section className="py-12 md:py-20 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-taka-gray-light shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-taka-red/15 flex items-center justify-center">
                  <svg className="w-7 h-7 text-taka-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl md:text-2xl font-bold">Écoutez en direct</h2>
                  <p className="text-taka-gray text-sm">24H/24 · 7J/7 · 100% culture béninoise</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-taka-red animate-pulse" />
                <span className="text-sm font-bold text-taka-red tracking-wider">LIVE</span>
              </div>
            </div>

            {/* Player CTA */}
            <div className="bg-taka-black rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-taka-yellow flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-taka-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-white font-semibold text-lg">Made In Bénin Radio</p>
                  <p className="text-taka-gray text-sm">Stream continu · 100% culture béninoise</p>
                </div>
                <a
                  href="https://www.madeinbeninradio.bj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-taka-yellow text-taka-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap animate-glow overflow-hidden"
                >
                  {/* Shimmer overlay */}
                  <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                  
                  {/* Égaliseur animé */}
                  <div className="flex items-end gap-[2px] h-4 mr-1">
                    <span className="w-[3px] bg-taka-black/70 rounded-full animate-equalizer" style={{ animationDelay: '0s' }} />
                    <span className="w-[3px] bg-taka-black/70 rounded-full animate-equalizer" style={{ animationDelay: '0.1s' }} />
                    <span className="w-[3px] bg-taka-black/70 rounded-full animate-equalizer" style={{ animationDelay: '0.2s' }} />
                    <span className="w-[3px] bg-taka-black/70 rounded-full animate-equalizer" style={{ animationDelay: '0.3s' }} />
                  </div>
                  
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="relative z-10">Écouter en direct</span>
                  
                  {/* Notes de musique flottantes */}
                  <span className="absolute -top-2 -right-2 text-xs animate-float-note" style={{ animationDelay: '0.5s' }}>🎵</span>
                  <span className="absolute -top-1 -right-4 text-[10px] animate-float-note" style={{ animationDelay: '1.2s' }}>🎶</span>
                </a>
              </div>
            </div>

            {/* Appli mobile */}
            <div className="bg-taka-yellow/10 rounded-2xl p-6 md:p-8 border border-taka-yellow/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold mb-2">Téléchargez l'application</h3>
                  <p className="text-taka-gray mb-4">
                    Écoutez Made In Bénin Radio partout avec notre application mobile. Disponible sur Android via le Play Store.
                  </p>
                  <a
                    href="https://bit.ly/4uvR1sY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-taka-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.303 2.303-8.633-8.635z"/>
                    </svg>
                    Disponible sur Google Play
                  </a>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-taka-yellow flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-taka-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="py-12 md:py-20 bg-taka-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Suivez Made In Bénin Radio
          </h2>
          <p className="text-taka-gray mb-10 max-w-xl mx-auto">
            Rejoignez la communauté sur tous les réseaux sociaux. Actualités, lives, coulisses et bien plus.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-taka-yellow hover:border-taka-yellow hover:text-taka-black transition-all"
              >
                <div className="text-taka-yellow group-hover:text-taka-black transition-colors">
                  {social.icon}
                </div>
                <span className="font-semibold text-sm">{social.name}</span>
              </a>
            ))}
          </div>

          {/* Lien site officiel */}
          <div className="mt-10">
            <a
              href="https://www.madeinbeninradio.bj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-taka-yellow hover:text-white transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Visiter le site officiel : www.madeinbeninradio.bj
            </a>
          </div>
        </div>
      </section>

      {/* À propos de la radio */}
      <section className="py-12 md:py-20 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-taka-red font-semibold text-sm uppercase tracking-wider mb-3">Le projet phare</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                100% <span className="text-taka-yellow">culture béninoise</span>
              </h2>
              <p className="text-taka-gray text-lg leading-relaxed mb-6">
                Made In Bénin Radio est LA web radio des Béninois. Lancée par Taka Inside, elle diffuse en continu 
                Art, musique béninoise d'hier, d'aujourd'hui et de demain, avec des émissions, des interviews et des podcasts
                exclusivement dédiés à la promotion de la culture béninoise.
              </p>
              <ul className="space-y-3 text-taka-gray">
                {[
                  "Musique béninoise 24H/24",
                  "Émissions culturelles & interviews",
                  "Podcasts exclusifs",
                  "Application mobile gratuite",
                  "Promotion des artistes locaux",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-taka-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-taka-black flex items-center justify-center p-8">
                <Image
                  src="/images/madeinbeninradio-logo.png"
                  alt="Made In Bénin Radio"
                  width={300}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-taka-red rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-taka-yellow rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
