import type { Activity } from "../config/profile";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-5">
      <span className="text-xs font-medium text-[var(--color-forest)] bg-[var(--color-forest-tint)] px-2.5 py-1 rounded-full">
        {activity.category}
      </span>
      <p className="mt-3 font-display text-lg font-semibold text-[var(--color-ink)]">
        {activity.title}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        {activity.description}
      </p>
    </div>
  );
}
