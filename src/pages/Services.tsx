import { useMemo, useState } from "react";
import ServiceGrid from "../components/ServiceGrid";
import { services } from "../config/services";

export default function Services() {
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(services.map((s) => s.category)))],
    []
  );
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? services : services.filter((s) => s.category === active);

  return (
    <div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
        <div className="container-page py-14 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-ink)]">
            Layanan Resmi
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-ink-soft)] leading-relaxed">
            Akses layanan digital dan informasi resmi terkait urusan agama.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors min-h-[44px] ${
                active === category
                  ? "bg-[var(--color-forest)] text-[var(--color-paper)] border-[var(--color-forest)]"
                  : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-forest)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <ServiceGrid services={filtered} />
      </div>
    </div>
  );
}
