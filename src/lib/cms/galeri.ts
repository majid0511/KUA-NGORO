import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Galeri, CmsResponse } from './types';
import { activitiesData } from '../../data/activities';

// ── Data cadangan ─────────────────────────────────────────────
// Dipakai hanya jika Supabase belum dikonfigurasi / gagal diakses. Diubah ke bentuk Galeri.
const fallbackGaleriList: Galeri[] = activitiesData.map((act) => ({
  id:           act.id,
  title:        act.title,
  image:        act.imageUrl,
  description:  act.description,
  category:     act.category,
  published_at: act.date,
}));

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil semua foto galeri, terbaru di atas (urut published_at menurun).
 */
export async function getGaleri(): Promise<CmsResponse<Galeri[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('galeri')
      .select('id,title,image,description,category,published_at')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Galeri[];
  }, fallbackGaleriList);
}
