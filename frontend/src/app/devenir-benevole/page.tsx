import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";
import { fetchPageContent, extractData } from "@/lib/api";

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b.type === "paragraph")
    .map((b: any) => b.children?.map((c: any) => c.text).join(""))
    .filter(Boolean)
    .join("\n");
}

export async function generateMetadata(): Promise<Metadata> {
  const raw = await fetchPageContent("devenir-benevole");
  const data = extractData(raw);
  const seo = data?.seo as Record<string, unknown> | undefined;
  return {
    title: String(seo?.metaTitle || "Devenir Bénévole"),
    description: String(seo?.metaDescription || "Rejoignez l'équipe Taka Inside."),
  };
}

export default async function BenevolePage() {
  const raw = await fetchPageContent("devenir-benevole");
  const content = extractData(raw);

  const title = (content?.title as string) || "Devenir Bénévole";
  const subtitle = (content?.subtitle as string) || "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.";
  const body = blocksToText(content?.content);
  const formConfig = (content?.formConfig as Record<string, unknown>) || {};
  const skills = Array.isArray(formConfig?.skills)
    ? (formConfig.skills as string[])
    : ["Communication", "Événementiel", "Technique", "Musique", "Design", "Traduction", "Autre"];
  const availabilities = Array.isArray(formConfig?.availabilities)
    ? (formConfig.availabilities as string[])
    : ["Week-ends", "Soirs en semaine", "Temps plein", "Selon les projets"];
  const fields = (formConfig?.fields as Record<string, string>) || {};
  const submitButton = (formConfig?.submitButton as string) || "Envoyer ma candidature";

  return (
    <SiteLayout>
      <section className="bg-taka-green text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-4 max-w-xl opacity-90">{subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {body && <p className="text-taka-gray text-lg mb-8">{body}</p>}

          <form className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">{fields.lastName || "Nom"} *</label>
                <input type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder={fields.lastName || "Votre nom"} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{fields.firstName || "Prénom"} *</label>
                <input type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder={fields.firstName || "Votre prénom"} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">{fields.email || "Email"} *</label>
              <input type="email" required
                className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                placeholder="votre@email.com" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">{fields.phone || "Téléphone"}</label>
                <input type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="+229 ..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{fields.city || "Ville"} *</label>
                <input type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all"
                  placeholder="Cotonou, Porto-Novo..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Compétences *</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((comp) => (
                  <button key={comp} type="button"
                    className="px-4 py-2 rounded-lg border border-taka-gray-light text-sm hover:border-taka-green hover:text-taka-green transition-all">
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Disponibilité *</label>
              <select required
                className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all bg-white">
                <option value="">Sélectionnez...</option>
                {availabilities.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">{fields.motivation || "Motivation"} *</label>
              <textarea required rows={4}
                className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all resize-none"
                placeholder={fields.motivation || "Pourquoi souhaitez-vous rejoindre Taka Inside ?"}></textarea>
            </div>

            <button type="submit" disabled
              className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              {submitButton}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
