import { useState } from "react";
import { Camera } from "lucide-react";
import { ActivityCard } from "../components/cards/ActivityCard";
import { activitiesData, type ActivityItem } from "../data/activities";
import { Modal } from "../components/ui/Modal";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";

export default function Activities() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const categories = ["Semua", "Bimbingan", "Pernikahan", "Wakaf", "Penyuluhan", "Kemasjidan", "Kelembagaan"];

  const filteredActivities = activitiesData.filter(
    (act) => selectedCategory === "Semua" || act.category === selectedCategory
  );

  return (
    <div className="py-10 space-y-16">
      {/* Page Header */}
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

      {/* Category Filter Pills */}
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

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <ActivityCard
              key={act.id}
              id={act.id}
              title={act.title}
              category={act.category}
              date={act.date}
              location={act.location}
              description={act.description}
              imageUrl={act.imageUrl}
              onPreview={() => setSelectedActivity(act)}
            />
          ))}
        </div>
      </section>

      {/* Lightbox Preview Modal */}
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
                src={selectedActivity.imageUrl}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
              <span className="font-semibold text-[#0f5132]">
                Kategori: {selectedActivity.category}
              </span>
              <span>Waktu: {selectedActivity.date}</span>
              <span>Lokasi: {selectedActivity.location}</span>
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
