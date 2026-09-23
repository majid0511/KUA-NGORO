import type { ReactNode } from "react";

interface ProfileSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function ProfileSection({ id, title, children }: ProfileSectionProps) {
  return (
    <section id={id} className="py-10 md:py-12 border-b border-[var(--color-line)] scroll-mt-20">
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-ink)] mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}
