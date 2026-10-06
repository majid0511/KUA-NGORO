import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Newspaper, Bell, Landmark, User, Users, Image, ArrowRight } from 'lucide-react';
// import AnalyticsSection from './AnalyticsSection';

interface CountState {
  berita:     number;
  pengumuman: number;
  layanan:    number;
  staf:       number;
  galeri:     number;
}

const CARDS = [
  { key: 'berita',     label: 'Berita',     icon: Newspaper, to: '/admin/berita' },
  { key: 'pengumuman', label: 'Pengumuman', icon: Bell,      to: '/admin/pengumuman' },
  { key: 'layanan',    label: 'Layanan',    icon: Landmark,  to: '/admin/layanan' },
  { key: 'staf',       label: 'Staf',       icon: Users,     to: '/admin/staf' },
  { key: 'galeri',     label: 'Galeri',     icon: Image,     to: '/admin/galeri' },
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
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan konten dan statistik website KUA Kecamatan Ngoro.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CARDS.map(({ key, label, icon: Icon, to }) => (
          <Link
            key={key}
            to={to}
            className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-[#0f5132]/40 hover:shadow-sm transition"
          >
            <Icon size={18} className="text-slate-400 group-hover:text-[#0f5132] transition" />
            <p className="text-2xl font-bold text-slate-900 leading-none mt-3">
              {loading ? '–' : counts[key as keyof CountState]}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Analytics Section */}
      {/* <AnalyticsSection /> */}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick links */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pintasan</h2>
          <div className="divide-y divide-slate-100">
            {[
              { to: '/admin/berita',     label: 'Kelola berita' },
              { to: '/admin/pengumuman', label: 'Kelola pengumuman' },
              { to: '/admin/galeri',     label: 'Kelola galeri' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between py-3 text-sm text-slate-700 hover:text-[#0f5132] font-medium transition group"
              >
                {label}
                <ArrowRight size={15} className="text-slate-300 group-hover:text-[#0f5132] group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Profil shortcut */}
        <Link
          to="/admin/profil"
          className="lg:col-span-2 flex flex-col justify-between gap-6 p-5 bg-[#0f5132] text-white rounded-xl hover:bg-[#073822] transition group"
        >
          <User size={22} />
          <div>
            <p className="font-semibold text-sm">Profil KUA</p>
            <p className="text-xs text-emerald-200 mt-1">Edit data kantor, visi-misi, dan jam pelayanan.</p>
          </div>
          <ArrowRight size={16} className="text-emerald-300 self-end group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
