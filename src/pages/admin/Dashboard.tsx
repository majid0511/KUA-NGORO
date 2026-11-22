// DASHBOARD ADMIN (alamat: /admin): ringkasan jumlah konten dan pintasan ke halaman kelola.
// Redesign: emerald glass (selaras dengan sidebar & AdminShared) + pola geometris Islami, animasi memakai motion/react.
import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useReducedMotion, type Variants } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Newspaper, Bell, Landmark, User, Users, Image, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Jumlah baris tiap tabel konten
 */
interface CountState {
  berita: number;
  pengumuman: number;
  layanan: number;
  staf: number;
  galeri: number;
}

// Definisi kartu statistik: kunci tabel, label, ikon, dan halaman tujuan saat diklik
const CARDS = [
  { key: 'berita', label: 'Berita', icon: Newspaper, to: '/admin/berita' },
  { key: 'pengumuman', label: 'Pengumuman', icon: Bell, to: '/admin/pengumuman' },
  { key: 'layanan', label: 'Layanan', icon: Landmark, to: '/admin/layanan' },
  { key: 'staf', label: 'Staf', icon: Users, to: '/admin/staf' },
  { key: 'galeri', label: 'Galeri', icon: Image, to: '/admin/galeri' },
] as const;

// Pintasan ke halaman kelola yang paling sering dipakai
const SHORTCUTS = [
  { to: '/admin/berita', label: 'Kelola berita', hint: 'Tulis dan perbarui kabar terbaru' },
  { to: '/admin/pengumuman', label: 'Kelola pengumuman', hint: 'Informasi resmi untuk masyarakat' },
  { to: '/admin/galeri', label: 'Kelola galeri', hint: 'Foto kegiatan dan layanan' },
];

// Link bergerak (hover/tap) — dibuat sekali di luar komponen agar tidak dibuat ulang tiap render
const MotionLink = motion.create(Link);

// Animasi masuk: kontainer mengatur jeda antar anak (stagger), tiap anak naik sambil muncul
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Sapaan sesuai jam (waktu perangkat)
 */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

/**
 * Pola bintang delapan sudut ala ornamen geometris Islami, dipakai sebagai latar halus.
 * Id pola dibuat unik per instance supaya beberapa pola di satu halaman tidak bentrok.
 */
function GeometricPattern({ className = '' }: { className?: string }) {
  const patternId = `geo-star-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 24 24)" />
          <circle cx="24" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Angka yang menghitung naik dari 0 ke nilai akhir. Saat loading tampil kerangka berdenyut.
 * Mengikuti preferensi "kurangi gerakan" milik pengguna.
 */
function CountUp({ value, loading, light = false }: { value: number; loading: boolean; light?: boolean }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, loading, reduce]);

  if (loading) {
    return (
      <span
        className={`inline-block h-7 w-10 animate-pulse rounded-full align-middle ${
          light ? 'bg-white/25' : 'bg-slate-200'
        }`}
      />
    );
  }
  return <>{display}</>;
}

/**
 * Halaman dashboard. Jumlah data diambil sekali saat halaman dibuka.
 */
export default function AdminDashboard() {
  // Jumlah data tiap tabel (awal 0 sampai data selesai dimuat)
  const [counts, setCounts] = useState<CountState>({ berita: 0, pengumuman: 0, layanan: 0, staf: 0, galeri: 0 });
  // True selama jumlah data belum selesai dimuat (kartu menampilkan kerangka)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hitung jumlah baris tiap tabel secara bersamaan. count: 'exact' + head: true = hanya minta jumlahnya, bukan isi datanya (hemat data).
    async function fetchCounts() {
      try {
        const tables = ['berita', 'pengumuman', 'layanan', 'staf', 'galeri'] as const;
        const results = await Promise.all(
          tables.map((t) => supabase!.from(t).select('id', { count: 'exact', head: true }))
        );
        setCounts({
          berita: results[0].count ?? 0,
          pengumuman: results[1].count ?? 0,
          layanan: results[2].count ?? 0,
          staf: results[3].count ?? 0,
          galeri: results[4].count ?? 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div className="w-full space-y-6" variants={container} initial="hidden" animate="show">
      {/* Banner sambutan: gradasi emerald, pola geometris, dan ringkasan total konten */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg shadow-emerald-950/20 sm:p-8"
      >
        <GeometricPattern className="absolute inset-0 text-white opacity-[0.07]" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/15" />
        {/* Cahaya lembut yang berdenyut pelan */}
        <motion.div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-emerald-300/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-50 backdrop-blur">
              <Sparkles size={12} className="text-emerald-200" />
              Panel Admin
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{getGreeting()}, Admin</h1>
            <p className="mt-1.5 text-sm text-emerald-50/75">
              Ringkasan konten website KUA Kecamatan Ngoro · {today}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">
            <p className="text-3xl font-bold leading-none tabular-nums">
              <CountUp value={total} loading={loading} light />
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-50/75">
              Total konten
            </p>
          </div>
        </div>
      </motion.div>

      {/* Baris kartu statistik: jumlah berita, pengumuman, layanan, staf, galeri */}
      <motion.div variants={container} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map(({ key, label, icon: Icon, to }) => (
          <motion.div key={key} variants={item}>
            <MotionLink
              to={to}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="group relative block overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm shadow-emerald-950/5 transition-colors hover:border-emerald-600/40 hover:shadow-lg hover:shadow-emerald-900/10"
            >
              {/* Garis gradasi tipis di atas kartu yang muncul saat hover */}
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-300 transition-transform duration-300 group-hover:scale-x-100" />
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-emerald-900/5 transition-colors group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-emerald-800 group-hover:text-white">
                <Icon size={18} />
              </span>
              <p className="mt-5 text-3xl font-bold leading-none tabular-nums text-slate-900">
                <CountUp value={counts[key as keyof CountState]} loading={loading} />
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{label}</p>
            </MotionLink>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pintasan ke halaman kelola yang paling sering dipakai */}
        <motion.div
          variants={item}
          className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6 lg:col-span-3"
        >
          <h2 className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-900/70">Pintasan</h2>
          <div className="divide-y divide-slate-100">
            {SHORTCUTS.map(({ to, label, hint }) => (
              <MotionLink
                key={to}
                to={to}
                whileHover="hover"
                initial="rest"
                className="group flex items-center justify-between gap-4 py-4"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-800">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>
                </span>
                <motion.span
                  variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white"
                >
                  <ArrowRight size={15} />
                </motion.span>
              </MotionLink>
            ))}
          </div>
        </motion.div>

        {/* Pintasan ke edit Profil KUA (juga tempat sakelar Mode Maintenance) */}
        <motion.div variants={item} className="lg:col-span-2">
          <MotionLink
            to="/admin/profil"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="group relative flex h-full min-h-[200px] flex-col justify-between gap-6 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg shadow-emerald-950/20 transition-shadow hover:shadow-xl hover:shadow-emerald-900/30"
          >
            <GeometricPattern className="absolute inset-0 text-white opacity-[0.07] transition-opacity group-hover:opacity-[0.12]" />
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/15" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur">
              <User size={20} />
            </span>
            <div className="relative">
              <p className="text-sm font-bold">Profil KUA</p>
              <p className="mt-1 text-xs text-emerald-50/75">Edit data kantor, visi-misi, dan jam pelayanan.</p>
            </div>
            <span className="relative flex h-9 w-9 items-center justify-center self-end rounded-full bg-white text-emerald-900 shadow-lg shadow-black/20 transition-transform group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </MotionLink>
        </motion.div>
      </div>
    </motion.div>
  );
}