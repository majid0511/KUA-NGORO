interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ title, subtitle, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--color-ink)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--color-ink-soft)] text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
