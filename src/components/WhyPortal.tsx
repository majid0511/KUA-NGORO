import { BookOpenCheck, MapPin, Phone } from "lucide-react";
import SectionHeading from "./SectionHeading";

const points = [
  {
    icon: BookOpenCheck,
    title: "Informasi yang jelas",
    description: "Profil, tugas, dan fungsi KUA Ngoro disampaikan dalam bahasa yang mudah dipahami.",
  },
  {
    icon: MapPin,
    title: "Layanan yang mudah ditemukan",
    description: "Akses layanan resmi urusan agama tanpa perlu mencari-cari ke berbagai situs.",
  },
  {
    icon: Phone,
    title: "Kontak yang terpercaya",
    description: "Informasi kontak dan lokasi resmi tersedia dalam satu halaman.",
  },
];

export default function WhyPortal() {
  return (
    <section className="bg-[var(--color-forest-tint)] border-y border-[var(--color-line)]">
      <div className="container-page py-16 md:py-20">
        <SectionHeading title="Mengapa Portal Ini Hadir" align="center" />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {points.map((point) => (
            <div key={point.title} className="bg-[var(--color-paper)] rounded-xl p-6 border border-[var(--color-line)]">
              <span className="grid place-items-center w-11 h-11 rounded-lg bg-[var(--color-forest)] text-[var(--color-paper)]">
                <point.icon size={20} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-[var(--color-ink)]">
                {point.title}
              </p>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
