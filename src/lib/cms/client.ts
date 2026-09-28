import { createClient, type SanityClient } from '@sanity/client';
import type { CmsResponse } from './types';

// Konfigurasi publik (read-only). Jangan taruh token di sini: semua VITE_* masuk ke bundle browser.
export const CMS_CONFIG = {
  projectId: import.meta.env.VITE_CMS_PROJECT_ID || '',
  dataset: import.meta.env.VITE_CMS_DATASET || 'production',
  apiVersion: '2023-08-01',
};

export function isCmsConfigured(): boolean {
  return Boolean(CMS_CONFIG.projectId);
}

let client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!client) {
    // Konten publik yang hanya dibaca -> pakai CDN (apicdn.sanity.io)
    client = createClient({ ...CMS_CONFIG, useCdn: true });
  }
  return client;
}

/**
 * Menjalankan query GROQ. Melempar error jika jaringan/API gagal,
 * supaya queryWithFallback bisa membedakan "gagal" dari "kosong".
 */
export async function fetchCmsData<T>(groqQuery: string, params?: Record<string, string>): Promise<T> {
  const c = getClient();
  return params ? c.fetch<T>(groqQuery, params) : c.fetch<T>(groqQuery);
}

/**
 * - CMS belum dikonfigurasi -> data lokal, tanpa error
 * - CMS berhasil (termasuk hasil kosong) -> data dari CMS apa adanya
 * - CMS gagal -> data lokal + pesan error
 */
export async function queryWithFallback<T>(
  cmsFetcher: () => Promise<T>,
  fallbackData: T
): Promise<CmsResponse<T>> {
  if (!isCmsConfigured()) {
    return { data: fallbackData, fromFallback: true, error: null };
  }

  try {
    const data = await cmsFetcher();
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
