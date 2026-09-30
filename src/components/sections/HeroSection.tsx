import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import fotoDepan from "../../assets/fotoDepan.webp";

// Jam layanan mengikuti src/data/profile.ts (WIB). Hari libur nasional belum terdeteksi.
const isServiceOpen = (now: Date = new Date()): boolean => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  if (["Mon", "Tue", "Wed", "Thu"].includes(day)) return minutes >= 450 && minutes < 960; // 07.30 - 16.00
  if (day === "Fri") return minutes >= 450 && minutes < 990; // 07.30 - 16.30
  return false; // Sabtu - Minggu
};

export const HeroSection: React.FC = () => {
  const [open, setOpen] = React.useState(isServiceOpen);
  React.useEffect(() => {
    const id = setInterval(() => setOpen(isServiceOpen()), 60_000);
    return () => clearInterval(id);
  }, []);
  const headlineWords = ["KUA", "Kecamatan", "Ngoro"];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: "115%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        mass: 0.8,
      },
    },
  };

  const itemFadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-stone-50/50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/60">
      <div className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Text & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left"
          >
            {/* 1. Eyebrow Badge */}
            <motion.div variants={itemFadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-[#0f5132] text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>KANTOR URUSAN AGAMA • KABUPATEN JOMBANG</span>
            </motion.div>

            {/* 2. Headline with Clip-Path Word Reveal */}
            <div className="overflow-hidden">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                {headlineWords.map((word, idx) => (
                  <span key={idx} className="inline-block overflow-hidden mr-2 sm:mr-3.5 pb-1">
                    <motion.span
                      variants={wordVariants}
                      className={`inline-block ${
                        word === "Ngoro"
                          ? "text-[#0f5132] underline decoration-amber-500/80 decoration-4 underline-offset-8"
                          : ""
                      }`}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            {/* 3. Supporting Text */}
            <motion.p
              variants={itemFadeUp}
              className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              Informasi resmi, pendaftaran nikah online, dan bimbingan pelayanan keagamaan yang akuntabel, mudah diakses, dan dekat untuk seluruh masyarakat Kecamatan Ngoro.
            </motion.p>

            {/* 4. Action CTA Buttons */}
            <motion.div
              variants={itemFadeUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <RouterLink
                to="/layanan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0f5132] text-white hover:bg-[#073822] px-7 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Lihat Layanan</span>
                <ArrowRight className="w-5 h-5" />
              </RouterLink>

              <RouterLink
                to="/kontak"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 px-6 py-3.5 rounded-xl font-semibold text-base transition shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#0f5132]" />
                <span>Hubungi KUA</span>
              </RouterLink>
            </motion.div>

            {/* Quick Micro Features */}
            <motion.div
              variants={itemFadeUp}
              className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left border-t border-stone-200/60 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nikah Gratis di KUA</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nikah Online SIMKAH</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>13 Desa Terlayani</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column Visual Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-100 aspect-[4/3] sm:aspect-[14/10]">
                <img
                  src= {fotoDepan}
                  alt="Pelayanan Kantor Urusan Agama Ngoro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent" />

                <div className="absolute bottom-[4.5rem] left-5 right-5 text-white">
                  <span className="inline-block px-2.5 py-1 rounded bg-amber-600 text-white text-xs font-bold uppercase tracking-wider mb-1.5">
                    Pelayanan Keagamaan
                  </span>
                  <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
                    Kantor Urusan Agama Kecamatan Ngoro
                  </h3>
                  <p className="text-xs text-stone-200 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Jl. Arjuno No.7, Pandean, Ngoro, Jombang</span>
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white border border-stone-200 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold text-xl">
                  13
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium block">Wilayah Kerja</span>
                  <span className="text-sm font-bold text-stone-900 block">Desa se-Kecamatan Ngoro</span>
                </div>
              </div>

              {/* Floating Status Badge */}
              <div
                className={`absolute -top-4 -right-4 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border text-xs font-semibold ${
                  open ? "bg-emerald-950 border-emerald-800" : "bg-stone-800 border-stone-600"
                }`}
              >
                <span className="relative flex w-2.5 h-2.5">
                  {open && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex w-2.5 h-2.5 rounded-full ${open ? "bg-emerald-400" : "bg-stone-400"}`}
                  />
                </span>
                <span>{open ? "Pelayanan Buka" : "Pelayanan Tutup"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
