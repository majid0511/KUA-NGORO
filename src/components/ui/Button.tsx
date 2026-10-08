import React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  to?: string;
  href?: string;
  external?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  to,
  href,
  external,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5 min-h-[36px]",
    md: "text-sm px-5 py-2.5 gap-2 min-h-[44px]",
    lg: "text-base px-6 py-3 gap-2.5 min-h-[50px]",
  };

  const variantStyles = {
    primary:
      "bg-[#0f5132] text-white hover:bg-[#073822] active:bg-[#042918] shadow-sm hover:shadow",
    secondary:
      "bg-emerald-100 text-[#0f5132] hover:bg-emerald-200 active:bg-emerald-300 font-semibold",
    outline:
      "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 active:bg-stone-100",
    ghost:
      "text-[#0f5132] hover:bg-emerald-50 active:bg-emerald-100 font-semibold",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={combinedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
};
