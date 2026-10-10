import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Layanan, CmsResponse } from './types';
import { servicesData } from '../../data/services';

// ── Data cadangan ─────────────────────────────────────────────
// Mengubah data layanan lokal (src/data/services.ts) ke bentuk Layanan; urutan mengikuti urutan array.
const fallbackLayananList: Layanan[] = servicesData.map((svc, idx) => ({
  id:             svc.id,
  title:          svc.title,
  slug:           svc.id,
  description:    svc.fullDesc || svc.shortDesc,
  requirements:   svc.requirements,
  procedure:      svc.procedure,
  estimated_time: '1 - 10 hari kerja',
  icon:           svc.icon,
  status:         'active' as const,
  order:          idx + 1,
}));

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil semua layanan yang aktif, urut berdasarkan kolom "order" (kecil ke besar).
 */
export async function getLayanan(): Promise<CmsResponse<Layanan[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('layanan')
      .select('id,title,slug,description,requirements,procedure,estimated_time,icon,status,order')
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as Layanan[];
  }, fallbackLayananList);
}

/**
 * Mengambil satu layanan aktif berdasarkan slug (alamat singkat) atau id.
 * Data cadangan dicari lebih dulu agar bisa dipakai jika database gagal.
 */
export async function getLayananBySlug(slug: string): Promise<CmsResponse<Layanan | null>> {
  const localMatch =
    fallbackLayananList.find((l) => l.slug === slug || l.id === slug) ?? null;

  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('layanan')
      .select('id,title,slug,description,requirements,procedure,estimated_time,icon,status,order')
      .eq('status', 'active')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data ?? null) as Layanan | null;
  }, localMatch);
}
