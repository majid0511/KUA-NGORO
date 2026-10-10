import { supabase } from '../supabase';
import type { CmsResponse } from './types';

/**
 * Cek apakah Supabase sudah dikonfigurasi (URL & kunci ada di file .env).
 * Jika belum, situs memakai data cadangan lokal.
 */
export function isCmsConfigured(): boolean {
  return supabase !== null;
}

/**
 * Pembungkus inti: coba ambil data dari Supabase, dan pakai data cadangan jika perlu.
 * Dipakai oleh semua fungsi pengambil data (getBerita, getLayanan, dst).
 *
 * Aturan:
 *  • Supabase belum dikonfigurasi -> pakai data cadangan, tanpa pesan error
 *  • Supabase mengembalikan data   -> pakai data dari database
 *  • Supabase mengembalikan KOSONG -> tetap kosong (TIDAK pakai cadangan; artinya admin memang belum mengisi)
 *  • Supabase error / gagal        -> pakai data cadangan + pesan error
 *
 * Parameter:
 *  - fetcher      : fungsi yang mengambil data dari Supabase (harus melempar error jika gagal)
 *  - fallbackData : data cadangan lokal
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
    // Catat error di konsol browser untuk keperluan debugging, lalu pakai data cadangan
    console.warn('[CMS Error] Fetch failed, using fallback data:', err);
    return {
      data: fallbackData,
      fromFallback: true,
      error: 'Gagal terhubung ke CMS, menampilkan data lokal.',
    };
  }
}
