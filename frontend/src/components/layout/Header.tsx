import Link from 'next/link';
import { fetchSiteConfig, fetchMenuItems, extractData, extractImage } from '@/lib/api';
import { CartButton, MobileMenu } from './HeaderClient';

export default async function Header() {
  const configRaw = await fetchSiteConfig();
  const config = extractData(configRaw);
  const menuItemsRaw = await fetchMenuItems('header');
  const menuItems = (menuItemsRaw || []).map(extractData).filter(Boolean) as Record<string, unknown>[];

  const strapiLogo = config ? extractImage(config.logo) : null;
  // Forcer le logo local si l'URL Strapi est invalide ou manquante
  const isValidStrapiUrl = strapiLogo?.url && !strapiLogo.url.includes('7671f0d3ab');
  const logo = isValidStrapiUrl ? strapiLogo : { url: '/images/logo-taka-inside.jpg', alt: 'Taka Inside' };
  const siteName = (config?.siteName as string) || 'Taka Inside';

  return (
    <header className="sticky top-0 z-50 bg-taka-black text-white">
      <div className="rasta-line h-1"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logo.url ? (
              <img src={logo.url} alt={logo.alt || siteName} width={48} height={48} className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-taka-yellow/20 flex items-center justify-center font-bold text-taka-yellow">
                {siteName.charAt(0)}
              </div>
            )}
            <span className="font-display font-bold text-xl tracking-tight">{siteName}</span>
          </Link>

          {/* Desktop Nav — from Strapi */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.id as string}
                href={(item.link as string) || '/'}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className="text-sm font-medium text-taka-gray hover:text-white transition-colors"
              >
                {(item.label as string) || 'Lien'}
              </Link>
            ))}

            {/* Don CTA — server rendered, simple link */}
            <DonCta />

            {/* Cart — client island */}
            <CartButton />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton />
            <MobileMenu menuItems={menuItems} siteName={siteName} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* Don CTA — fetched server-side from global-cta */
async function DonCta() {
  const { fetchGlobalCta, extractData } = await import('@/lib/api');
  const ctaRaw = await fetchGlobalCta('header-don');
  const cta = extractData(ctaRaw);
  if (!cta || cta.isVisible === false) return null;

  return (
    <Link
      href={(cta.link as string) || '/faire-un-don'}
      className="text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
    >
      {(cta.label as string) || 'Faire un Don'}
    </Link>
  );
}
