import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Newspaper, Bell, Landmark, User, Users, Image, ArrowRight } from 'lucide-react';

interface CountState {
  berita:     number;
  pengumuman: number;
  layanan:    number;
  staf:       number;
  galeri:     number;
}

const CARDS = [
  { key: 'berita',     label: 'Berita',      icon: Newspaper, to: '/admin/berita',     color: 'bg-blue-50   text-blue-700  border-blue-200'   },
  { key: 'pengumuman', label: 'Pengumuman',  icon: Bell,      to: '/admin/pengumuman', color: 'bg-amber-50  text-amber-700 border-amber-200'  },
  { key: 'layanan',    label: 'Layanan',     icon: Landmark,  to: '/admin/layanan',    color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'staf',       label: 'Staf',        icon: Users,     to: '/admin/staf',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'galeri',     label: 'Galeri',      icon: Image,     to: '/admin/galeri',     color: 'bg-rose-50   text-rose-700  border-rose-200'   },
] as const;

export default function AdminDashboard() {
  const [counts, setCounts] = useState<CountState>({ berita: 0, pengumuman: 0, layanan: 0, staf: 0, galeri: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const tables = ['berita', 'pengumuman', 'layanan', 'staf', 'galeri'] as const;
      const results = await Promise.all(
        tables.map((t) => supabase!.from(t).select('id', { count: 'exact', head: true }))
      );
      setCounts({
        berita:     results[0].count ?? 0,
        pengumuman: results[1].count ?? 0,
        layanan:    results[2].count ?? 0,
        staf:       results[3].count ?? 0,
        galeri:     results[4].count ?? 0,
      });
      setLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900">Dashboard</h2>
        <p className="text-sm text-stone-500 mt-1">Ringkasan konten website KUA Kecamatan Ngoro.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CARDS.map(({ key, label, icon: Icon, to, color }) => (
          <Link
            key={key}
            to={to}
            className={`group flex flex-col gap-3 p-4 rounded-2xl border ${color} transition hover:shadow-sm`}
          >
            <Icon size={22} />
            <div>
              <p className="text-2xl font-extrabold leading-none">
                {loading ? '–' : counts[key as keyof CountState]}
              </p>
              <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Pintasan</h3>
        <div className="divide-y divide-stone-100">
          {[
            { to: '/admin/berita/tambah',     label: 'Tulis berita baru' },
            { to: '/admin/pengumuman/tambah', label: 'Buat pengumuman baru' },
            { to: '/admin/galeri/tambah',     label: 'Unggah foto galeri baru' },
            { to: '/admin/profil',            label: 'Edit profil KUA' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between py-2.5 text-sm text-stone-700 hover:text-[#0f5132] font-medium transition group"
            >
              {label}
              <ArrowRight size={16} className="text-stone-400 group-hover:text-[#0f5132] transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Profil shortcut */}
      <Link
        to="/admin/profil"
        className="flex items-center gap-4 p-5 bg-[#0f5132] text-white rounded-2xl hover:bg-[#073822] transition group"
      >
        <User size={24} className="shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-sm">Profil KUA</p>
          <p className="text-xs text-emerald-200 mt-0.5">Edit data kantor, visi-misi, dan jam pelayanan.</p>
        </div>
        <ArrowRight size={18} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
