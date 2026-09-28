import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { ActivityCard } from "../cards/ActivityCard";
import { activitiesData, type ActivityItem } from "../../data/activities";
import { Modal } from "../ui/Modal";

export const ActivitiesSection: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const featuredActivities = activitiesData.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60">
      <div className="container-kua">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="DOKUMENTASI DOKUMEN"
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

        {/* Editorial Layout: Featured Image + Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredActivities.map((act) => (
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

        {/* Lightbox Detail Modal */}
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
      </div>
    </section>
  );
};
