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
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9] px-4">
        <p className="max-w-sm text-center text-sm text-stone-600">
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

      <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9] px-4">
        <div className="w-full max-w-sm">
          {/* Logo area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0f5132] flex items-center justify-center mb-4 shadow-md">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-stone-900">Panel Admin</h1>
            <p className="text-sm text-stone-500 mt-1">KUA Kecamatan Ngoro</p>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-7 space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-stone-700 uppercase tracking-wide">
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]/40 focus:border-[#0f5132] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]/40 focus:border-[#0f5132] transition"
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
              className="w-full flex items-center justify-center gap-2 bg-[#0f5132] hover:bg-[#073822] text-white text-sm font-bold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            Hanya admin KUA yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>
    </>
  );
}
