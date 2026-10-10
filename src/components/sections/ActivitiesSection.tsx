// BAGIAN KEGIATAN di Beranda: menampilkan 4 foto dokumentasi kegiatan terbaru dari tabel "galeri" di Supabase.
// Mengklik foto membuka detailnya dalam modal. Jika galeri kosong, tampil pesan "belum ada dokumentasi".
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { ActivityCard } from "../cards/ActivityCard";
import { getGaleri } from "../../lib/cms";
import type { Galeri } from "../../lib/cms/types";
import { Modal } from "../ui/Modal";
import { LoadingState, EmptyState } from "../ui/CmsState";

/**
 * Komponen bagian kegiatan: memuat data galeri, lalu menampilkan loading / kosong / grid kartu.
 */
export const ActivitiesSection: React.FC = () => {
  // Seluruh foto galeri yang berhasil dimuat
  const [items, setItems] = useState<Galeri[]>([]);
  // True selama data masih dimuat (menampilkan indikator loading)
  const [loading, setLoading] = useState(true);
  // Foto yang sedang dibuka di modal (null = modal tertutup)
  const [selected, setSelected] = useState<Galeri | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Muat galeri; "cancelled" mencegah update state jika komponen sudah ditutup
    getGaleri().then((res) => {
      if (!cancelled && res.data) setItems(res.data);
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hanya 4 foto pertama (terbaru) yang ditampilkan di Beranda
  const featured = items.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60">
      <div className="container-kua">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="DOKUMENTASI KEGIATAN"
            title="Kegiatan & Pembinaan KUA"
            description="Dokumentasi pelayanan pernikahan, bimbingan keagamaan, dan pembinaan masyarakat di Kecamatan Ngoro."
            className="mb-0"
          />

          <Link
            to="/kegiatan"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5132] hover:text-[#073822] shrink-0 hover:underline"
          >
            <span>Galeri Kegiatan Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Memuat dokumentasi kegiatan..." />
        ) : featured.length === 0 ? (
          <EmptyState message="Belum ada dokumentasi kegiatan yang ditambahkan." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              >
                <ActivityCard
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  date={item.published_at}
                  description={item.description}
                  imageUrl={item.image}
                  onPreview={() => setSelected(item)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal detail foto: gambar besar, kategori, tanggal, dan deskripsi */}
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={selected?.title}
          maxWidth="2xl"
        >
          {selected && (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-stone-100">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-semibold text-[#0f5132]">
                  Kategori: {selected.category}
                </span>
                <span>Tanggal: {selected.published_at}</span>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed pt-2">
                {selected.description}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};
