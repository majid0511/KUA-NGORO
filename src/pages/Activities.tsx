// HALAMAN GALERI KEGIATAN (alamat: /kegiatan): semua foto dokumentasi dari tabel "galeri" di Supabase,
// dengan filter kategori (Kegiatan, Pelayanan, Acara, Lainnya) dan tampilan foto besar dalam modal.
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { ActivityCard } from "../components/cards/ActivityCard";
import { getGaleri } from "../lib/cms";
import type { Galeri } from "../lib/cms/types";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/CmsState";
import { Modal } from "../components/ui/Modal";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * Halaman galeri. Alur: muat data -> tampilkan loading/error/grid -> klik foto membuka modal.
 */
export default function Activities() {
  usePageMeta({
    title: "Galeri Kegiatan",
    description:
      "Dokumentasi kegiatan dan pelayanan Kantor Urusan Agama Kecamatan Ngoro.",
    path: "/kegiatan",
  });

  // Semua foto galeri yang dimuat
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  // True selama data sedang dimuat
  const [loading, setLoading] = useState(true);
  // Pesan kesalahan jika galeri gagal dimuat (null = tidak ada masalah)
  const [error, setError] = useState<string | null>(null);

  // Kategori filter yang sedang dipilih ("Semua" = tanpa filter)
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  // Foto yang sedang dibuka di modal (null = modal tertutup)
  const [selectedActivity, setSelectedActivity] = useState<Galeri | null>(null);

  // Daftar tombol filter; nilainya harus sama dengan pilihan kategori di form admin galeri
  const categories = ["Semua", "Kegiatan", "Pelayanan", "Acara", "Lainnya"];

  useEffect(() => {
    // Memuat galeri dari Supabase (atau data cadangan); error ditangkap agar halaman tidak rusak
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getGaleri();
        if (res.data) setGaleriList(res.data);
      } catch {
        setError("Galeri kegiatan belum dapat dimuat. Silakan coba kembali.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Foto yang lolos filter kategori yang dipilih
  const filteredActivities = galeriList.filter(
    (act) => selectedCategory === "Semua" || act.category === selectedCategory
  );

  return (
    <div className="py-10 space-y-16">
      {/* Kepala halaman: judul & penjelasan singkat */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0f5132] text-xs font-bold uppercase tracking-wider mb-4">
              <Camera className="w-4 h-4" />
              <span>DOKUMENTASI DOKUMEN</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Galeri Kegiatan KUA Ngoro
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Dokumentasi foto kegiatan pelayanan pernikahan, pembinaan calon pengantin, bimbingan penyuluhan agama, dan kunjungan lapangan KUA Kecamatan Ngoro.
            </p>
          </div>
        </div>
      </section>

      {/* Tombol filter kategori + daftar foto */}
      <section className="container-kua space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#0f5132] text-white shadow-xs"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status data: sedang memuat / gagal / siap ditampilkan */}
        {loading && <LoadingState message="Memuat galeri kegiatan KUA..." />}
        {error && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <ActivityCard
                  key={act.id}
                  id={act.id}
                  title={act.title}
                  category={act.category}
                  date={act.published_at}
                  description={act.description}
                  imageUrl={act.image}
                  onPreview={() => setSelectedActivity(act)}
                />
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <EmptyState
                message="Belum ada dokumentasi galeri yang tersedia."
                submessage={`Tidak ada foto pada kategori "${selectedCategory}".`}
              />
            )}
          </>
        )}
      </section>

      {/* Modal pratinjau foto besar saat sebuah kartu diklik */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title}
        maxWidth="2xl"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-stone-100">
              <img
                src={selectedActivity.image}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
              <span className="font-semibold text-[#0f5132]">
                Kategori: {selectedActivity.category}
              </span>
              <span>Tanggal: {selectedActivity.published_at}</span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed pt-2">
              {selectedActivity.description}
            </p>
          </div>
        )}
      </Modal>

      <ContactCtaSection />
    </div>
  );
}
