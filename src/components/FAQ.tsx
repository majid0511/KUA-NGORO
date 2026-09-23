import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../config/information";

interface FAQProps {
  items: FaqItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden bg-[var(--color-paper)]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="font-medium text-[var(--color-ink)] text-sm md:text-base">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[var(--color-forest)] transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div id={`faq-panel-${item.id}`} className="px-5 pb-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
