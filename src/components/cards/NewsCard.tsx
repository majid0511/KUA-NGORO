// KARTU BERITA/PENGUMUMAN: menampilkan foto, kategori, tanggal, penulis, judul, dan ringkasan satu berita.
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";

/**
 * Data satu berita. onClick (opsional): jika diberikan, tombol "Baca Selengkapnya" memanggil fungsi ini
 * (mis. membuka modal); jika tidak, tombol menjadi tautan ke halaman Informasi.
 */
interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: "Pengumuman" | "Berita" | "Artikel";
  date: string;
  author?: string;
  imageUrl: string;
  onClick?: () => void;
}

/**
 * Kartu berita dengan efek terangkat saat disorot kursor.
 */
export const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  excerpt,
  category,
  date,
  author,
  imageUrl,
  onClick,
}) => {
  // Menentukan warna lencana menurut kategori: Pengumuman = emas, Berita = hijau, Artikel = biru, lainnya = abu
  const getBadgeVariant = (cat: string) => {
    switch (cat) {
      case "Pengumuman":
        return "gold";
      case "Berita":
        return "green";
      case "Artikel":
        return "blue";
      default:
        return "gray";
    }
  };

  // Mengubah tanggal (mis. 2026-10-09) menjadi format Indonesia ("9 Oktober 2026"); jika gagal diubah, tampilkan apa adanya
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={getBadgeVariant(category)}>{category}</Badge>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(date)}
            </span>
            {author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {author}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors leading-snug mb-2">
            {title}
          </h3>

          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-sm font-semibold text-[#0f5132]">
          {/* Dua bentuk tombol "Baca Selengkapnya": tombol biasa (jika ada onClick) atau tautan ke /informasi */}
          {onClick ? (
            <button onClick={onClick} className="inline-flex items-center gap-1.5 hover:underline">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link to={`/informasi#${id}`} className="inline-flex items-center gap-1.5 hover:underline">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};
