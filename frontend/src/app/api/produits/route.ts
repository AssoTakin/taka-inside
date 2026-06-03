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
    // Mock fallback
    return NextResponse.json({
      produits: [
        { id: 1, documentId: "cd-taka-v1", nom: "CD - Taka Volume 1", prix: 5000, devise: "FCFA", type: "fixe", image: null },
        { id: 2, documentId: "tshirt-taka", nom: "T-shirt Taka Inside", prix: 7500, devise: "FCFA", type: "fixe", image: null },
        { id: 3, documentId: "album-tomiwa", nom: "Album Digital - Tomiwa Kéfil", prix: 2500, devise: "FCFA", type: "fixe", image: null },
        { id: 4, documentId: "tshirt-custom", nom: "T-shirt Personnalisé", prix: 8000, devise: "FCFA", type: "personnalisable", image: null },
        { id: 5, documentId: "cd-ami", nom: "CD - Ami Sêdjro", prix: 4500, devise: "FCFA", type: "fixe", image: null },
        { id: 6, documentId: "sac-wax", nom: "Sac en wax Taka", prix: 12000, devise: "FCFA", type: "fixe", image: null },
        { id: 7, documentId: "bracelet", nom: "Bracelet artisanal", prix: 2000, devise: "FCFA", type: "fixe", image: null },
        { id: 8, documentId: "poster", nom: "Poster A3 artiste", prix: 3500, devise: "FCFA", type: "fixe", image: null },
      ]
    });
  }

  const produits = data.map((p, i) => ({
    id: Number(p.id) || i + 1,
    documentId: String(p.documentId || `prod-${i}`),
    nom: String(p.titre || p.nom || "Produit"),
    prix: Number(p.prix || 0),
    devise: (String(p.devise || "EUR") as "EUR" | "FCFA"),
    type: (String(p.type || "fixe") as "fixe" | "personnalisable" | "digital" | "album" | "single" | "merch" | "ticket"),
    image: resolveImageUrl(p.image),
    slug: String(p.slug || ""),
    description: String(p.description || ""),
  }));

  // Forcer l'image KIKOKO depuis le repo public/ (R2 bucket est privé)
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
