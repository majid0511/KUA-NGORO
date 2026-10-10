// HALAMAN LOGIN ADMIN (alamat: /admin/login): form email + kata sandi memakai Supabase Auth.
// Setelah berhasil login, sistem juga memastikan akun tersebut terdaftar di tabel "admins" -- akun biasa ditolak.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Landmark, Loader2 } from 'lucide-react';

/**
 * Halaman login. Di layar lebar ada panel hijau di kiri (branding) dan form di kanan; di HP hanya form.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  // Isi kolom email
  const [email, setEmail]       = useState('');
  // Isi kolom kata sandi
  const [password, setPassword] = useState('');
  // True saat proses login berjalan (tombol dinonaktifkan)
  const [loading, setLoading]   = useState(false);
  // Pesan kesalahan yang ditampilkan di bawah form (null = tidak ada)
  const [error, setError]       = useState<string | null>(null);

  /**
   * Proses login, dalam 3 langkah:
   * 1. Masuk ke Supabase Auth dengan email & kata sandi (gagal -> pesan "Email atau kata sandi salah").
   * 2. Cek apakah user ada di tabel "admins" (tidak ada -> langsung keluar lagi + pesan "tidak memiliki akses admin").
   * 3. Berhasil -> pindah ke Dashboard (replace: tombol Back tidak kembali ke halaman login).
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Email atau kata sandi salah. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    // Langkah 2: pastikan akun terdaftar sebagai admin
    const { data: adminRow } = await supabase!
      .from('admins')
      .select('user_id')
      .eq('user_id', (await supabase!.auth.getUser()).data.user?.id ?? '')
      .maybeSingle();

    if (!adminRow) {
      await supabase!.auth.signOut();
      setError('Akun ini tidak memiliki akses admin.');
      setLoading(false);
      return;
    }

    navigate('/admin', { replace: true });
  }

  // Jika Supabase belum dikonfigurasi (file .env belum diisi), tampilkan petunjuk alih-alih form yang tidak akan berfungsi
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <p className="max-w-sm text-center text-sm text-slate-600">
          Supabase belum dikonfigurasi. Isi <code>VITE_SUPABASE_URL</code> dan{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env</code>, lalu jalankan ulang.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Minta mesin pencari tidak mengindeks halaman admin */}
      <meta name="robots" content="noindex,nofollow" />

      <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
        {/* Panel branding hijau (hanya layar lebar) */}
        <div className="hidden lg:flex flex-col justify-between bg-[#0f5132] text-white p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-bold">KUA Kecamatan Ngoro</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold leading-snug max-w-sm">
              Kelola informasi dan layanan publik KUA Ngoro dari satu tempat.
            </p>
            <p className="text-sm text-emerald-200 mt-3">
              Berita, pengumuman, layanan, staf, dan galeri — semua tersinkron otomatis ke website.
            </p>
          </div>
          <p className="text-xs text-emerald-300">Panel internal · Kabupaten Jombang</p>
        </div>

        {/* Panel form login */}
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#0f5132] flex items-center justify-center mb-3">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">KUA Kecamatan Ngoro</h1>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Masuk ke panel admin</h2>
            <p className="text-sm text-slate-500 mb-6">Khusus akun yang terdaftar sebagai admin.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kua-ngoro.id"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]/30 focus:border-[#0f5132] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Kata sandi
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]/30 focus:border-[#0f5132] transition"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0f5132] hover:bg-[#073822] text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              Hanya admin KUA yang dapat mengakses halaman ini.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
