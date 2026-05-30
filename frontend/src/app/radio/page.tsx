import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Made In Bénin Radio",
  description: "La web radio de Taka Inside - musique béninoise et africaine en direct.",
};

export default function RadioPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-green/15 text-taka-green text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-taka-green animate-pulse"></span>
            EN DIRECT
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold">Made In <span className="text-taka-yellow">Bénin</span> Radio</h1>
          <p className="mt-4 max-w-2xl mx-auto text-taka-gray">
            La web radio de Taka Inside. Musique béninoise, africaine et world music. Découvrez les talents du Bénin et d'ailleurs, 24h/24.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-taka-gray-light text-center">
            <div className="w-24 h-24 rounded-full bg-taka-gray-light mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-taka-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">Écoutez la radio</h2>
            <p className="text-taka-gray mb-8">Le lecteur radio sera bientôt intégré. En attendant, suivez-nous sur les réseaux sociaux pour les dernières actualités musicales.</p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Spotify", href: "#" },
                { label: "Apple Music", href: "#" },
                { label: "YouTube Music", href: "#" },
                { label: "SoundCloud", href: "#" },
              ].map((platform) => (
                <a
                  key={platform.label}
                  href={platform.href}
                  className="px-6 py-3 rounded-xl border border-taka-gray-light font-medium hover:border-taka-green hover:text-taka-green transition-all"
                >
                  {platform.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
