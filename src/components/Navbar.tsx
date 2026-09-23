import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../config/site";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Profil", to: "/profile" },
  { label: "Layanan", to: "/services" },
  { label: "Informasi", to: "/information" },
  { label: "Kontak", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? "text-[var(--color-forest)] border-[var(--color-forest)]"
        : "text-[var(--color-ink-soft)] border-transparent hover:text-[var(--color-forest)]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-paper)]/90 backdrop-blur border-b border-[var(--color-line)]">
      <nav className="container-page flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            aria-hidden="true"
            className="grid place-items-center w-9 h-9 rounded-full bg-[var(--color-forest)] text-[var(--color-paper)] font-display text-sm font-semibold"
          >
            KN
          </span>
          <span className="font-display text-base font-semibold text-[var(--color-ink)] leading-tight">
            {siteConfig.name}
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--color-line)] bg-[var(--color-paper)] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <div className="container-page py-3 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3.5 text-base font-medium border-b border-[var(--color-line)] last:border-none min-h-[48px] flex items-center ${
                    isActive ? "text-[var(--color-forest)]" : "text-[var(--color-ink)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
