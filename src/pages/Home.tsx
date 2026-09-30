import { HeroSection } from "../components/sections/HeroSection";
import { QuickAccessSection } from "../components/sections/QuickAccessSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { MarriageTimelineSection } from "../components/sections/MarriageTimelineSection";
import { NewsSection } from "../components/sections/NewsSection";
import { ActivitiesSection } from "../components/sections/ActivitiesSection";
import { OfficialLinksSection } from "../components/sections/OfficialLinksSection";
import { LocationSection } from "../components/sections/LocationSection";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Home() {
  usePageMeta({
    title: "Beranda",
    description:
      "Portal informasi dan layanan resmi Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang: berita, pengumuman, dan layanan pernikahan, wakaf, serta bimbingan keagamaan.",
    path: "/",
  });

  return (
    <div className="space-y-0">
      <HeroSection />
      <QuickAccessSection />
      <AboutSection />
      <ServicesSection />
      <MarriageTimelineSection />
      <NewsSection />
      <ActivitiesSection />
      <OfficialLinksSection />
      <LocationSection />
      <ContactCtaSection />
    </div>
  );
}
