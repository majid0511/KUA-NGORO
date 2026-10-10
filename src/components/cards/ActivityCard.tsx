// KARTU KEGIATAN: menampilkan satu foto dokumentasi kegiatan (foto, kategori, tanggal, judul, ringkasan).
// Mengkliknya memanggil onPreview, biasanya untuk membuka foto dalam modal berukuran besar.
import React from "react";
import { Calendar, MapPin, ZoomIn } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";

/**
 * Data satu kegiatan. location opsional; onPreview = fungsi yang dipanggil saat kartu diklik.
 */
interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  location?: string;
  description: string;
  imageUrl: string;
  onPreview?: () => void;
}

/**
 * Kartu foto kegiatan dengan efek terangkat saat disorot kursor dan ikon zoom di atas foto.
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  category,
  date,
  location,
  description,
  imageUrl,
  onPreview,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onPreview}
      className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={title}
          // Gambar baru diunduh saat hampir terlihat di layar (menghemat kuota & mempercepat halaman)
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Lapisan gelap tipis + ikon zoom yang muncul saat kartu disorot kursor */}
        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 text-[#0f5132] flex items-center justify-center shadow-lg">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10">
          {/* Lencana kategori di pojok kiri atas foto */}
          <Badge variant="green">{category}</Badge>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
            {location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {location}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors leading-snug mb-1.5 line-clamp-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
