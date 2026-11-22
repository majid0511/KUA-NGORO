
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import fotoDepan from "../../assets/fotodepan.webp";

// Jam pelayanan menggunakan zona waktu WIB.
// Senin-Kamis: 07.30-16.00.
// Jumat: 07.30-16.30.
// Sabtu-Minggu: tutup.
// Hari libur nasional belum diperhitungkan.
const isServiceOpen = (now: Date = new Date()): boolean => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  // Mengambil nilai hari, jam, dan menit dari hasil formatter.
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  // Senin sampai Kamis.
  if (["Mon", "Tue", "Wed", "Thu"].includes(day)) {
    return minutes >= 450 && minutes < 960;
  }

  // Jumat.
  if (day === "Fri") {
    return minutes >= 450 && minutes < 990;
  }

  // Sabtu dan Minggu.
  return false;
};

// Animasi masuk untuk elemen hero.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Animasi elemen dari bawah ke atas.
const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

// Animasi gambar.
const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/**
 * HeroSection merupakan bagian utama halaman beranda.
 * Menampilkan identitas KUA, akses layanan, foto kantor,
 * informasi wilayah kerja, dan status pelayanan.
 */
export const HeroSection: React.FC = () => {
  // Menghitung status pelayanan berdasarkan jam WIB.
  const [open, setOpen] = useState(() => isServiceOpen());

  // Menghormati pengaturan pengguna yang mengurangi animasi.
  const shouldReduceMotion = useReducedMotion();

  // Memperbarui status pelayanan setiap satu menit.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setOpen(isServiceOpen());
    }, 60_000);

    // Membersihkan interval ketika komponen dilepas.
    return () => window.clearInterval(intervalId);
  }, []);

  // Mengatur animasi tanpa mengabaikan preferensi aksesibilitas.
  const initialAnimation = shouldReduceMotion ? false : "hidden";

  return (
    <section className="relative isolate overflow-hidden border-b border-stone-200/70 bg-gradient-to-br from-emerald-50 via-white to-stone-50">
      {/* Dekorasi latar belakang. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
      />

      <div className="container-kua relative py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">

          {/* BAGIAN KIRI: IDENTITAS DAN AKSES LAYANAN. */}
          <motion.div
            variants={containerVariants}
            initial={initialAnimation}
            animate="visible"
            className="space-y-7 text-center lg:col-span-7 lg:text-left"
          >
            {/* Label identitas institusi. */}
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-emerald-900 shadow-sm backdrop-blur-sm sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>KANTOR URUSAN AGAMA KABUPATEN JOMBANG</span>
            </motion.div>

            {/* Headline utama. */}
            <motion.div variants={fadeUpVariants}>
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                Melayani dengan
                <span className="mt-1 block text-emerald-800">
                  Amanah dan
                </span>
                <span className="block text-emerald-800">
                  Profesional.
                </span>
              </h1>

              <p className="mt-5 text-lg font-semibold text-stone-700 sm:text-xl">
                KUA Kecamatan Ngoro
              </p>
            </motion.div>

            {/* Deskripsi singkat. */}
            <motion.p
              variants={fadeUpVariants}
              className="mx-auto max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg lg:mx-0"
            >
              Portal informasi resmi dan akses layanan Kantor Urusan Agama
              Kecamatan Ngoro. Mendekatkan pelayanan pernikahan, wakaf,
              dan bimbingan keagamaan kepada masyarakat.
            </motion.p>

            {/* Tombol navigasi utama. */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col justify-center gap-3 pt-1 sm:flex-row lg:justify-start"
            >
              <RouterLink
                to="/layanan"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-emerald-900 px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/15 transition duration-300 hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
              >
                Lihat Layanan
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </RouterLink>

              <RouterLink
                to="/kontak"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-7 py-4 text-base font-semibold text-stone-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                <Phone className="h-5 w-5 text-emerald-800" />
                Hubungi KUA
              </RouterLink>
            </motion.div>

            {/* Keunggulan dan informasi singkat. */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-1 gap-3 border-t border-stone-200 pt-6 text-left sm:grid-cols-3"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                <span>Layanan Nikah</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                <span>SIMKAH Online</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                <span>13 Desa Terlayani</span>
              </div>
            </motion.div>
          </motion.div>

          {/* BAGIAN KANAN: FOTO KANTOR DAN INFORMASI PELAYANAN. */}
          <motion.div
            variants={imageVariants}
            initial={initialAnimation}
            animate="visible"
            className="relative mx-auto w-full max-w-xl lg:col-span-5 lg:max-w-none"
          >
            {/* Bingkai foto kantor. */}
            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-stone-200 shadow-2xl shadow-emerald-950/10">
              <div className="aspect-[4/3] sm:aspect-[5/4]">
                <img
                  src={fotoDepan}
                  alt="Tampak depan Kantor Urusan Agama Kecamatan Ngoro"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Gradasi untuk keterbacaan teks foto. */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/10 to-transparent" />

              {/* Keterangan kantor di atas foto. */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
                <span className="mb-3 inline-flex rounded-md bg-amber-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white sm:text-xs">
                  Pelayanan Keagamaan
                </span>

                <h2 className="text-xl font-bold leading-snug sm:text-2xl">
                  Kantor Urusan Agama Kecamatan Ngoro
                </h2>

                <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-stone-200 sm:text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    Jl. Arjuno No. 7, Pandean, Ngoro, Jombang
                  </span>
                </p>
              </div>
            </div>

            {/* Informasi wilayah kerja. */}
            <div className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3 shadow-xl sm:-left-6 sm:p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl font-extrabold text-emerald-900">
                13
              </div>

              <div>
                <p className="text-xs font-medium text-stone-500">
                  Wilayah Kerja
                </p>
                <p className="text-sm font-bold text-stone-900">
                  Desa se-Kecamatan Ngoro
                </p>
              </div>
            </div>

            {/* Status pelayanan otomatis. */}
            <div
              role="status"
              aria-live="polite"
              title="Status dihitung berdasarkan jam kerja WIB dan belum memperhitungkan hari libur nasional."
              className={`absolute -right-2 -top-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold text-white shadow-xl sm:-right-5 ${
                open
                  ? "border-emerald-800 bg-emerald-950"
                  : "border-stone-700 bg-stone-800"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    open ? "bg-emerald-400" : "bg-stone-400"
                  }`}
                />
              </span>

              <span>
                {open ? "Pelayanan Buka" : "Pelayanan Tutup"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Catatan transparansi status pelayanan. */}
        <div className="mt-12 flex items-center justify-center gap-2 text-center text-xs text-stone-500 lg:mt-16">
          <Clock3 className="h-4 w-4 shrink-0" />
          <span>
            Status pelayanan berdasarkan jadwal kerja WIB, belum memperhitungkan hari libur nasional.
          </span>
        </div>
      </div>
    </section>
  );
};
