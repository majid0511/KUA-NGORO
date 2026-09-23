import type { InfoTopic } from "../config/information";

interface InformationCardProps {
  topic: InfoTopic;
}

export default function InformationCard({ topic }: InformationCardProps) {
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl p-5">
      <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{topic.title}</p>
      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        {topic.summary}
      </p>
      {topic.body ? (
        <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">{topic.body}</p>
      ) : (
        <p className="mt-3 text-xs italic text-[var(--color-ink-soft)]">Belum ada informasi.</p>
      )}
    </div>
  );
}
