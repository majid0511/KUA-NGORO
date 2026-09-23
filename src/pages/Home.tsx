import { Link } from "react-router-dom";
import { ArrowRight, Phone, MapPin, Mail } from "lucide-react";
import Hero from "../components/Hero";
import QuickInfo from "../components/QuickInfo";
import AboutPreview from "../components/AboutPreview";
import SectionHeading from "../components/SectionHeading";
import ServiceGrid from "../components/ServiceGrid";
import WhyPortal from "../components/WhyPortal";
import InformationCard from "../components/InformationCard";
import ActivityCard from "../components/ActivityCard";
import ContactCard from "../components/ContactCard";
import EmptyState from "../components/EmptyState";
import { services } from "../config/services";
import { infoTopics } from "../config/information";
import { profileConfig } from "../config/profile";
import { siteConfig } from "../config/site";

export default function Home() {
  const featuredServices = services.slice(0, 6);
  const featuredTopics = infoTopics.slice(0, 3);
  const featuredActivities = profileConfig.activities.slice(0, 3);

  return (
    <>
      <Hero />
      <QuickInfo />
      <AboutPreview />

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            title="Layanan Resmi"
            subtitle="Akses layanan digital urusan agama dari satu tempat."
          />
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-forest)] hover:text-[var(--color-forest-2)] shrink-0 min-h-[44px]"
          >
            Lihat Semua Layanan
            <ArrowRight size={15} />
          </Link>
        </div>
        <ServiceGrid services={featuredServices} />
      </section>

      <WhyPortal />

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            title="Informasi"
            subtitle="Informasi umum seputar layanan keagamaan yang perlu Anda ketahui."
          />
          <Link
            to="/information"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-forest)] hover:text-[var(--color-forest-2)] shrink-0 min-h-[44px]"
          >
            Lihat Semua Informasi
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featuredTopics.map((topic) => (
            <InformationCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-paper-2)] border-y border-[var(--color-line)]">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            title="Kegiatan"
            subtitle="Program dan kegiatan yang dijalankan KUA Ngoro bagi masyarakat."
          />
          <div className="mt-8">
            {featuredActivities.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {featuredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <EmptyState message="Informasi kegiatan resmi akan ditambahkan setelah data terverifikasi tersedia." />
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionHeading title="Kontak" subtitle="Hubungi KUA Ngoro melalui kanal berikut." />
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <ContactCard icon={MapPin} label="Alamat" value={siteConfig.address} />
          <ContactCard
            icon={Phone}
            label="Telepon"
            value={siteConfig.phone}
            href={siteConfig.phone ? `tel:${siteConfig.phone}` : undefined}
          />
          <ContactCard
            icon={Mail}
            label="Email"
            value={siteConfig.email}
            href={siteConfig.email ? `mailto:${siteConfig.email}` : undefined}
          />
        </div>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-forest)] hover:text-[var(--color-forest-2)] min-h-[44px]"
        >
          Lihat Detail Kontak
          <ArrowRight size={15} />
        </Link>
      </section>
    </>
  );
}
