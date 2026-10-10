// HALAMAN BERANDA (alamat: /). Hanya merakit bagian-bagian (section) secara berurutan dari atas ke bawah;
// isi tiap bagian ada di folder src/components/sections/.
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

/**
 * Halaman Beranda. usePageMeta mengatur judul tab & deskripsi untuk mesin pencari.
 */
export default function Home() {
  usePageMeta({
    title: "Beranda",
    description:
      "Portal informasi dan layanan resmi Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang: berita, pengumuman, dan layanan pernikahan, wakaf, serta bimbingan keagamaan.",
    path: "/",
  });

  return (
    <div className="space-y-0">
      {/* 1. Sambutan utama + foto kantor + status buka/tutup */}
      <HeroSection />
      {/* 2. Pintasan cepat: lokasi, telepon, WhatsApp, jam layanan */}
      <QuickAccessSection />
      {/* 3. Tentang KUA */}
      <AboutSection />
      {/* 4. Daftar layanan (dari database) */}
      <ServicesSection />
      {/* 5. Alur persiapan pernikahan */}
      <MarriageTimelineSection />
      {/* 6. Berita & pengumuman terbaru (dari database) */}
      <NewsSection />
      {/* 7. Dokumentasi kegiatan (dari database) */}
      <ActivitiesSection />
      {/* 8. Tautan portal resmi Kemenag */}
      <OfficialLinksSection />
      {/* 9. Peta & informasi lokasi kantor */}
      <LocationSection />
      {/* 10. Ajakan menghubungi KUA */}
      <ContactCtaSection />
    </div>
  );
}
