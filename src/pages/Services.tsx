import { useState, useEffect } from "react";
import { Landmark, Search, CheckCircle } from "lucide-react";
import { ServiceCard } from "../components/cards/ServiceCard";
import { getLayanan } from "../lib/cms";
import type { Layanan } from "../lib/cms/types";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/CmsState";
import { Modal } from "../components/ui/Modal";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";

export default function Services() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedService, setSelectedService] = useState<Layanan | null>(null);

  const categories = ["Semua", "Utama", "Bimbingan", "Kelembagaan"];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getLayanan();
        if (res.data) setLayananList(res.data);
      } catch {
        setError("Layanan belum dapat dimuat. Silakan coba kembali beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredServices = layananList.filter((svc) => {
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua";

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10 space-y-16">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0f5132] text-xs font-bold uppercase tracking-wider mb-4">
              <Landmark className="w-4 h-4" />
              <span>DIREKTORI PELAYANAN</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Layanan KUA Kecamatan Ngoro
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Panduan lengkap dan persyaratan resmi pelayanan urusan pernikahan, wakaf, kemasjidan, serta bimbingan keluarga bagi warga Kecamatan Ngoro.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="container-kua space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#0f5132] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan KUA..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
            />
          </div>
        </div>

        {/* CMS Loading / Error / Content */}
        {loading && <LoadingState message="Memuat daftar layanan KUA..." />}
        {error && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((svc, idx) => (
                <div key={svc.id} onClick={() => setSelectedService(svc)} className="cursor-pointer">
                  <ServiceCard
                    id={svc.id}
                    number={String(svc.order || idx + 1).padStart(2, "0")}
                    title={svc.title}
                    description={svc.description}
                    iconName={svc.icon}
                  />
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <EmptyState
                message="Belum ada layanan yang tersedia."
                submessage={`Tidak ada layanan yang sesuai dengan kriteria pencarian "${searchQuery}".`}
              />
            )}
          </>
        )}
      </section>

      {/* Detail Modal for Selected Service */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title}
        maxWidth="xl"
      >
        {selectedService && (
          <div className="space-y-6">
            <p className="text-sm text-stone-600 leading-relaxed">
              {selectedService.description}
            </p>

            {selectedService.estimated_time && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-[#0f5132]">
                ⏱ Est. Waktu Penyelesaian: {selectedService.estimated_time}
              </div>
            )}

            {/* Persyaratan */}
            {selectedService.requirements && selectedService.requirements.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-[#0f5132]">
                  Dokumen & Persyaratan:
                </h4>
                <ul className="space-y-2">
                  {selectedService.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prosedur Tahapan */}
            {selectedService.procedure && selectedService.procedure.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-[#0f5132]">
                  Tahapan Prosedur Pelayanan:
                </h4>
                <div className="space-y-2.5">
                  {selectedService.procedure.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f5132] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-normal">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ContactCtaSection />
    </div>
  );
}
