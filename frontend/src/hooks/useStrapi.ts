'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

interface UseStrapiOptions {
  populate?: string;
  filters?: Record<string, unknown>;
  sort?: string;
  pagination?: { page: number; pageSize: number };
}

export function useStrapi<T>(
  endpoint: string,
  options?: UseStrapiOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const populate = options?.populate;
  const sort = options?.sort;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (populate) params.append('populate', populate);
        if (sort) params.append('sort', sort);

        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE}/api/${endpoint}${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, populate, sort]);

  return { data, loading, error };
}

export function useStrapiSingle<T>(
  endpoint: string,
  identifier: string,
  options?: UseStrapiOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const populate = options?.populate;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (populate) params.append('populate', populate);

        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE}/api/${endpoint}/${identifier}${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, identifier, populate]);

  return { data, loading, error };
}
