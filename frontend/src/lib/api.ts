// lib/api.ts — SSR-safe fetcher for Next.js App Router
const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export async function fetchStrapi<T = unknown>(
  endpoint: string,
  options?: { populate?: string; filters?: string; sort?: string; revalidate?: number }
): Promise<T | null> {
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

    const json = await res.json();
    return json.data ?? null;
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
