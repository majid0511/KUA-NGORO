import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Landmark, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

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

    // Verify admin table membership
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
      {/* noindex for admin pages */}
      <meta name="robots" content="noindex,nofollow" />

      <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
        {/* Brand panel (desktop only) */}
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

        {/* Form panel */}
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
