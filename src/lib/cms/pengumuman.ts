import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Pengumuman, CmsResponse } from './types';
import { newsData } from '../../data/news';

// ── Data cadangan ─────────────────────────────────────────────
// Diambil dari berita lokal yang berkategori "Pengumuman"; dipakai jika Supabase tidak tersedia.
const fallbackPengumumanList: Pengumuman[] = newsData
  .filter((item) => item.category === 'Pengumuman')
  .map((item) => ({
    id:           item.id,
    title:        item.title,
    content:      item.content || item.excerpt,
    published_at: item.date,
    expires_at:   undefined,
    priority:     (item.featured ? 'important' : 'normal') as 'normal' | 'important',
    status:       'published' as const,
  }));

// Membuang pengumuman yang sudah kedaluwarsa (expires_at lebih lama dari hari ini).
// Berlaku untuk data dari database maupun data cadangan.
function filterExpired(list: Pengumuman[]): Pengumuman[] {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, zona waktu perangkat
  return list.filter((p) => !p.expires_at || p.expires_at >= today);
}

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil pengumuman yang berstatus "published" dan belum kedaluwarsa, terbaru di atas.
 */
export async function getPengumuman(): Promise<CmsResponse<Pengumuman[]>> {
  const response = await queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('pengumuman')
      .select('id,title,content,published_at,expires_at,priority,status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Pengumuman[];
  }, fallbackPengumumanList);

  // Filter kedaluwarsa dijalankan di sini agar berlaku untuk kedua sumber data
  if (response.data) {
    response.data = filterExpired(response.data);
  }

  return response;
}
