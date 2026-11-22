
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  LockKeyhole,
  ArrowRight,
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import kualogo from "../../assets/kualogo.png";
import { AdminInternshipNote } from "../../components/layout/InternshipCredit";

// ==========================================
// ANIMATION PRESETS
// ==========================================

// Animasi masuk untuk elemen.
const entrance = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Animasi berurutan.
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

// Transisi utama.
const smoothTransition = {
  duration: 0.5,
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

// ==========================================
// DECORATIVE COMPONENTS
// ==========================================

/**
 * Pola geometris Islami sebagai dekorasi latar.
 */
function GeometricPattern({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="admin-login-geo"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="12"
            y="12"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />

          <rect
            x="12"
            y="12"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform="rotate(45 24 24)"
          />

          <circle
            cx="24"
            cy="24"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#admin-login-geo)"
      />
    </svg>
  );
}

/**
 * Logo KUA yang digunakan pada panel branding.
 */
function BrandLogo({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <motion.div
      whileHover={mobile ? undefined : { rotate: -4, scale: 1.04 }}
      className={`flex shrink-0 items-center justify-center border border-white/15 bg-white/10 p-2 ${
        mobile
          ? "h-16 w-16 rounded-2xl bg-[#0F5132] shadow-lg shadow-emerald-950/15"
          : "h-12 w-12 rounded-xl"
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

  // ========================================
  // UI STATE
  // ========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Proses autentikasi administrator.
   *
   * Tahapan:
   * 1. Login melalui Supabase Auth.
   * 2. Verifikasi sesi dan identitas pengguna.
   * 3. Periksa apakah pengguna terdaftar sebagai admin.
   * 4. Arahkan pengguna ke dashboard.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Cegah proses login jika Supabase belum tersedia.
    if (!supabase || loading) return;

    const client = supabase;

    setLoading(true);
    setError(null);

    let authenticated = false;

    try {
      // 1. Autentikasi menggunakan email dan password.
      const { error: authError } =
        await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        setError(
          "Email atau kata sandi salah. Silakan coba lagi."
        );
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
      const { data: adminRow, error: adminError } =
        await client
          .from("admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

      // Gagal tertutup jika query gagal atau akun tidak terdaftar.
      if (adminError || !adminRow) {
        setError(
          "Akun ini tidak memiliki akses administrator."
        );
        return;
      }

      // 4. Login berhasil.
      authenticated = false;

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error("[AdminLogin] Login gagal:", error);

      setError(
        "Terjadi gangguan saat menghubungi server."
      );
    } finally {
      // Logout jika autentikasi berhasil tetapi verifikasi gagal.
      if (authenticated) {
        try {
          await client.auth.signOut();
        } catch (signOutError) {
          console.error(
            "[AdminLogin] Gagal membersihkan sesi:",
            signOutError
          );
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

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <LockKeyhole className="h-7 w-7" />
          </div>

          <h1 className="text-lg font-bold text-slate-900">
            Konfigurasi Belum Tersedia
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Supabase belum dikonfigurasi. Periksa
            VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
            pada konfigurasi environment.
          </p>
        </motion.div>
      </main>
    );
  }

  // ========================================
  // LOGIN PAGE
  // ========================================

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />

      <main className="relative grid min-h-screen overflow-hidden bg-[#F5F7F6] lg:grid-cols-2">

        {/* ======================================
            DESKTOP BRANDING PANEL
        ====================================== */}

        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f5132] via-[#0c4429] to-[#073822] p-10 text-white lg:flex xl:p-14">

          {/* Ornamen geometris. */}
          <GeometricPattern className="pointer-events-none absolute inset-0 text-white opacity-[0.055]" />

          {/* Lingkaran dekoratif. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.07]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-white/[0.08]"
          />

          {/* Cahaya emas. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.85, 0.5],
                  }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
            className="relative z-10 flex items-center gap-3"
          >
            <BrandLogo />

            <div>
              <p className="text-sm font-bold tracking-wide">
                KUA KECAMATAN NGORO
              </p>

              <p className="mt-0.5 text-xs text-emerald-200">
                Kabupaten Jombang
              </p>
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
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/[0.08] px-3.5 py-2"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-200" />

              <span className="text-xs font-medium tracking-wide text-emerald-100">
                ADMINISTRATION PORTAL
              </span>
            </motion.div>

            <motion.h1
              variants={entrance}
              transition={smoothTransition}
              className="text-4xl font-extrabold leading-[1.2] tracking-tight xl:text-5xl"
            >
              Satu tempat untuk
              <span className="mt-1 block text-emerald-200">
                mengelola layanan publik.
              </span>
            </motion.h1>

            <motion.p
              variants={entrance}
              transition={smoothTransition}
              className="mt-6 max-w-md text-sm leading-7 text-emerald-100/80 xl:text-base"
            >
              Kelola informasi, berita, pengumuman, layanan,
              data staf, dan dokumentasi KUA Kecamatan Ngoro
              melalui satu panel administrasi.
            </motion.p>

            {/* Daftar fitur. */}
            <motion.div
              variants={staggerContainer}
              className="mt-10 grid grid-cols-2 gap-3"
            >
              {FEATURES.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={entrance}
                  transition={smoothTransition}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -3,
                          backgroundColor:
                            "rgba(255,255,255,0.12)",
                        }
                  }
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0 text-emerald-200" />

                  <span className="text-xs font-medium text-white/90">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer branding. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: 0.5,
            }}
            className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6"
          >
            <p className="text-xs text-emerald-200/70">
              Panel Internal · KUA Kecamatan Ngoro
            </p>

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

          {/* Dekorasi mobile. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl lg:hidden"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl lg:hidden"
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

              <p className="mt-1 text-xs text-slate-500">
                Kabupaten Jombang
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />

                <span className="text-[11px] font-semibold text-emerald-800">
                  ADMINISTRATION PORTAL
                </span>
              </div>
            </motion.div>

            {/* Login card. */}
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 24, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                ...smoothTransition,
                delay: reduceMotion ? 0 : 0.12,
              }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] sm:p-9"
            >
              {/* Aksen emas di bagian atas card. */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0f5132] via-emerald-500 to-amber-400" />

              {/* Judul form. */}
              <div className="mb-8">
                <div className="mb-5 hidden h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0F5132] lg:flex">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <Sparkles size={12} />
                  Admin Access
                </p>

                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Selamat datang
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Masuk menggunakan akun administrator
                  untuk mengelola website KUA Ngoro.
                </p>
              </div>

              {/* Form login. */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email. */}
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: -10 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.25,
                  }}
                  className="space-y-2"
                >
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold tracking-wide text-slate-700"
                  >
                    ALAMAT EMAIL
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    disabled={loading}
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Masukkan email admin"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F5132] focus:bg-white focus:ring-4 focus:ring-emerald-900/[0.06] disabled:opacity-60"
                  />
                </motion.div>

                {/* Password. */}
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: 10 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.32,
                  }}
                  className="space-y-2"
                >
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold tracking-wide text-slate-700"
                  >
                    KATA SANDI
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Masukkan kata sandi"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F5132] focus:bg-white focus:ring-4 focus:ring-emerald-900/[0.06] disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Tampilkan kata sandi"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#0F5132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F5132] disabled:opacity-50"
                    >
                      <AnimatePresence
                        mode="wait"
                        initial={false}
                      >
                        <motion.span
                          key={
                            showPassword ? "hidden" : "visible"
                          }
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  scale: 0.75,
                                }
                          }
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: 0,
                                  scale: 0.75,
                                }
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
                </motion.div>

                {/* Pesan error. */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="login-error"
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, height: 0, y: -6 }
                      }
                      animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { opacity: 0, height: 0, y: -6 }
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

                {/* Tombol submit. */}
                <motion.button
                  type="submit"
                  disabled={
                    loading ||
                    !email.trim() ||
                    !password
                  }
                  whileHover={
                    reduceMotion || loading
                      ? undefined
                      : { scale: 1.012, y: -1 }
                  }
                  whileTap={
                    reduceMotion || loading
                      ? undefined
                      : { scale: 0.985 }
                  }
                  transition={{ duration: 0.16 }}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-[#0B4028] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                  >
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion
                            ? undefined
                            : { opacity: 0, y: -4 }
                        }
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memverifikasi akun...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion
                            ? undefined
                            : { opacity: 0, y: -4 }
                        }
                        className="flex items-center gap-2"
                      >
                        Masuk ke Dashboard

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Informasi keamanan. */}
              <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Akses Terbatas
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Halaman ini hanya dapat diakses oleh
                    administrator yang telah terdaftar dan
                    memiliki izin akses.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Footer halaman login. */}
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.55,
              }}
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
    </>
  );
}
