import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Made In Bénin Radio",
  description: "La web radio de Taka Inside - musique béninoise et africaine en direct 24h/24.",
};

export default function RadioPage() {
  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-red/15 text-taka-red text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-taka-red animate-pulse"></span>
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
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-taka-red/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-taka-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Écoutez en direct</h2>
                  <p className="text-taka-gray text-sm">Flux audio continu - Musique béninoise &amp; africaine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-taka-red animate-pulse"></span>
                <span className="text-sm font-medium text-taka-red">LIVE</span>
              </div>
            </div>

            {/* Audio player placeholder - remplacer par URL du stream réel */}
            <div className="bg-taka-black rounded-xl p-6">
              <div className="flex items-center gap-4">
                <button
                  className="w-14 h-14 rounded-full bg-taka-yellow flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Lecture/Pause"
                >
                  <svg className="w-6 h-6 text-taka-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div className="flex-1">
                  <p className="text-white font-medium">Now Playing</p>
                  <p className="text-taka-gray text-sm">Made In Bénin Radio - Sélection automatique</p>
                </div>
                <div className="hidden sm:block">
                  <audio controls className="w-48" aria-label="Lecteur radio">
                    <source src="https://stream.zeno.fm/takainside" type="audio/mpeg" />
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              </div>
            </div>
          </div>

          {/* Playlists / Plateformes */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light">
            <h2 className="font-display text-xl font-bold mb-6">Disponible sur</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Spotify", url: "https://open.spotify.com", color: "bg-green-600" },
                { name: "Apple Music", url: "https://music.apple.com", color: "bg-red-500" },
                { name: "YouTube Music", url: "https://music.youtube.com", color: "bg-red-600" },
                { name: "SoundCloud", url: "https://soundcloud.com", color: "bg-orange-500" },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-taka-gray-light hover:border-taka-yellow hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    {platform.name[0]}
                  </div>
                  <span className="font-semibold">{platform.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
