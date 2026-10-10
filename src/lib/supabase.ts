import { createClient } from '@supabase/supabase-js';

// Alamat project Supabase & kunci publik, dibaca dari file .env (awalan VITE_ wajib agar terbaca di browser).
// Kunci "anon" aman di browser karena akses data dibatasi aturan Row Level Security di database.
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Koneksi tunggal ke Supabase (database + login + penyimpanan file).
 * Hanya dibuat jika URL dan kunci publik (anon key) ada di file .env; jika tidak, nilainya null
 * dan situs otomatis memakai data cadangan lokal.
 * Impor dari sini saja - jangan membuat koneksi kedua di tempat lain.
 */
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
