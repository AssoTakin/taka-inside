import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir Bénévole",
  description: "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.",
};

export default function BenevolePage() {
  return (
    <SiteLayout>
      <section className="bg-taka-green text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold">Devenir <span className="text-taka-yellow">Bénévole</span></h1>
          <p className="mt-4 max-w-xl opacity-90">Rejoignez notre communauté de passionnés et contribuez activement à la promotion de la culture béninoise.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="+229 ..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="Cotonou, Porto-Novo..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Compétences *</label>
              <div className="flex flex-wrap gap-2">
                {["Communication", "Événementiel", "Technique", "Musique", "Design", "Traduction", "Autre"].map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    className="px-4 py-2 rounded-lg border border-taka-gray-light text-sm hover:border-taka-green hover:text-taka-green transition-all"
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Disponibilité *</label>
              <select required className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all bg-white">
                <option value="">Sélectionnez...</option>
                <option>Week-ends</option>
                <option>Soirs en semaine</option>
                <option>Temps plein</option>
                <option>Selon les projets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Motivation *</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all resize-none"
                placeholder="Pourquoi souhaitez-vous rejoindre Taka Inside ?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Envoyer ma candidature
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
