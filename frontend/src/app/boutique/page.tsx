import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList } from "@/lib/api";
import { formatPrice } from "@/lib/price";

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

const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://taka-inside-production.up.railway.app";

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
    // data might be an array
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

async function getProducts(): Promise<Product[]> {
  const data = await fetchStrapiList("produits?populate=*");
  if (!data || !Array.isArray(data)) return [];
  return data.map((p: Record<string, unknown>) => {
    const slug = String(p.slug || p.documentId || "");
    let image = resolveImageUrl(p.image);
    if (slug === "kikoko") image = "/images/kikoko-cover.jpg";
    return {
      id: Number(p.id) || 0,
      documentId: String(p.documentId || ""),
      nom: String(p.titre || p.nom || "Produit"),
      prix: Number(p.prix || 0),
      type: String(p.type || "fixe"),
      image,
      slug,
      description: String(p.description || ""),
    };
  });
}

export default async function BoutiquePage() {
  const products = await getProducts();

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Boutique en ligne
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">
              Notre <span className="text-taka-yellow">Boutique</span>
            </h1>
            <p className="text-taka-gray mt-4 max-w-xl">
              CDs, t-shirts, produits dérivés et artisanat béninois. Livraison via BeniExpress ou retrait sur place à Cotonou.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold">Nos produits</h2>
            <div className="text-sm text-taka-gray">
              Paiement sécurisé via <span className="font-semibold">Stripe</span> · <span className="font-semibold">PayPal</span> · <span className="font-semibold">Mobile Money</span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-taka-gray">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/boutique/${product.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden border border-taka-gray-light hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-square bg-taka-gray-light flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-taka-gray">Image produit</span>
                    )}
                    {product.type === "digital" && (
                      <span className="absolute top-3 left-3 bg-taka-red text-white text-xs font-bold px-2 py-1 rounded-lg">
                        ALBUM DIGITAL
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-sm mb-1 group-hover:text-taka-red transition-colors">
                      {product.nom}
                    </h3>
                    <p className="font-bold">{formatPrice(product.prix)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
