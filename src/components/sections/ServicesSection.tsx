import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { ServiceCard } from "../cards/ServiceCard";
import { servicesData } from "../../data/services";

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 border-b border-stone-200/60">
      <div className="container-kua">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="PELAYANAN PUBLIK"
            title="Layanan Utama KUA Ngoro"
            description="Informasi dan prosedur resmi layanan keagamaan yang tersedia bagi masyarakat Kecamatan Ngoro."
            className="mb-0"
          />

          <Link
            to="/layanan"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5132] hover:text-[#073822] shrink-0 hover:underline"
          >
            <span>Lihat Seluruh Layanan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              number={service.number}
              title={service.title}
              description={service.shortDesc}
              iconName={service.icon}
              externalUrl={service.externalUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
