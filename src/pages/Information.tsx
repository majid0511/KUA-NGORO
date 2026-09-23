import SectionHeading from "../components/SectionHeading";
import InformationCard from "../components/InformationCard";
import FAQ from "../components/FAQ";
import { infoTopics, faqItems } from "../config/information";

export default function Information() {
  return (
    <div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
        <div className="container-page py-14 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-ink)]">
            Informasi Publik
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-ink-soft)] leading-relaxed">
            Informasi umum seputar layanan keagamaan yang ditangani KUA Kecamatan Ngoro.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-5">
          {infoTopics.map((topic) => (
            <InformationCard key={topic.id} topic={topic} />
          ))}
        </div>

        <div className="mt-16">
          <SectionHeading title="Pertanyaan Umum" subtitle="Jawaban singkat untuk pertanyaan yang sering diajukan." />
          <div className="mt-6">
            <FAQ items={faqItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
