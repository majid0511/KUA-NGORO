import { siteConfig } from "../config/site";

const items = [
  { label: "Institusi", value: siteConfig.shortName },
  { label: "Kecamatan", value: siteConfig.district },
  { label: "Kabupaten", value: siteConfig.regency },
  { label: "Provinsi", value: siteConfig.province },
];

export default function QuickInfo() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl px-4 py-4"
            >
              <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                {item.label}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-[var(--color-ink)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
