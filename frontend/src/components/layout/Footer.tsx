import Link from 'next/link';
import Image from 'next/image';
import { fetchSiteConfig, fetchMenuItems, extractData, extractImage } from '@/lib/api';

export default async function Footer() {
  const configRaw = await fetchSiteConfig();
  const config = extractData(configRaw);

  const navItemsRaw = await fetchMenuItems('footer');
  const navItems = (navItemsRaw || []).map(extractData).filter(Boolean) as Record<string, unknown>[];

  const strapiLogo = config ? extractImage(config.logo) : null;
  // Utiliser le logo Strapi s'il est défini, sinon fallback local
  const logo = strapiLogo?.url ? { url: strapiLogo.url, alt: strapiLogo.alt || 'Taka Inside' } : { url: '/images/logo-taka-inside.jpg', alt: 'Taka Inside' };
  const siteName = (config?.siteName as string) || 'Taka Inside';
  const tagline = (config?.tagline as string) || "Carrefour culturel et label musical associatif. L'art au service de l'humain.";
  // Nettoie le copyrightText pour retirer l'année déjà présente (évite le doublon 2026 2025)
  const rawCopyright = (config?.copyrightText as string) || `${siteName}. Tous droits réservés.`;
  const copyright = rawCopyright.replace(/^\d{4}\s*/, '').trim();
  const address = (config?.contactAddress as string) || '';
  const email = (config?.contactEmail as string) || '';
  const phone = (config?.contactPhone as string) || '';
  const whatsapp = (config?.whatsappNumber as string) || '';

  // Réseaux sociaux — depuis config.socialLinks (Strapi v5)
  const rawSocials = config?.socialLinks as unknown[] | undefined;
  const socialLinks: Record<string, unknown>[] = [];
  if (Array.isArray(rawSocials)) {
    rawSocials.forEach((s) => {
      if (s && typeof s === 'object') {
        const item = s as Record<string, unknown>;
        if (item.url && item.platform) {
          socialLinks.push({
            platform: item.platform,
            url: item.url,
            label: item.platform,
          });
        }
      }
    });
  }

  // Fallback: si aucun socialLinks, chercher dans menu-items footer avec isExternal
  if (socialLinks.length === 0) {
    navItems.forEach((item) => {
      if (item.isExternal && item.link) {
        const platform = detectPlatform(item.link as string);
        if (platform) {
          socialLinks.push({ platform, url: item.link, label: item.label });
        }
      }
    });
  }

  return (
    <footer className="bg-taka-black text-white">
      <div className="rasta-line h-1"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo + description + réseaux sociaux */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {logo.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || siteName}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                  unoptimized={logo.url.startsWith('http')}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-taka-yellow/20 flex items-center justify-center font-bold text-taka-yellow">{siteName.charAt(0)}</div>
              )}
              <span className="font-display font-bold text-xl">{siteName}</span>
            </div>
            <p className="text-taka-gray text-sm">{tagline}</p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.platform as string}
                    href={(s.url as string) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-taka-gray hover:bg-taka-yellow hover:text-taka-black transition-colors"
                    aria-label={s.label as string}
                  >
                    <SocialIcon platform={s.platform as string} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-taka-gray">
              {navItems.filter(item => !item.isExternal).map((link) => (
                <li key={(link.id as string) || (link.link as string)}>
                  <Link href={(link.link as string) || '/'} className="hover:text-taka-yellow transition-colors">
                    {(link.label as string) || 'Lien'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Informations</h4>
            <ul className="space-y-2 text-sm text-taka-gray">
              <li><Link href="/mentions-legales" className="hover:text-taka-yellow transition-colors">Mentions Légales</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-taka-yellow transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/conditions-generales-vente" className="hover:text-taka-yellow transition-colors">CGV</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm text-taka-gray">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-taka-yellow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email || 'kwabo@takainside.org'}`} className="hover:text-taka-yellow transition-colors">{email || 'kwabo@takainside.org'}</a>
              </li>
              {phone && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-taka-yellow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phone}`} className="hover:text-taka-yellow transition-colors">{phone}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-taka-yellow shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{address}</span>
                </li>
              )}
              {whatsapp && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-taka-yellow shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-taka-yellow transition-colors">WhatsApp</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-taka-gray">© {new Date().getFullYear()} {copyright}</p>
          <div className="flex gap-4 text-sm text-taka-gray">
            <Link href="/" className="hover:text-taka-yellow transition-colors">{siteName}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function detectPlatform(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes('facebook')) return 'facebook';
  if (lower.includes('instagram')) return 'instagram';
  if (lower.includes('youtube')) return 'youtube';
  if (lower.includes('tiktok')) return 'tiktok';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('spotify')) return 'spotify';
  if (lower.includes('linkedin')) return 'linkedin';
  return null;
}

function SocialIcon({ platform }: { platform: string }) {
  const size = "w-4 h-4";
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
    youtube: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg className={size} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  };

  return icons[platform] || (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
