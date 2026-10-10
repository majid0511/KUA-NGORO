// PENJAGA HALAMAN ADMIN: memastikan hanya admin yang sudah login yang boleh membuka halaman /admin/*.
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Tiga kemungkinan status: sedang memeriksa, diizinkan, atau ditolak
type GuardState = 'loading' | 'authorized' | 'unauthorized';

/**
 * Melindungi semua halaman /admin/*.
 * Dua pengecekan: (1) ada sesi login Supabase yang valid, DAN (2) user tersebut terdaftar di tabel "admins".
 * Akun yang berhasil login tetapi tidak ada di tabel admins tetap ditolak.
 *
 * Hasil:
 *  - sedang memeriksa -> tampilkan "Memeriksa sesi..."
 *  - ditolak          -> alihkan ke /admin/login
 *  - diizinkan        -> tampilkan halaman yang diminta (<Outlet />)
 */
export default function AdminGuard() {
  const [state, setState] = useState<GuardState>(supabase ? 'loading' : 'unauthorized');

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    /**
     * Memutuskan status berdasarkan user saat ini: tanpa user -> ditolak; ada user -> cek tabel admins.
     * Flag "cancelled" mencegah update state jika komponen sudah ditutup.
     */
    async function check(user: User | null) {
      if (!user) {
        if (!cancelled) setState('unauthorized');
        return;
      }
      // Pastikan user terdaftar di tabel admins (aturan keamanan database mengizinkan admin membaca tabel ini)
      const { data } = await supabase!
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cancelled) setState(data ? 'authorized' : 'unauthorized');
    }

    // Cek sesi yang sudah ada saat halaman pertama dibuka (mis. setelah refresh)
    supabase!.auth.getSession().then(({ data: { session } }) => {
      check(session?.user ?? null);
    });

    // Pantau perubahan status login (login/logout) agar penjaga langsung bereaksi, mis. otomatis keluar ke halaman login saat logout
    const { data: listener } = supabase!.auth.onAuthStateChange((_event, session) => {
      check(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      // Pembersihan: berhenti memantau saat komponen ditutup
      listener.subscription.unsubscribe();
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9]">
        <div className="flex flex-col items-center gap-3 text-[#0f5132]">
          <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (state === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
