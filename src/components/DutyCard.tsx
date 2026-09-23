import { CheckCircle2 } from "lucide-react";
import type { Duty } from "../config/profile";

interface DutyCardProps {
  duty: Duty;
}

export default function DutyCard({ duty }: DutyCardProps) {
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-5">
      <CheckCircle2 size={20} className="text-[var(--color-forest)]" />
      <p className="mt-3 font-display text-base font-semibold text-[var(--color-ink)]">
        {duty.title}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        {duty.description}
      </p>
    </div>
  );
}
