import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

type GuardState = 'loading' | 'authorized' | 'unauthorized';

/**
 * Protects all /admin/* routes.
 * Checks Supabase Auth session AND that the user exists in the `admins` table.
 */
export default function AdminGuard() {
  const [state, setState] = useState<GuardState>('loading');

  useEffect(() => {
    let cancelled = false;

    async function check(user: User | null) {
      if (!user) {
        if (!cancelled) setState('unauthorized');
        return;
      }
      // Verify the user is in the admins table
      const { data } = await supabase!
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cancelled) setState(data ? 'authorized' : 'unauthorized');
    }

    supabase!.auth.getSession().then(({ data: { session } }) => {
      check(session?.user ?? null);
    });

    const { data: listener } = supabase!.auth.onAuthStateChange((_event, session) => {
      check(session?.user ?? null);
    });

    return () => {
      cancelled = true;
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
