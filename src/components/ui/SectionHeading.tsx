import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  centered = false,
  className = "",
  children,
}) => {
  return (
    <div
      className={`mb-10 md:mb-14 ${
        centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl"
      } ${className}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#0f5132] text-xs font-semibold tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0f5132]" />
          <span>{eyebrow}</span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {description}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
