// BAGIAN INFORMASI TERBARU di Beranda: menampilkan 3 berita/pengumuman terbaru dari Supabase + tautan ke arsip lengkap (/informasi).
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { motion } from "framer-motion";
import { NewsCard } from "../cards/NewsCard";
import { getBerita } from "../../lib/cms";
import type { Berita } from "../../lib/cms/types";
import { LoadingState, EmptyState } from "../ui/CmsState";

/**
 * Komponen bagian berita: memuat data, lalu menampilkan loading / kosong / grid 3 kartu berita.
 */
export const NewsSection: React.FC = () => {
  // Seluruh berita yang berhasil dimuat
  const [news, setNews] = useState<Berita[]>([]);
  // True selama data masih dimuat
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Muat berita; "cancelled" mencegah update state jika komponen sudah ditutup
    getBerita().then((res) => {
      if (!cancelled && res.data) setNews(res.data);
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hanya 3 berita terbaru (data sudah diurutkan terbaru-di-atas oleh getBerita)
  const latestNews = news.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 border-b border-stone-200/60">
      <div className="container-kua">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="PUSAT INFORMASI"
            title="Informasi Terbaru KUA Ngoro"
            description="Pengumuman resmi, berita kegiatan, dan artikel edukasi seputar layanan keagamaan."
            className="mb-0"
          />

          <Link
            to="/informasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5132] hover:text-[#073822] shrink-0 hover:underline"
          >
            <span>Arsip Informasi Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Memuat informasi terbaru..." />
        ) : latestNews.length === 0 ? (
          <EmptyState message="Belum ada berita atau pengumuman yang tayang." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {latestNews.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              >
              <NewsCard
                id={item.id}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category as "Pengumuman" | "Berita" | "Artikel"}
                date={item.published_at}
                author={item.author}
                imageUrl={item.featured_image}
              />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
