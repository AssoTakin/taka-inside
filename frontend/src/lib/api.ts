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

// Cache simple pour SSR (évite les re-fetch en boucle)
const serverCache = new Map<string, { data: unknown; ts: number }>();
const SSR_CACHE_MS = 60_000; // 60 secondes

/** Fetch a list from Strapi */
export async function fetchStrapiList(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<Record<string, unknown>[] | null> {
  const cacheKey = endpoint + JSON.stringify(options);
  const cached = serverCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < SSR_CACHE_MS) {
    return cached.data as Record<string, unknown>[] | null;
  }

  const json = await _fetchStrapiRaw(endpoint, options);
  if (!json || typeof json !== 'object') return null;
  const data = (json as Record<string, unknown>).data;
  const result = Array.isArray(data) ? data as Record<string, unknown>[] : null;
  serverCache.set(cacheKey, { data: result, ts: Date.now() });
  return result;
}

/** Fetch a single item from Strapi */
export async function fetchStrapiSingle(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<Record<string, unknown> | null> {
  const cacheKey = 'single:' + endpoint + JSON.stringify(options);
  const cached = serverCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < SSR_CACHE_MS) {
    return cached.data as Record<string, unknown> | null;
  }

  // Essayer d'abord comme liste (collection), sinon comme single type
  const list = await fetchStrapiList(endpoint, options);
  if (list && list.length > 0) {
    serverCache.set(cacheKey, { data: list[0], ts: Date.now() });
    return list[0];
  }

  // Single type: data est un objet, pas un tableau
  const json = await _fetchStrapiRaw(endpoint, options);
  if (!json || typeof json !== 'object') return null;
  const data = (json as Record<string, unknown>).data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    serverCache.set(cacheKey, { data: data as Record<string, unknown>, ts: Date.now() });
    return data as Record<string, unknown>;
  }
  return null;
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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // Token API — côté serveur (SSR) et côté client (navigateur)
    const apiToken = typeof window === 'undefined'
      ? (process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN)
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    // Défense contre les guillemets auto-ajoutés par certains exports .env
    const cleanToken = apiToken?.replace(/^"+|"+$/g, '').trim();
    if (cleanToken) {
      headers['Authorization'] = `Bearer ${cleanToken}`;
    }

    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 300 },
      headers,
      signal: AbortSignal.timeout(8000),
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
  if (!image) return null;
  
  // Strapi v5 direct: { url: "..." }
  if (typeof (image as Record<string, unknown>).url === 'string') {
    const url = (image as Record<string, unknown>).url as string;
    if (url.startsWith('http')) return url;
    // Local fallback images (frontend public/) stay relative
    if (url.startsWith('/images/')) return url;
    // Strapi media (/uploads/...) must be absolute so Next.js can optimize them
    return `${API_BASE}${url}`;
  }
  
  // Strapi v4: { data: { attributes: { url: "..." } } }
  const data = (image as Record<string, unknown>).data;
  if (data && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>;
    const firstItem = Array.isArray(dataObj) ? dataObj[0] : dataObj;
    if (firstItem && typeof firstItem === 'object') {
      const attrs = (firstItem as Record<string, unknown>).attributes || firstItem;
      if (attrs && typeof attrs === 'object') {
        const url = (attrs as Record<string, unknown>).url;
        if (typeof url === 'string') {
          if (url.startsWith('http')) return url;
          if (url.startsWith('/images/')) return url;
          return `${API_BASE}${url}`;
        }
      }
    }
  }
  
  return null;
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
  const filter = position ? `filters[position][$eq]=${position}` : '';
  const items = await fetchStrapiList(`menu-items?populate=*&sort=order${filter ? `&${filter}` : ''}`);
  if (!items) return null;
  // Dédupliquer par label (garder le premier)
  const seen = new Set<string>();
  return items.filter((item: Record<string, unknown>) => {
    const label = item.label as string;
    if (!label || seen.has(label)) return false;
    seen.add(label);
    return true;
  });
}

/** Fetch homepage (Single Type) */
export async function fetchHomepage(): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle('homepage?populate[hero][populate]=*&populate[sections][populate]=*&populate[seo][populate]=*');
}

/** Fetch homepage sections with lighter populate (fallback if deep populate times out) */
export async function fetchHomepageLight(): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle('homepage?populate[hero][populate]=*&populate=sections');
}

/** Fetch a page content by slug */
export async function fetchPageContent(slug: string): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle(`page-contents?filters[slug][$eq]=${slug}&populate=*`);
}

/** Render richtext field from Strapi to plain text */
export function renderRichText(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((block) => {
      if (typeof block === 'string') return block;
      const children = (block?.children || []) as Array<{ text?: string } | string>;
      return children.map(child => typeof child === 'string' ? child : (child?.text || '')).join('');
    }).join('\n\n');
  }
  return '';
}

/** Fetch label musical page (Single Type) */
export async function fetchLabelMusicalPage(): Promise<Record<string, unknown> | null> {
  return fetchStrapiSingle(
    'label-musical-page?populate[hero][populate][primaryCta]=*&populate[hero][populate][secondaryCta]=*&populate[stats][populate]=*&populate[artistsSectionCta][populate]=*&populate[callout][populate][primaryCta]=*&populate[callout][populate][secondaryCta]=*&populate[seo][populate][ogImage][populate]=*'
  );
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
