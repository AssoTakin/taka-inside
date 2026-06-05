// lib/api.ts — SSR-safe fetcher for Next.js App Router
const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://taka-inside-production.up.railway.app';

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

/** Fetch Strapi and return the raw response */
export async function fetchStrapi(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<Record<string, unknown>[] | null> {
  return fetchStrapiList(endpoint, options);
}

/** Fetch a list from Strapi */
export async function fetchStrapiList(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<Record<string, unknown>[] | null> {
  const json = await _fetchStrapiRaw(endpoint, options);
  if (!json || typeof json !== 'object') return null;
  const data = (json as Record<string, unknown>).data;
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  return null;
}

/** Fetch a single item from Strapi */
export async function fetchStrapiSingle(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<Record<string, unknown> | null> {
  const list = await fetchStrapiList(endpoint, options);
  return list?.[0] ?? null;
}

async function _fetchStrapiRaw(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<unknown> {
  try {
    const params = new URLSearchParams();
    if (options?.populate) params.append('populate', options.populate);
    if (options?.filters) params.append('filters', options.filters);
    if (options?.sort) params.append('sort', options.sort);

    const query = params.toString() ? `?${params.toString()}` : '';
    const url = `${API_BASE}/api/${endpoint}${query}`;

    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 60 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`[Strapi] ${endpoint} → HTTP ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`[Strapi] ${endpoint} → ${err instanceof Error ? err.message : 'unknown error'}`);
    return null;
  }
}

export function getImageUrl(image: { url: string } | null | undefined): string | null {
  if (!image?.url) return null;
  if (image.url.startsWith('http')) return image.url;
  return `${API_BASE}${image.url}`;
}

/** ————————————————————————
 *  Content-Types Éditoriaux (CMS)
 *  ———————————————————————— */

/** Fetch site config (Single Type) */
export async function fetchSiteConfig(): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle('site-config?populate=*');
}

/** Fetch menu items (header / footer / both) */
export async function fetchMenuItems(position?: 'header' | 'footer' | 'both'): Promise<Record<string, unknown>[] | null> {
  const filter = position ? `&filters[position][$eq]=${position}` : '';
  return fetchStrapiList(`menu-items?populate=*&sort=order${filter}`);
}

/** Fetch homepage (Single Type) */
export async function fetchHomepage(): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle('homepage?populate[hero][populate]=*&populate[sections][populate]=*');
}

/** Fetch a page content by slug */
export async function fetchPageContent(slug: string): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle(`page-contents?filters[slug][$eq]=${slug}&populate=*`);
}

/** Fetch a legal page by slug */
export async function fetchLegalPage(slug: string): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle(`legal-pages?filters[slug][$eq]=${slug}&populate=*`);
}

/** Fetch payment methods */
export async function fetchPaymentMethods(): Promise<Record<string, unknown>[] | null> {
  return fetchStrapiList('payment-methods?populate=*&sort=displayOrder&filters[isActive][$eq]=true');
}

/** Fetch a global CTA by its key */
export async function fetchGlobalCta(key: string): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle(`global-ctas?filters[key][$eq]=${key}&populate=*`);
}

/** Extract nested Strapi data (handles both v4 data.attributes and v5 formats) */
export function extractData(obj: unknown): Record<string, unknown> | null {
  if (!obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  if (o.data && typeof o.data === 'object') {
    const d = o.data as Record<string, unknown>;
    if (d.attributes && typeof d.attributes === 'object') return d.attributes as Record<string, unknown>;
    return d;
  }
  return o;
}

/** Extract image from Strapi media field */
export function extractImage(media: unknown): { url: string | null; alt?: string } {
  const data = extractData(media);
  if (!data) return { url: null };
  const url = (data.url as string) || null;
  const alt = (data.alternativeText as string) || (data.name as string) || '';
  return { url: url ? (url.startsWith('http') ? url : `${API_BASE}${url}`) : null, alt };
}

/** Extract repeatable components */
export function extractRepeatable(items: unknown): Record<string, unknown>[] {
  if (!items) return [];
  if (Array.isArray(items)) return items.map(extractData).filter(Boolean) as Record<string, unknown>[];
  const data = extractData(items);
  if (Array.isArray(data)) return data.map(extractData).filter(Boolean) as Record<string, unknown>[];
  return [];
}
