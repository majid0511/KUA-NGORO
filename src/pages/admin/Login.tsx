import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  LockKeyhole,
  Mail,
  ArrowRight,
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  Sparkles,
  TriangleAlert,
  Clock,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import kualogo from "../../assets/kualogo.png";
import { AdminInternshipNote } from "../../components/layout/InternshipCredit";

// ==========================================
// ANIMATION PRESETS
// ==========================================

// Animasi masuk untuk elemen.
const entrance = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// Animasi berurutan.
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// Teks judul muncul dari balik garis (efek "mask reveal").
const lineReveal = {
  hidden: { y: "110%" },
  visible: { y: 0 },
};

// Transisi utama.
const smoothTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

// ==========================================
// STATIC DATA
// ==========================================

// Fitur yang tersedia pada panel admin.
const FEATURES = [
  { icon: Newspaper, label: "Berita & Informasi" },
  { icon: LayoutDashboard, label: "Manajemen Konten" },
  { icon: Users, label: "Data Personalia" },
  { icon: ImageIcon, label: "Galeri Dokumentasi" },
];

// Gaya dasar kolom input (dipakai email dan kata sandi).
const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F5132] focus:bg-white focus:ring-4 focus:ring-emerald-900/[0.06] disabled:opacity-60";

// ==========================================
// LOGIN ERROR HELPER
// ==========================================

const GENERIC_LOGIN_ERROR = "Email atau kata sandi salah. Silakan coba lagi.";

/**
 * Menentukan pesan error saat login gagal: email yang salah atau kata sandi yang salah.
 * Supabase sendiri hanya membalas "invalid credentials" untuk keduanya, jadi email
 * dicek lewat fungsi database admin_email_exists (lihat SQL-nya di catatan).
 * Jika fungsi belum dibuat atau gagal dipanggil, pesan umum yang dipakai.
 */
async function describeLoginFailure(
  client: NonNullable<typeof supabase>,
  email: string
): Promise<string> {
  try {
    const { data, error } = await client.rpc("admin_email_exists", {
      p_email: email,
    });

    if (error) return GENERIC_LOGIN_ERROR;

    return data
      ? "Kata sandi salah, coba lagi."
      : "Email salah, silakan coba lagi.";
  } catch {
    return GENERIC_LOGIN_ERROR;
  }
}

// ==========================================
// DECORATIVE COMPONENTS
// ==========================================

/**
 * Pola geometris Islami sebagai dekorasi latar.
 */
function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern
          id="admin-login-geo"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="12" y="12" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 24 24)" />
          <circle cx="24" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#admin-login-geo)" />
    </svg>
  );
}

/**
 * Ornamen bintang berlapis berukuran besar. Diputar sangat pelan sebagai
 * titik fokus visual di panel branding.
 */
function StarOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {[0, 45].map((deg) => (
        <rect key={`outer-${deg}`} x="100" y="100" width="200" height="200" transform={`rotate(${deg} 200 200)`} />
      ))}
      {[0, 45].map((deg) => (
        <rect key={`inner-${deg}`} x="140" y="140" width="120" height="120" transform={`rotate(${deg} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="150" />
      <circle cx="200" cy="200" r="190" strokeDasharray="2 7" />
      <circle cx="200" cy="200" r="28" />
    </svg>
  );
}

/**
 * Logo KUA dalam bingkai lengkung (arch) ala mihrab.
 */
function BrandLogo({ mobile = false }: { mobile?: boolean }) {
  return (
    <motion.div
      whileHover={mobile ? undefined : { rotate: -3, scale: 1.05 }}
      className={`flex shrink-0 items-center justify-center border p-2 ${
        mobile
          ? "h-[72px] w-14 rounded-t-full rounded-b-xl border-emerald-900/10 bg-[#0F5132] pt-3 shadow-lg shadow-emerald-950/15"
          : "h-14 w-11 rounded-t-full rounded-b-lg border-white/20 bg-white/10 pt-2.5"
      }`}
    >
      <img
        src={kualogo}
        alt="Logo KUA Kecamatan Ngoro"
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}

/**
 * Jam dan tanggal berjalan (WIB). Dipisah jadi komponen sendiri supaya
 * pembaruan tiap detik tidak membuat seluruh halaman login dirender ulang.
 */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-amber-300 ring-1 ring-white/15">
        <Clock className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-bold tabular-nums leading-none text-white">
          {time.replace(/\./g, ":")} <span className="text-[10px] font-semibold text-amber-300">WIB</span>
        </p>
        <p className="mt-1 text-[11px] text-emerald-200/80">{date}</p>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

/**
 * Halaman login administrator KUA Kecamatan Ngoro.
 *
 * Menggunakan:
 * - Supabase Auth untuk autentikasi.
 * - Tabel admins untuk pemeriksaan hak akses.
 * - Motion untuk animasi.
 * - Responsive layout untuk desktop dan mobile.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  // ========================================
  // FORM STATE
  // ========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // True saat Caps Lock menyala ketika mengetik kata sandi.
  const [capsLock, setCapsLock] = useState(false);

  // ========================================
  // UI STATE
  // ========================================

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Minta mesin pencari tidak mengindeks halaman login. Dipasang lewat DOM
  // langsung agar berfungsi di semua versi React.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  /**
   * Proses autentikasi administrator.
   *
   * Tahapan:
   * 1. Login melalui Supabase Auth.
   * 2. Verifikasi sesi dan identitas pengguna.
   * 3. Periksa apakah pengguna terdaftar sebagai admin.
   * 4. Tampilkan status sukses sebentar, lalu arahkan ke dashboard.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Cegah proses login jika Supabase belum tersedia.
    if (!supabase || loading || success) return;

    const client = supabase;

    setLoading(true);
    setError(null);

    let authenticated = false;

    try {
      // 1. Autentikasi menggunakan email dan password.
      const { error: authError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(await describeLoginFailure(client, email.trim()));
        return;
      }

      authenticated = true;

      // 2. Verifikasi identitas pengguna melalui server.
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      if (userError || !user) {
        setError("Sesi login tidak dapat diverifikasi.");
        return;
      }

      // 3. Periksa apakah pengguna terdaftar sebagai admin.
      const { data: adminRow, error: adminError } = await client
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Gagal tertutup jika query gagal atau akun tidak terdaftar.
      if (adminError || !adminRow) {
        setError("Akun ini tidak memiliki akses administrator.");
        return;
      }

      // 4. Login berhasil: tampilkan status sukses sejenak sebelum pindah halaman.
      authenticated = false;
      setSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : 650));

      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("[AdminLogin] Login gagal:", error);

      setError("Terjadi gangguan saat menghubungi server.");
    } finally {
      // Logout jika autentikasi berhasil tetapi verifikasi gagal.
      if (authenticated) {
        try {
          await client.auth.signOut();
        } catch (signOutError) {
          console.error("[AdminLogin] Gagal membersihkan sesi:", signOutError);
        }
      }

      setLoading(false);
    }
  }

  // ========================================
  // SUPABASE CONFIGURATION CHECK
  // ========================================

  if (!supabase) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7F6] px-5">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-400" />

          <div className="mx-auto mb-5 flex h-16 w-14 items-center justify-center rounded-t-full rounded-b-xl bg-amber-50 text-amber-600">
            <LockKeyhole className="h-7 w-7" />
          </div>

          <h1 className="text-lg font-bold text-slate-900">
            Konfigurasi Belum Tersedia
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan
            VITE_SUPABASE_ANON_KEY pada konfigurasi environment.
          </p>
        </motion.div>
      </main>
    );
  }

  // ========================================
  // LOGIN PAGE
  // ========================================

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#F5F7F6] lg:grid-cols-[1.05fr_1fr]">
      {/* ======================================
          DESKTOP BRANDING PANEL
      ====================================== */}

      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f5132] via-[#0c4429] to-[#073822] p-10 text-white lg:flex xl:p-14">
        {/* Ornamen geometris. */}
        <GeometricPattern className="pointer-events-none absolute inset-0 text-white opacity-[0.05]" />

        {/* Ornamen bintang besar yang berputar pelan di pojok kanan bawah. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -right-48 h-[620px] w-[620px] text-amber-300/25"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
        >
          <StarOrnament className="h-full w-full" />
        </motion.div>

        {/* Cahaya emas. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-3xl"
        />

        {/* Identitas KUA. */}
        <motion.div
          variants={entrance}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          transition={smoothTransition}
          className="relative z-10 flex items-center gap-4"
        >
          <BrandLogo />

          <div>
            <p className="text-sm font-bold tracking-wide">KUA KECAMATAN NGORO</p>
            <p className="mt-0.5 text-xs text-emerald-200">Kabupaten Jombang</p>
          </div>
        </motion.div>

        {/* Konten utama branding. */}
        <motion.div
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="relative z-10 my-14 max-w-lg"
        >
          <motion.div
            variants={entrance}
            transition={smoothTransition}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-white/[0.08] px-3.5 py-2"
          >
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-medium tracking-wide text-emerald-100">
              ADMINISTRATION PORTAL
            </span>
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight xl:text-5xl">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineReveal} transition={smoothTransition} className="block">
                Satu tempat untuk
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span
                variants={lineReveal}
                transition={smoothTransition}
                className="block bg-gradient-to-r from-emerald-200 to-amber-200 bg-clip-text text-transparent"
              >
                mengelola layanan publik.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={entrance}
            transition={smoothTransition}
            className="mt-6 max-w-md text-sm leading-7 text-emerald-100/80 xl:text-base"
          >
            Kelola informasi, berita, pengumuman, layanan, data staf, dan
            dokumentasi KUA Kecamatan Ngoro melalui satu panel administrasi.
          </motion.p>

          {/* Daftar fitur. */}
          <motion.div variants={staggerContainer} className="mt-10 grid grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={entrance}
                transition={smoothTransition}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, backgroundColor: "rgba(255,255,255,0.12)" }
                }
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur-sm transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300/15 text-amber-300">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-xs font-medium text-white/90">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer branding. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.7, duration: 0.5 }}
          className="relative z-10 flex items-end justify-between gap-4 border-t border-white/10 pt-6"
        >
          <LiveClock />

          <div className="flex items-center gap-2 text-xs text-emerald-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Official Administration
          </div>
        </motion.div>
      </section>

      {/* ======================================
          LOGIN FORM PANEL
      ====================================== */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-10 xl:px-16">
        {/* Dekorasi latar. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
        />

        <div className="relative w-full max-w-md">
          {/* Branding mobile. */}
          <motion.div
            variants={entrance}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            transition={smoothTransition}
            className="mb-9 flex flex-col items-center text-center lg:hidden"
          >
            <BrandLogo mobile />

            <h1 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">
              KUA Kecamatan Ngoro
            </h1>
            <p className="mt-1 text-xs text-slate-500">Kabupaten Jombang</p>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-[11px] font-semibold text-emerald-800">
                ADMINISTRATION PORTAL
              </span>
            </div>
          </motion.div>

          {/* Login card. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...smoothTransition, delay: reduceMotion ? 0 : 0.12 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.18)] sm:p-9"
          >
            {/* Aksen emas di bagian atas card. */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0f5132] via-emerald-500 to-amber-400" />

            {/* Pola halus di pojok card. */}
            <GeometricPattern className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-[#0F5132] opacity-[0.05]" />

            {/* Judul form. */}
            <div className="relative mb-8">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles size={12} />
                Admin Access
              </p>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Selamat datang
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Masuk menggunakan akun administrator untuk mengelola website KUA
                Ngoro.
              </p>
            </div>

            {/* Kolom form bergetar saat login gagal. */}
            <motion.div
              animate={
                error && !reduceMotion
                  ? { x: [0, -8, 8, -5, 5, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="relative space-y-5">
                {/* Email. */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.25 }}
                  className="space-y-2"
                >
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold tracking-wide text-slate-700"
                  >
                    ALAMAT EMAIL
                  </label>

                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0F5132]" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      disabled={loading || success}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Masukkan email admin"
                      className={INPUT_CLASS}
                    />
                  </div>
                </motion.div>

                {/* Password. */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.32 }}
                  className="space-y-2"
                >
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold tracking-wide text-slate-700"
                  >
                    KATA SANDI
                  </label>

                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0F5132]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      disabled={loading || success}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={(event) =>
                        setCapsLock(event.getModifierState("CapsLock"))
                      }
                      onKeyUp={(event) =>
                        setCapsLock(event.getModifierState("CapsLock"))
                      }
                      onBlur={() => setCapsLock(false)}
                      placeholder="Masukkan kata sandi"
                      className={`${INPUT_CLASS} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      disabled={loading || success}
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Tampilkan kata sandi"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#0F5132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F5132] disabled:opacity-50"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={showPassword ? "hidden" : "visible"}
                          initial={
                            reduceMotion ? false : { opacity: 0, scale: 0.75 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          exit={
                            reduceMotion ? undefined : { opacity: 0, scale: 0.75 }
                          }
                          transition={{ duration: 0.15 }}
                          className="flex"
                        >
                          {showPassword ? (
                            <EyeOff className="h-[18px] w-[18px]" />
                          ) : (
                            <Eye className="h-[18px] w-[18px]" />
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>

                  {/* Peringatan Caps Lock. */}
                  <AnimatePresence initial={false}>
                    {capsLock && (
                      <motion.p
                        key="caps"
                        initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-center gap-1.5 overflow-hidden text-[11px] font-medium text-amber-700"
                      >
                        <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                        Caps Lock sedang menyala.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Pesan error. */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="login-error"
                      initial={
                        reduceMotion ? false : { opacity: 0, height: 0, y: -6 }
                      }
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={
                        reduceMotion ? undefined : { opacity: 0, height: 0, y: -6 }
                      }
                      transition={{ duration: 0.2 }}
                      role="alert"
                      aria-live="polite"
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        <p className="text-xs font-medium leading-relaxed text-red-700">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tombol submit: tiga keadaan (siap, memverifikasi, berhasil). */}
                <motion.button
                  type="submit"
                  disabled={loading || success || !email.trim() || !password}
                  whileHover={
                    reduceMotion || loading || success
                      ? undefined
                      : { scale: 1.012, y: -1 }
                  }
                  whileTap={
                    reduceMotion || loading || success
                      ? undefined
                      : { scale: 0.985 }
                  }
                  transition={{ duration: 0.16 }}
                  className={`group flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/20 disabled:cursor-not-allowed ${
                    success
                      ? "bg-emerald-600"
                      : "bg-[#0F5132] hover:bg-[#0B4028] disabled:opacity-60"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {success ? (
                      <motion.span
                        key="success"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Berhasil, mengalihkan...
                      </motion.span>
                    ) : loading ? (
                      <motion.span
                        key="loading"
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memverifikasi akun...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        Masuk ke Dashboard
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>

            {/* Informasi keamanan. */}
            <div className="relative mt-7 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

              <div>
                <p className="text-xs font-bold text-slate-800">Akses Terbatas</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Halaman ini hanya dapat diakses oleh administrator yang telah
                  terdaftar dan memiliki izin akses.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer halaman login. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.55 }}
            className="mt-7 space-y-3 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Sistem autentikasi administrator
            </div>

            <AdminInternshipNote className="text-center" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}