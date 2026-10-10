// HALAMAN INFORMASI (alamat: /informasi): pusat berita, artikel, dan pengumuman resmi KUA dari Supabase.
// Ada pencarian teks + filter kategori; di sisi kanan ada widget pengumuman resmi, jam pelayanan, dan kontak WhatsApp.
import { useState, useEffect } from "react";
import { Newspaper, Bell, Phone, Clock } from "lucide-react";
import { SearchInput } from "../components/ui/SearchInput";
import { NewsCard } from "../components/cards/NewsCard";
import { getBerita, getPengumuman } from "../lib/cms";
import type { Berita, Pengumuman } from "../lib/cms/types";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/CmsState";
import { profileData } from "../data/profile";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { Modal } from "../components/ui/Modal";

/**
 * Halaman informasi. Alur: muat berita & pengumuman -> saring -> tampilkan kartu -> klik untuk membaca di modal.
 */
export default function Information() {
  usePageMeta({
    title: "Informasi & Berita",
    description:
      "Pengumuman resmi, berita kegiatan, dan artikel edukasi dari KUA Kecamatan Ngoro.",
    path: "/informasi",
  });

  // Semua berita/artikel yang dimuat (kolom kiri)
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  // Pengumuman yang masih berlaku (widget kanan)
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  // True selama data sedang dimuat
  const [loading, setLoading] = useState(true);
  // Pesan kesalahan jika gagal memuat (null = tidak ada masalah)
  const [error, setError] = useState<string | null>(null);

  // Teks yang diketik di kotak pencarian
  const [searchQuery, setSearchQuery] = useState("");
  // Kategori filter yang dipilih ("Semua" = tanpa filter)
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  // Berita yang sedang dibuka di modal (null = modal tertutup)
  const [selectedNews, setSelectedNews] = useState<Berita | null>(null);

  // Daftar tombol filter kategori; harus sama dengan pilihan kategori di form admin berita
  const categories = ["Semua", "Pengumuman", "Berita", "Artikel"];

  useEffect(() => {
    // Muat berita dan pengumuman bersamaan (Promise.all); error ditangkap agar halaman tidak rusak
    async function loadCmsData() {
      setLoading(true);
      setError(null);
      try {
        const [beritaRes, pengumumanRes] = await Promise.all([
          getBerita(),
          getPengumuman(),
        ]);
        if (beritaRes.data) setBeritaList(beritaRes.data);
        if (pengumumanRes.data) setPengumumanList(pengumumanRes.data);
      } catch {
        setError("Informasi belum dapat dimuat. Silakan coba kembali beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    }
    loadCmsData();
  }, []);

  // Berita yang cocok dengan kata kunci (judul/ringkasan) DAN kategori yang dipilih
  const filteredNews = beritaList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10 space-y-16">
      {/* Kepala halaman */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0f5132] text-xs font-bold uppercase tracking-wider mb-4">
              <Newspaper className="w-4 h-4" />
              <span>PUSAT INFORMASI PUBLIK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Informasi & Berita KUA Ngoro
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Kumpulan pengumuman resmi, berita pelayanan keagamaan, dan artikel edukasi dari Kantor Urusan Agama Kecamatan Ngoro.
            </p>
          </div>
        </div>
      </section>

      {/* Grid utama: daftar berita (kiri, 8 bagian) + sidebar (kanan, 4 bagian) */}
      <section className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Kolom kiri: pencarian, filter, dan daftar kartu berita */}
          <div className="lg:col-span-8 space-y-8">
            {/* Kotak pencarian + tombol filter kategori */}
            <div className="space-y-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari pengumuman, berita, atau artikel..."
              />

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
            </div>

            {/* Status data: sedang memuat / gagal / siap ditampilkan */}
            {loading && <LoadingState message="Memuat daftar berita & pengumuman..." />}
            {error && <ErrorState message={error} />}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredNews.map((item) => (
                    <NewsCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      excerpt={item.excerpt}
                      category={item.category as any}
                      date={item.published_at}
                      author={item.author}
                      imageUrl={item.featured_image}
                      onClick={() => setSelectedNews(item)}
                    />
                  ))}
                </div>

                {filteredNews.length === 0 && (
                  <EmptyState
                    message="Belum ada informasi yang tersedia."
                    submessage={`Tidak ada informasi yang sesuai dengan filter atau kata kunci "${searchQuery}".`}
                  />
                )}
              </>
            )}
          </div>

          {/* Kolom kanan (sidebar): tiga widget */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Widget 1: 3 pengumuman resmi terbaru; jika kosong tampil pengingat pendaftaran nikah */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                <Bell className="w-5 h-5 text-amber-700" />
                <span>Pengumuman Resmi ({pengumumanList.length})</span>
              </div>

              {pengumumanList.length > 0 ? (
                <div className="space-y-3 divide-y divide-amber-200/60">
                  {pengumumanList.slice(0, 3).map((p) => (
                    <div key={p.id} className="pt-2 first:pt-0">
                      <h4 className="font-bold text-xs text-amber-950">{p.title}</h4>
                      <p className="text-xs text-amber-900/90 leading-relaxed mt-0.5 line-clamp-2">
                        {p.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Pendaftaran nikah wajib diajukan minimal 10 hari kerja sebelum akad.
                </p>
              )}
            </div>

            {/* Widget 2: jam pelayanan kantor */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base pb-3 border-b border-stone-100">
                <Clock className="w-5 h-5 text-[#0f5132]" />
                <span>Jam Pelayanan Kantor</span>
              </div>
              <div className="text-xs space-y-2 text-stone-700 font-medium">
                <p className="flex justify-between">
                  <span>Senin - Kamis:</span>
                  <span className="font-bold text-stone-900">07.30 - 16.00 WIB</span>
                </p>
                <p className="flex justify-between">
                  <span>Jumat:</span>
                  <span className="font-bold text-stone-900">07.30 - 16.30 WIB</span>
                </p>
                <p className="flex justify-between text-stone-400">
                  <span>Sabtu & Minggu:</span>
                  <span className="font-bold">Tutup</span>
                </p>
              </div>
            </div>

            {/* Widget 3: tombol chat WhatsApp resmi KUA */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-base">
                <Phone className="w-5 h-5" />
                <span>Layanan Informasi Fast-Response</span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Butuh kejelasan berkas nikah atau konsultasi? Hubungi WhatsApp resmi KUA Ngoro.
              </p>
              <a
                href={`https://wa.me/${profileData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl transition"
              >
                <span>Chat WhatsApp: {profileData.phone}</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Modal detail berita: gambar, kategori, tanggal, penulis, ringkasan, dan isi lengkap */}
      <Modal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title}
        maxWidth="2xl"
      >
        {selectedNews && (
          <div className="space-y-4">
            {selectedNews.featured_image && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={selectedNews.featured_image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-stone-500 border-b border-stone-100 pb-3">
              <span className="font-semibold text-[#0f5132]">{selectedNews.category}</span>
              <span>{selectedNews.published_at}</span>
              <span>Penulis: {selectedNews.author}</span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              {selectedNews.excerpt}
            </p>

            <div className="text-sm text-stone-800 leading-relaxed pt-2 space-y-3">
              <p className="whitespace-pre-line">{selectedNews.content}</p>
            </div>
          </div>
        )}
      </Modal>

      <ContactCtaSection />
    </div>
  );
}
