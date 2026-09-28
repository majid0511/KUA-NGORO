import { supabase } from '../supabase';
import type { CmsResponse } from './types';

/**
 * Returns true when both Supabase env vars are present.
 * Used by pages to decide whether to show a "CMS not configured" note.
 */
export function isCmsConfigured(): boolean {
  return supabase !== null;
}

/**
 * Core fallback wrapper.
 *
 * Semantics (per spec):
 *  • CMS not configured  → return fallback, error: null
 *  • CMS returns data    → return CMS data, fromFallback: false
 *  • CMS returns empty   → return empty ([], null), fromFallback: false  ← NOT falling back
 *  • CMS throws          → return fallback, error message
 */
export async function queryWithFallback<T>(
  fetcher: () => Promise<T>,
  fallbackData: T,
): Promise<CmsResponse<T>> {
  if (!isCmsConfigured()) {
    return { data: fallbackData, fromFallback: true, error: null };
  }

  try {
    const data = await fetcher();
    return { data, fromFallback: false, error: null };
  } catch (err) {
    console.warn('[CMS Error] Fetch failed, using fallback data:', err);
    return {
      data: fallbackData,
      fromFallback: true,
      error: 'Gagal terhubung ke CMS, menampilkan data lokal.',
    };
  }
}
