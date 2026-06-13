import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
}
