import SiteLayout from "@/components/layout/SiteLayout";
import { Metadata } from "next";
import { fetchPageContent, fetchSiteConfig, extractData } from "@/lib/api";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await fetchPageContent("contact");
  const data = extractData(raw);
  const seo = data?.seo as Record<string, unknown> | undefined;
  return {
    title: String(seo?.metaTitle || "Contact"),
    description: String(seo?.metaDescription || "Contactez Taka Inside."),
  };
}

export default async function ContactPage() {
  const [contentRaw, configRaw] = await Promise.all([
    fetchPageContent("contact"),
    fetchSiteConfig(),
  ]);
  const content = extractData(contentRaw);
  const config = extractData(configRaw);

  const title = (content?.title as string) || "Contact";
  const subtitle = (content?.subtitle as string) || "Une question ? Une proposition de collaboration ? Contactez-nous, nous répondons sous 48h.";
  const formConfig = (content?.formConfig as Record<string, unknown>) || {};
  const formTitle = (formConfig?.formTitle as string) || "Envoyez-nous un message";
  const successMessage = (formConfig?.successMessage as string) || "Message envoyé ! Nous vous repondrons sous 48h.";
  const subjects = Array.isArray(formConfig?.subjects)
    ? (formConfig.subjects as string[])
    : ["Question generale", "Partenariat", "Artiste / Label", "Presse", "Projet", "Benevolat", "Autre"];
  const submitButton = (formConfig?.submitButton as string) || "Envoyer le message";

  const email = (config?.contactEmail as string) || "kwabo@takainside.org";
  const whatsapp = (config?.whatsappNumber as string) || "";
  const address = (config?.contactAddress as string) || "";
  const socialLinks = Array.isArray(config?.socialLinks) ? (config.socialLinks as Record<string, unknown>[]) : [];

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-4 max-w-xl text-taka-gray">{subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light">
              <h2 className="font-display text-2xl font-bold mb-6">{formTitle}</h2>

              <ContactForm subjects={subjects} submitButton={submitButton} destinationEmail={email} successMessage={successMessage} />
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Nos coordonnées</h2>

              <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                <div className="flex items-center gap-2 text-taka-gray text-sm font-medium mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span>Email</span>
                </div>
                <a href={`mailto:${email}`} className="font-semibold text-lg hover:text-taka-yellow transition-colors">{email}</a>
              </div>

              {whatsapp && (
                <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <div className="flex items-center gap-2 text-taka-gray text-sm font-medium mb-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </div>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:text-taka-yellow transition-colors">{whatsapp}</a>
                </div>
              )}

              {address && (
                <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <div className="flex items-center gap-2 text-taka-gray text-sm font-medium mb-1">
                    <svg className="w-5 h-5 text-taka-red" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.405-4.47 3.405-7.14a8.25 8.25 0 00-16.5 0c0 2.67 1.461 5.15 3.405 7.14a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                    </svg>
                    <span>Adresse</span>
                  </div>
                  <p className="font-semibold text-lg">{address}</p>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <p className="text-taka-gray text-sm font-medium mb-3">📱 Réseaux sociaux</p>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((s) => {
                      const platform = String(s.platform || "").toLowerCase();
                      const url = String(s.url || "");
                      if (!url) return null;
                      return (
                        <a key={platform + url} href={url} target="_blank" rel="noopener noreferrer" className="text-taka-gray hover:text-taka-yellow transition-colors">
                          <SocialIcon platform={platform} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const size = "w-6 h-6";
  const icons: Record<string, React.JSX.Element> = {
    facebook: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    instagram: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    twitter: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    x: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  };

  return icons[platform] || (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
