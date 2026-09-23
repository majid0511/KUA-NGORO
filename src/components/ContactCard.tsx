import type { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export default function ContactCard({ icon: Icon, label, value, href }: ContactCardProps) {
  const hasValue = Boolean(value);
  const content = (
    <>
      <span className="grid place-items-center w-11 h-11 rounded-lg bg-[var(--color-forest-tint)] text-[var(--color-forest)] shrink-0">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-[var(--color-ink)]">
          {hasValue ? value : "Belum tersedia"}
        </p>
      </div>
    </>
  );

  const baseClass = "flex items-start gap-3 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-4";

  if (hasValue && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseClass} hover:border-[var(--color-forest)]`}>
        {content}
      </a>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
