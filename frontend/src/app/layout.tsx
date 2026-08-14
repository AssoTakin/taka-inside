import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { fetchSiteConfig, extractData } from "@/lib/api";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const configRaw = await fetchSiteConfig();
  const config = extractData(configRaw) || {};
  const seo = config.defaultSeo as Record<string, unknown> | undefined;
  const title = String(seo?.metaTitle || config.siteName || "Taka Inside");
  const description = String(seo?.metaDescription || config.tagline || "L'Art au Service de l'Humain");

  return {
    title: { template: `%s | ${title}`, default: `${title} — ${description}` },
    description,
    icons: {
      icon: [
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/icon.png"],
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "https://takainside.org",
      siteName: title,
    },
    twitter: { card: "summary_large_image", site: "@takainsideasso" },
    robots: { index: true, follow: true },
  };
}

import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body bg-taka-cream text-taka-black antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
