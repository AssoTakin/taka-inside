// lib/api.ts — SSR-safe fetcher for Next.js App Router
const API_BASE = 'https://taka-inside-production.up.railway.app';

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
