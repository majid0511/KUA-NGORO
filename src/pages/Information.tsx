import { useState, useEffect } from "react";
import { Newspaper, Bell, Phone, Clock } from "lucide-react";
import { SearchInput } from "../components/ui/SearchInput";
import { NewsCard } from "../components/cards/NewsCard";
import { getBerita, getPengumuman } from "../lib/cms";
import type { Berita, Pengumuman } from "../lib/cms/types";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/CmsState";
import { profileData } from "../data/profile";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { Modal } from "../components/ui/Modal";

export default function Information() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedNews, setSelectedNews] = useState<Berita | null>(null);

  const categories = ["Semua", "Pengumuman", "Berita", "Artikel"];

  useEffect(() => {
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
      {/* Page Header */}
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

      {/* Main Content + Sidebar Grid */}
      <section className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area (8 cols desktop) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search & Filter */}
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

            {/* CMS Loading / Error / Content */}
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

          {/* Sidebar Area (4 cols desktop) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Announcement Widget from CMS */}
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

            {/* Office Hours Widget */}
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

            {/* Quick Contact Box */}
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

      {/* Detail News Modal */}
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
