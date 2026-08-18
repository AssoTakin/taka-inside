import { MetadataRoute } from "next";
import { fetchStrapiList } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://takainside.org";

  const routes = [
    { path: "", priority: 1.0 },
    { path: "/projets", priority: 0.8 },
    { path: "/label-musical", priority: 0.8 },
    { path: "/boutique", priority: 0.9 },
    { path: "/devenir-benevole", priority: 0.7 },
    { path: "/faire-un-don", priority: 0.9 },
    { path: "/contact", priority: 0.6 },
    { path: "/radio", priority: 0.8 },
    { path: "/mentions-legales", priority: 0.3 },
    { path: "/politique-confidentialite", priority: 0.3 },
    { path: "/conditions-generales-vente", priority: 0.3 },
  ];

  const artistesData = await fetchStrapiList("artistes?fields[0]=slug&fields[1]=documentId&fields[2]=updatedAt");
  const artistes = artistesData && Array.isArray(artistesData) ? artistesData : [];
  const artisteRoutes = artistes
    .filter((a) => a.slug || a.documentId)
    .map((a) => ({
      url: `${baseUrl}/label-musical/${a.slug || a.documentId}`,
      lastModified: a.updatedAt ? new Date(String(a.updatedAt)) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  return [...staticRoutes, ...artisteRoutes];
}
