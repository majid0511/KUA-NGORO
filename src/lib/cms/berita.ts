import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Berita, CmsResponse } from './types';
import { newsData } from '../../data/news';

// ── Data cadangan (data statis lokal) ────────────────────────
// Mengubah data berita lokal (src/data/news.ts) ke bentuk Berita; dipakai jika Supabase tidak tersedia.
const fallbackBeritaList: Berita[] = newsData.map((item) => ({
  id:             item.id,
  title:          item.title,
  slug:           item.slug,
  excerpt:        item.excerpt,
  content:        item.content,
  featured_image: item.imageUrl,
  category:       item.category,
  author:         item.author || 'Tim Humas KUA Ngoro',
  published_at:   item.date,
  status:         'published' as const,
}));

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil semua berita berstatus "published", terbaru di atas.
 * Jika Supabase aktif tetapi tabelnya kosong -> hasilnya kosong (bukan data cadangan).
 */
export async function getBerita(): Promise<CmsResponse<Berita[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('berita')
      .select('id,title,slug,excerpt,content,featured_image,category,author,published_at,status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Berita[];
  }, fallbackBeritaList);
}

/**
 * Mengambil satu berita "published" berdasarkan slug (bagian akhir alamat, mis. /news/judul-berita).
 * Tidak ditemukan -> null (halaman menampilkan pesan "tidak ditemukan").
 */
export async function getBeritaBySlug(slug: string): Promise<CmsResponse<Berita | null>> {
  const localMatch = fallbackBeritaList.find((b) => b.slug === slug) ?? null;

  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('berita')
      .select('id,title,slug,excerpt,content,featured_image,category,author,published_at,status')
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data ?? null) as Berita | null;
  }, localMatch);
}
