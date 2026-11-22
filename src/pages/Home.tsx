// HALAMAN BERANDA (alamat: /).
// Menggabungkan seluruh section beranda secara berurutan.
// Motion digunakan untuk animasi masuk yang ringan ketika section terlihat.

import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

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

// Variasi animasi masuk untuk setiap section.
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Halaman Beranda.
 * Mengatur metadata SEO dan urutan seluruh section.
 */
export default function Home() {
  // Menghormati pengaturan pengguna yang mengurangi animasi.
  const shouldReduceMotion = useReducedMotion();

  // Mengatur judul tab dan deskripsi untuk mesin pencari.
  usePageMeta({
    title: "Beranda",
    description:
      "Portal informasi dan layanan resmi Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang: berita, pengumuman, dan layanan pernikahan, wakaf, serta bimbingan keagamaan.",
    path: "/",
  });

  // Pembungkus animasi section.
  const Section = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    // Jika pengguna memilih reduced motion, tampilkan section tanpa animasi.
    if (shouldReduceMotion) {
      return <>{children}</>;
    }

    return (
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="space-y-0">
      {/* 1. Sambutan utama + foto kantor + status buka/tutup. */}
      <HeroSection />

      {/* 2. Pintasan cepat: lokasi, telepon, WhatsApp, jam layanan. */}
      <Section>
        <QuickAccessSection />
      </Section>

      {/* 3. Tentang KUA. */}
      <Section>
        <AboutSection />
      </Section>

      {/* 4. Daftar layanan dari database. */}
      <Section>
        <ServicesSection />
      </Section>

      {/* 5. Alur persiapan pernikahan. */}
      <Section>
        <MarriageTimelineSection />
      </Section>

      {/* 6. Berita dan pengumuman terbaru dari database. */}
      <Section>
        <NewsSection />
      </Section>

      {/* 7. Dokumentasi kegiatan dari database. */}
      <Section>
        <ActivitiesSection />
      </Section>

      {/* 8. Tautan portal resmi Kemenag. */}
      <Section>
        <OfficialLinksSection />
      </Section>

      {/* 9. Peta dan informasi lokasi kantor. */}
      <Section>
        <LocationSection />
      </Section>

      {/* 10. Ajakan menghubungi KUA. */}
      <Section>
        <ContactCtaSection />
      </Section>
    </div>
  );
}
