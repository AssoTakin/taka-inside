import { notFound } from "next/navigation";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList } from "@/lib/api";
import { formatPrice } from "@/lib/price";
import AddToCartButton from "./AddToCartButton";

const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://taka-inside-production.up.railway.app";
const KIKOKO_FALLBACK_IMAGE = "/images/kikoko-cover.jpg";

interface Product {
  id: number;
  documentId: string;
  nom: string;
  prix: number;
  type: string;
  image: string | null;
  slug: string;
  description: string;
}

function resolveImageUrl(image: unknown): string | null {
  if (!image || typeof image !== "object") return null;
  
  const img = image as Record<string, unknown>;
  
  // Strapi v5 direct: image.url
  if (typeof img.url === "string") {
    const url = img.url;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  }
  
  // Strapi v4: image.data.attributes.url
  const data = img.data;
  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    const firstItem = Array.isArray(dataObj) ? dataObj[0] : dataObj;
    if (firstItem && typeof firstItem === "object") {
      const attrs = (firstItem as Record<string, unknown>).attributes || firstItem;
      if (attrs && typeof attrs === "object") {
        const url = (attrs as Record<string, unknown>).url;
        if (typeof url === "string") {
          if (url.startsWith("http")) return url;
          return `${API_BASE}${url}`;
        }
      }
    }
  }
  
  return null;
}

async function getProduct(slug: string): Promise<Product | null> {
  const data = await fetchStrapiList(`produits?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
  if (!data || data.length === 0) return null;
  const p = data[0];
  let image = resolveImageUrl(p.image);
  const slugStr = String(p.slug || "");
  if (!image) {
    if (slugStr === "kikoko") image = KIKOKO_FALLBACK_IMAGE;
    else image = "/images/logo-taka-inside.jpg";
  }
  return {
    id: Number(p.id) || 0,
    documentId: String(p.documentId || ""),
    nom: String(p.titre || p.nom || "Produit"),
    prix: Number(p.prix || 0),
    type: String(p.type || "fixe"),
    image,
    slug: slugStr,
    description: String(p.description || ""),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit non trouvé — Taka Inside" };
  return {
    title: `${product.nom} — Boutique Taka Inside`,
    description: product.description || `Achetez ${product.nom} à ${formatPrice(product.prix)}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const isDigital = product.type === "digital" || product.type === "album" || product.type === "single";

  return (
    <SiteLayout>
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="relative aspect-square bg-taka-gray-light rounded-2xl overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.nom}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-taka-gray">
                  Image produit
                </div>
              )}
              {isDigital && (
                <span className="absolute top-4 left-4 bg-taka-red text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  ALBUM DIGITAL
                </span>
              )}
            </div>

            {/* Détails */}
            <div className="flex flex-col">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{product.nom}</h1>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-taka-red">{formatPrice(product.prix)}</span>
                {isDigital && (
                  <span className="text-sm text-taka-gray bg-taka-gray-light px-2 py-1 rounded">Téléchargement digital</span>
                )}
              </div>

              {product.description ? (
                <div className="prose prose-sm max-w-none mb-8">
                  <p className="text-taka-gray leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              ) : (
                <p className="text-taka-gray mb-8">Aucune description disponible.</p>
              )}

              {isDigital && (
                <div className="bg-taka-yellow/10 border border-taka-yellow/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-taka-black">
                    <span className="font-semibold">📥 Téléchargement après achat</span><br />
                    Après paiement, vous recevrez un lien de téléchargement sécurisé valable 7 jours (3 téléchargements maximum).
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <AddToCartButton product={product} />
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-taka-gray">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Paiement sécurisé
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Livraison via BeniExpress
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
