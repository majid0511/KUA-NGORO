import { Info } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center gap-3 border border-dashed border-[var(--color-line)] rounded-xl px-5 py-6 text-sm text-[var(--color-ink-soft)]">
      <Info size={18} className="shrink-0 text-[var(--color-forest)]" />
      <span>{message}</span>
    </div>
  );
}
