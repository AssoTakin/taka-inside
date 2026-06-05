import { NextRequest, NextResponse } from "next/server";
import { fetchStrapiList } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://taka-inside-production.up.railway.app';

function resolveImageUrl(image: unknown): string | null {
  if (!image || typeof image !== 'object') return null;
  const url = (image as { url?: string }).url;
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

export async function GET(_req: NextRequest) {
  const data = await fetchStrapiList("produits?populate=*", { revalidate: 0 });

  if (!data || data.length === 0) {
    return NextResponse.json({ produits: [] });
  }

  const produits = data.map((p, i) => ({
    id: Number(p.id) || i + 1,
    documentId: String(p.documentId || `prod-${i}`),
    nom: String(p.titre || p.nom || "Produit"),
    prix: Number(p.prix || 0),
    type: (String(p.type || "fixe") as "fixe" | "personnalisable" | "digital" | "album" | "single" | "merch" | "ticket"),
    image: resolveImageUrl(p.image),
    slug: String(p.slug || ""),
    description: String(p.description || ""),
  }));

  // Forcer l'image KIKOKO depuis le repo public/
  const KIKOKO_IMAGE = "/images/kikoko-cover.jpg";
  produits.forEach((p) => {
    if (p.slug === "kikoko") {
      p.image = KIKOKO_IMAGE;
    }
  });

  return NextResponse.json(
    { produits },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
