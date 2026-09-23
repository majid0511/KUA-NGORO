import EmptyState from "./EmptyState";

interface VisionMissionProps {
  vision: string;
  missions: string[];
}

export default function VisionMission({ vision, missions }: VisionMissionProps) {
  if (!vision && missions.length === 0) {
    return <EmptyState message="Visi dan misi resmi belum tersedia. Bagian ini akan diperbarui setelah data terverifikasi." />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-[var(--color-forest)] text-[var(--color-paper)] rounded-xl p-7">
        <p className="text-xs uppercase tracking-wide text-[var(--color-paper)]/60">Visi</p>
        <p className="mt-3 font-display text-xl leading-relaxed">
          {vision || "Belum tersedia."}
        </p>
      </div>
      <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-7">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">Misi</p>
        {missions.length > 0 ? (
          <ol className="mt-3 space-y-3">
            {missions.map((mission, index) => (
              <li key={index} className="flex gap-3 text-sm text-[var(--color-ink)]">
                <span className="font-display font-semibold text-[var(--color-forest)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{mission}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-ink-soft)] italic">Belum tersedia.</p>
        )}
      </div>
    </div>
  );
}
