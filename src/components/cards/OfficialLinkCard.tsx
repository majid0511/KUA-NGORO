import React from "react";
import {
  
  CheckCircle2,
  Landmark,
  Building,
  MapPin,
  HeartHandshake,
  FileCheck,
  Building2,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Data satu tautan portal resmi.
 */
interface OfficialLinkCardProps {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  verified?: boolean;
}

/**
 * Memilih ikon berdasarkan nama ikon dari officialLinksData.
 * Ikon Landmark digunakan sebagai fallback.
 */
const getIcon = (iconName: string) => {
  const iconClass = "h-6 w-6";

  switch (iconName) {
    case "Landmark":
      return <Landmark className={iconClass} />;
    case "Building":
      return <Building className={iconClass} />;
    case "MapPin":
      return <MapPin className={iconClass} />;
    case "HeartHandshake":
      return <HeartHandshake className={iconClass} />;
    case "FileCheck":
      return <FileCheck className={iconClass} />;
    case "Building2":
      return <Building2 className={iconClass} />;
    case "BookOpen":
      return <BookOpen className={iconClass} />;
    default:
      return <Landmark className={iconClass} />;
  }
};

/**
 * Menghapus protokol URL agar alamat lebih ringkas untuk ditampilkan.
 * URL asli tetap digunakan sebagai href.
 */
const formatDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);

    return `${parsedUrl.hostname}${parsedUrl.pathname === "/" ? "" : parsedUrl.pathname}`;
  } catch {
    return url;
  }
};

/**
 * Kartu direktori portal resmi.
 * Membuka alamat eksternal pada tab baru.
 */
export const OfficialLinkCard: React.FC<OfficialLinkCardProps> = ({
  name,
  description,
  url,
  category,
  icon,
  verified = true,
}) => {
  // Menghormati preferensi pengguna yang mengurangi animasi.
  const shouldReduceMotion = useReducedMotion();

  // Menyiapkan URL untuk ditampilkan.
  const domain = formatDomain(url);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka ${name}, portal eksternal`}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex h-full min-h-[230px] flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 sm:p-6"
    >
      {/* Aksen dekoratif di sudut kartu. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-150"
      />

      <div className="relative">
        {/* Ikon portal dan badge verifikasi. */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-900 transition-all duration-300 group-hover:border-emerald-200 group-hover:bg-emerald-100">
            {getIcon(icon)}
          </div>

          {verified && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-800 sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Terverifikasi
            </span>
          )}
        </div>

        {/* Kategori portal. */}
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 sm:text-xs">
          {category}
        </p>

        {/* Nama dan deskripsi portal. */}
        <h3 className="mb-2 text-lg font-bold leading-snug text-stone-900 transition-colors duration-200 group-hover:text-emerald-900">
          {name}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
          {description}
        </p>
      </div>

      {/* Informasi domain dan indikator tautan eksternal. */}
      <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <span
          title={domain}
          className="min-w-0 truncate font-mono text-[11px] text-stone-400 sm:text-xs"
        >
          {domain}
        </span>

        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-emerald-800 transition-colors group-hover:text-emerald-950">
          Kunjungi
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.a>
  );
};
