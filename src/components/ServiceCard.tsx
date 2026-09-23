import {
  ArrowUpRight,
  HeartHandshake,
  Landmark,
  Building2,
  BookOpenText,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "../config/services";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  Landmark,
  Building2,
  BookOpenText,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] ?? Link2;
  const isLinkable = service.verified && service.url !== "#";

  const content = (
    <>
      <div className="flex items-start justify-between">
        <span className="grid place-items-center w-11 h-11 rounded-lg bg-[var(--color-forest-tint)] text-[var(--color-forest)]">
          <IconComponent size={20} />
        </span>
        {isLinkable && (
          <ArrowUpRight size={18} className="text-[var(--color-ink-soft)] group-hover:text-[var(--color-forest)] transition-colors" />
        )}
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-[var(--color-ink)]">
        {service.name}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        {service.description}
      </p>
      <span className="mt-4 inline-block text-xs font-medium text-[var(--color-forest)] bg-[var(--color-forest-tint)] px-2.5 py-1 rounded-full">
        {service.category}
      </span>
      {!isLinkable && (
        <p className="mt-3 text-xs text-[var(--color-ink-soft)] italic">
          Tautan resmi belum tersedia
        </p>
      )}
    </>
  );

  const baseClass =
    "group block h-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-5 transition-colors";

  if (isLinkable) {
    return (
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} hover:border-[var(--color-forest)]`}
      >
        {content}
      </a>
    );
  }

  return <div className={`${baseClass} opacity-80 cursor-not-allowed`}>{content}</div>;
}
