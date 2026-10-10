import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Staf, CmsResponse } from './types';
import { profileData } from '../../data/profile';

// ── Data cadangan ─────────────────────────────────────────────
// Daftar staf lokal (src/data/profile.ts) diubah ke bentuk Staf; urutan mengikuti urutan array.
const fallbackStafList: Staf[] = profileData.staff.map((s, idx) => ({
  id:       s.id,
  name:     s.name,
  position: s.position,
  nip:      s.nip,
  photo:    s.photoUrl,
  bio:      s.description,
  order:    idx + 1,
  active:   true,
}));

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil semua pegawai yang aktif (active = true), urut berdasarkan kolom "order".
 */
export async function getStaf(): Promise<CmsResponse<Staf[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('staf')
      .select('id,name,position,nip,photo,bio,order,active')
      .eq('active', true)
      .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as Staf[];
  }, fallbackStafList);
}
