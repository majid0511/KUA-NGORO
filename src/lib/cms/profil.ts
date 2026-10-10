import { supabase } from '../supabase';
import { queryWithFallback, isCmsConfigured } from './client';
import type { Profil, CmsResponse } from './types';
import { profileData } from '../../data/profile';

// ── Data cadangan ─────────────────────────────────────────────
// Profil lokal (src/data/profile.ts) diubah ke bentuk Profil. Mode maintenance selalu false di cadangan,
// supaya situs tidak pernah "terkunci" hanya karena database tidak terjangkau.
const fallbackProfil: Profil = {
  office_name:  profileData.name,
  description:  profileData.aboutFull,
  history:      profileData.history,
  vision:       profileData.vision,
  mission:      profileData.missions,
  address:      profileData.address,
  phone:        profileData.phone,
  email:        profileData.email,
  office_hours: profileData.officeHours,
  maintenance_mode: false,
};

// ── Pengambil data ────────────────────────────────────────────

/**
 * Mengambil profil kantor (hanya ada satu baris di tabel "profil").
 * Jika baris belum ada, atau ada kolom yang kosong, bagian yang kosong diisi dari data cadangan lokal
 * sehingga halaman tidak pernah tampil bolong.
 */
export async function getProfil(): Promise<CmsResponse<Profil>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('profil')
      .select('office_name,description,history,vision,mission,address,phone,email,office_hours,maintenance_mode')
      .maybeSingle();

    if (error) throw new Error(error.message);
    // Belum ada baris profil di database -> pakai profil cadangan sepenuhnya
    if (!data) return fallbackProfil;

    return {
      office_name:  data.office_name || fallbackProfil.office_name,
      description:  data.description || fallbackProfil.description,
      history:      data.history || fallbackProfil.history,
      vision:       data.vision || fallbackProfil.vision,
      // Misi berupa daftar; pakai cadangan jika kosong atau bukan daftar
      mission:      (Array.isArray(data.mission) && data.mission.length > 0) ? data.mission : fallbackProfil.mission,
      address:      data.address || fallbackProfil.address,
      phone:        data.phone || fallbackProfil.phone,
      email:        data.email || fallbackProfil.email,
      office_hours: data.office_hours || fallbackProfil.office_hours,
      maintenance_mode: Boolean(data.maintenance_mode),
    } as Profil;
  }, fallbackProfil);
}

/**
 * Cek cepat status maintenance, dipakai App.tsx untuk menggerbangi
 * seluruh situs publik. Gagal terhubung ke Supabase dianggap TIDAK
 * maintenance (fail-open), supaya kegagalan jaringan tidak ikut
 * menutup situs untuk semua pengunjung.
 */
export async function isMaintenanceMode(): Promise<boolean> {
  if (!isCmsConfigured()) return false;
  try {
    const { data, error } = await supabase!
      .from('profil')
      .select('maintenance_mode')
      .maybeSingle();
    if (error || !data) return false;
    return Boolean((data as { maintenance_mode: boolean }).maintenance_mode);
  } catch {
    return false;
  }
}
