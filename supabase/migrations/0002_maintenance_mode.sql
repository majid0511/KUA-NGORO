-- ============================================================
-- KUA Ngoro – Migration 0002: mode maintenance
-- Jalankan SETELAH supabase-setup.sql. Aman dijalankan ulang.
-- Menambah sakelar di tabel profil untuk menonaktifkan sementara
-- halaman publik (kecuali /admin) dan menampilkan pesan maintenance.
-- ============================================================

alter table public.profil
  add column if not exists maintenance_mode boolean not null default false;
