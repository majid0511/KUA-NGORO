// KARTU TAUTAN RESMI: kartu kecil yang membuka situs resmi (Kemenag, SIMKAH, dll) di tab baru.
import React from "react";
import { ExternalLink, CheckCircle2, Landmark, Building, MapPin, HeartHandshake, FileCheck, Building2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Data satu tautan: nama, deskripsi, alamat (url), kategori, nama ikon, dan penanda terverifikasi.
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
 * Memilih ikon sesuai nama (teks) dari data; nama yang tidak dikenali memakai ikon Landmark sebagai cadangan.
 * Jika menambah ikon baru, tambahkan juga di sini.
 */
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Landmark":
      return <Landmark className="w-5 h-5 text-[#0f5132]" />;
    case "Building":
      return <Building className="w-5 h-5 text-[#0f5132]" />;
    case "MapPin":
      return <MapPin className="w-5 h-5 text-[#0f5132]" />;
    case "HeartHandshake":
      return <HeartHandshake className="w-5 h-5 text-[#0f5132]" />;
    case "FileCheck":
      return <FileCheck className="w-5 h-5 text-[#0f5132]" />;
    case "Building2":
      return <Building2 className="w-5 h-5 text-[#0f5132]" />;
    case "BookOpen":
      return <BookOpen className="w-5 h-5 text-[#0f5132]" />;
    default:
      return <Landmark className="w-5 h-5 text-[#0f5132]" />;
  }
};

/**
 * Kartu tautan. target="_blank" + rel="noopener noreferrer" = buka di tab baru dengan aman.
 */
export const OfficialLinkCard: React.FC<OfficialLinkCardProps> = ({
  name,
  description,
  url,
  category,
  icon,
  verified = true,
}) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className="group bg-white border border-stone-200 hover:border-emerald-700/40 rounded-2xl p-5 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            {getIcon(icon)}
          </div>
          {/* Tanda "Resmi Kemenag" hanya muncul jika tautan sudah terverifikasi */}
          {verified && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resmi Kemenag</span>
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          {category}
        </span>

        <h4 className="text-base font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors mt-0.5 mb-1.5">
          {name}
        </h4>

        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#0f5132]">
        <span className="truncate max-w-[180px] text-stone-400 font-mono">{url.replace("https://", "")}</span>
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.a>
  );
};
