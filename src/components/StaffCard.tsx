import { UserRound } from "lucide-react";
import type { StaffMember } from "../config/profile";

interface StaffCardProps {
  staff: StaffMember;
}

export default function StaffCard({ staff }: StaffCardProps) {
  return (
    <div className="bg-[var(--color-paper)] border-2 border-[var(--color-line)] rounded-xl p-5 text-center shadow-sm hover:shadow-md hover:border-[var(--color-forest)]/40 transition-all">
      <div className="mx-auto w-24 h-24 rounded-full bg-[var(--color-forest-tint)] grid place-items-center overflow-hidden ring-2 ring-[var(--color-forest)]/20 ring-offset-2 ring-offset-[var(--color-paper)]">
        {staff.photoUrl ? (
          <img src={staff.photoUrl} alt={staff.name} className="w-full h-full object-cover" />
        ) : (
          <UserRound size={32} className="text-[var(--color-forest)]" />
        )}
      </div>
      <p className="mt-4 font-display font-semibold text-[var(--color-ink)]">{staff.name}</p>
      <p className="text-xs text-[var(--color-forest)]">{staff.position}</p>
      {staff.description && (
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {staff.description}
        </p>
      )}
    </div>
  );
}