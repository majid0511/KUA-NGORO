import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "gold" | "gray" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "green",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    green: "bg-emerald-100 text-[#0f5132] border-emerald-200",
    gold: "bg-amber-100 text-amber-800 border-amber-200",
    gray: "bg-stone-100 text-stone-700 border-stone-200",
    blue: "bg-sky-100 text-sky-800 border-sky-200",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-sm font-medium",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
