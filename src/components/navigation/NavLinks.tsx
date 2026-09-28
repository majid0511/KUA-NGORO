import React from "react";
import { NavLink } from "react-router-dom";

export interface NavItem {
  label: string;
  path: string;
}

const navItemsList: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Profil", path: "/profil" },
  { label: "Layanan", path: "/layanan" },
  { label: "Pernikahan", path: "/layanan/pernikahan" },
  { label: "Informasi", path: "/informasi" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Kontak", path: "/kontak" },
];

interface NavLinksProps {
  className?: string;
  onItemClick?: () => void;
  vertical?: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  className = "",
  onItemClick,
  vertical = false,
}) => {
  return (
    <nav className={`flex ${vertical ? "flex-col space-y-1" : "items-center space-x-1 lg:space-x-2"} ${className}`}>
      {navItemsList.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          onClick={onItemClick}
          className={({ isActive }) =>
            `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              vertical ? "w-full text-left text-base" : ""
            } ${
              isActive
                ? "text-[#0f5132] bg-emerald-100/70 font-bold"
                : "text-stone-700 hover:text-[#0f5132] hover:bg-stone-100/80"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
