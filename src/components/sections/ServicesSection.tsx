import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { motion } from "framer-motion";
import { ServiceCard } from "../cards/ServiceCard";
import { getLayanan } from "../../lib/cms";
import type { Layanan } from "../../lib/cms/types";
import { LoadingState, EmptyState } from "../ui/CmsState";

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getLayanan().then((res) => {
      if (!cancelled && res.data) setServices(res.data);
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

        {loading ? (
          <LoadingState message="Memuat layanan..." />
        ) : services.length === 0 ? (
          <EmptyState message="Belum ada layanan yang aktif." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              >
              <ServiceCard
                id={service.slug}
                number={String(service.order).padStart(2, "0")}
                title={service.title}
                description={service.description}
                iconName={service.icon}
                detailUrl={`/layanan#${service.slug}`}
              />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
