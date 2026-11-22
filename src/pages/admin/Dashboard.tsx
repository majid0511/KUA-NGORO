// DASHBOARD ADMIN (alamat: /admin): ringkasan jumlah konten dan pintasan ke halaman kelola.
// Redesign: tema hijau zamrud KUA + pola geometris Islami, animasi memakai motion/react.
import { useEffect, useState } from 'react';
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
 * Pola bintang delapan sudut ala ornamen geometris Islami, dipakai sebagai latar halus
 */
function GeometricPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="geo-star" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 24 24)" />
          <circle cx="24" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo-star)" />
    </svg>
  );
}

/**
 * Angka yang menghitung naik dari 0 ke nilai akhir. Saat loading tampil kerangka berdenyut.
 * Mengikuti preferensi "kurangi gerakan" milik pengguna.
 */
function CountUp({ value, loading }: { value: number; loading: boolean }) {
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
    return <span className="inline-block h-7 w-10 rounded-md bg-slate-200 animate-pulse align-middle" />;
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
    <motion.div
      className="max-w-5xl space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Banner sambutan: gradasi hijau, pola geometris, dan ringkasan total konten */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f5132] via-[#0c4429] to-[#073822] p-6 sm:p-7 text-white"
      >
        <GeometricPattern className="absolute inset-0 text-white opacity-[0.07]" />
        {/* Cahaya emas lembut yang berdenyut pelan */}
        <motion.div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles size={12} />
              Panel Admin
            </p>
            <h1 className="text-2xl font-bold mt-2">{getGreeting()}, Admin</h1>
            <p className="text-sm text-emerald-100/80 mt-1">
              Ringkasan konten website KUA Kecamatan Ngoro · {today}
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15 px-5 py-3">
            <p className="text-3xl font-bold leading-none tabular-nums">
              <CountUp value={total} loading={loading} />
            </p>
            <p className="text-[11px] font-medium text-emerald-100/80 mt-1.5 uppercase tracking-wide">Total konten</p>
          </div>
        </div>
      </motion.div>

      {/* Baris kartu statistik: jumlah berita, pengumuman, layanan, staf, galeri */}
      <motion.div
        variants={container}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {CARDS.map(({ key, label, icon: Icon, to }) => (
          <motion.div key={key} variants={item}>
            <MotionLink
              to={to}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="group relative block overflow-hidden bg-white border border-slate-200 rounded-xl p-4 hover:border-[#0f5132]/40 hover:shadow-lg hover:shadow-emerald-900/5 transition-colors"
            >
              {/* Garis emas tipis di atas kartu yang muncul saat hover */}
              <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-300 to-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#0f5132] group-hover:bg-[#0f5132] group-hover:text-white transition-colors">
                <Icon size={18} />
              </span>
              <p className="text-2xl font-bold text-slate-900 leading-none mt-4 tabular-nums">
                <CountUp value={counts[key as keyof CountState]} loading={loading} />
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1.5">{label}</p>
            </MotionLink>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Pintasan ke halaman kelola yang paling sering dipakai */}
        <motion.div
          variants={item}
          className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5"
        >
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pintasan</h2>
          <div className="divide-y divide-slate-100">
            {SHORTCUTS.map(({ to, label, hint }) => (
              <MotionLink
                key={to}
                to={to}
                whileHover="hover"
                initial="rest"
                className="flex items-center justify-between gap-4 py-3.5 group"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-800 group-hover:text-[#0f5132] transition-colors">
                    {label}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>
                </span>
                <motion.span
                  variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-[#0f5132] transition-colors"
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
            className="group relative overflow-hidden flex h-full min-h-[190px] flex-col justify-between gap-6 p-5 bg-gradient-to-br from-[#0f5132] to-[#073822] text-white rounded-xl hover:shadow-xl hover:shadow-emerald-900/20 transition-shadow"
          >
            <GeometricPattern className="absolute inset-0 text-white opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 text-amber-300">
              <User size={20} />
            </span>
            <div className="relative">
              <p className="font-semibold text-sm">Profil KUA</p>
              <p className="text-xs text-emerald-200 mt-1">Edit data kantor, visi-misi, dan jam pelayanan.</p>
            </div>
            <ArrowRight
              size={16}
              className="relative text-amber-300 self-end group-hover:translate-x-1 transition-transform"
            />
          </MotionLink>
        </motion.div>
      </div>
    </motion.div>
  );
}