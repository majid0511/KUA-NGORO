
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, User, ImageOff } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "motion/react";

// Data satu berita.
interface NewsCardProps {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: "Pengumuman" | "Berita" | "Artikel";
  date: string;
  author?: string;
  imageUrl: string;
  onClick?: () => void;
}

/**
 * Kartu berita dengan fallback gambar.
 */
export const NewsCard = ({
  id,
  slug,
  title,
  excerpt,
  category,
  date,
  author,
  imageUrl,
  onClick,
}: NewsCardProps) => {
  // Memeriksa apakah URL gambar tersedia dan tidak kosong.
  const hasImage = Boolean(imageUrl?.trim());

  // Menyimpan status jika gambar gagal dimuat.
  const [imageError, setImageError] = useState(false);

  // Menentukan warna badge berdasarkan kategori.
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

  // Mengubah tanggal ke format Indonesia.
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";

    const d = new Date(dateStr);

    // Menghindari tampilan Invalid Date.
    if (Number.isNaN(d.getTime())) return dateStr;

    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Gambar hanya ditampilkan jika URL tersedia dan belum gagal dimuat.
  const showImage = hasImage && !imageError;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      {/* Area gambar berita */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        {showImage ? (
          <img
            src={imageUrl.trim()}
            alt={title || "Gambar berita"}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder ketika gambar tidak tersedia atau gagal dimuat.
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400"
            role="img"
            aria-label="Gambar berita tidak tersedia"
          >
            <ImageOff className="h-9 w-9" strokeWidth={1.5} />
            <span className="text-xs font-medium">
              Gambar tidak tersedia
            </span>
          </div>
        )}

        {/* Badge kategori */}
        <div className="absolute left-3 top-3 z-10">
          <Badge variant={getBadgeVariant(category)}>
            {category}
          </Badge>
        </div>
      </div>

      {/* Konten kartu */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Informasi tanggal dan penulis */}
          <div className="mb-3 flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(date)}
            </span>

            {author && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {author}
              </span>
            )}
          </div>

          {/* Judul berita */}
          <h3 className="mb-2 text-lg font-bold leading-snug text-stone-900 transition-colors group-hover:text-[#0f5132]">
            {title}
          </h3>

          {/* Ringkasan berita */}
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {excerpt}
          </p>
        </div>

        {/* Navigasi detail berita */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm font-semibold text-[#0f5132]">
          {onClick ? (
            <button
              type="button"
              onClick={onClick}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <Link
              to={slug ? `/news/${slug}` : `/informasi#${id}`}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};
