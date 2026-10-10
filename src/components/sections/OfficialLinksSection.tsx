// BAGIAN TAUTAN RESMI di Beranda: kumpulan kartu yang mengarah ke portal resmi Kemenag dan aplikasi terkait.
// Daftar tautan diambil dari data/officialLinks.ts.
import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { OfficialLinkCard } from "../cards/OfficialLinkCard";
import { officialLinksData } from "../../data/officialLinks";

/**
 * Menampilkan semua tautan resmi sebagai grid kartu (1/2/3 kolom sesuai lebar layar).
 */
export const OfficialLinksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 border-b border-stone-200/60">
      <div className="container-kua">
        <SectionHeading
          eyebrow="TORTAL KEMENTERIAN"
          title="Tautan Portal Resmi Kemenag"
          description="Akses langsung menuju portal instansi resmi Kementerian Agama Republik Indonesia dan ekosistem aplikasi digital."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {officialLinksData.map((link) => (
            <OfficialLinkCard
              key={link.id}
              name={link.name}
              description={link.description}
              url={link.url}
              category={link.category}
              icon={link.icon}
              verified={link.verified}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
