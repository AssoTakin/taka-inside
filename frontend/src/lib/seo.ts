import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: { template: "%s | Taka Inside", default: "Taka Inside — L'Art au Service de l'Humain" },
  description: "Association culturelle et label musical basée au Bénin. Projets innovants, brassage culturel, Made In Bénin Radio.",
  keywords: ["Taka Inside", "Bénin", "culture", "musique", "association", "label musical", "art", "brassage culturel"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://takainside.vercel.app",
    siteName: "Taka Inside",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Taka Inside" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@takainsideasso",
    creator: "@takainsideasso",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://takainside.vercel.app" },
  authors: [{ name: "Taka Inside" }],
  generator: "Next.js",
  applicationName: "Taka Inside",
  referrer: "origin-when-cross-origin",
  creator: "Taka Inside",
  publisher: "Taka Inside",
};

export function generatePageMetadata(
  title: string,
  description?: string,
  pathname?: string
): Metadata {
  return {
    title,
    description: description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      url: `https://takainside.vercel.app${pathname || ""}`,
      title: `${title} | Taka Inside`,
      description: description || (typeof defaultMetadata.description === "string" ? defaultMetadata.description : undefined),
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | Taka Inside`,
      description: description || (typeof defaultMetadata.description === "string" ? defaultMetadata.description : undefined),
    },
    alternates: { canonical: `https://takainside.vercel.app${pathname || ""}` },
  };
}
