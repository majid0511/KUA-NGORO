// DAFTAR MENU NAVIGASI: tautan ke halaman-halaman utama situs.
// Dipakai di Navbar (mendatar, layar lebar) dan MobileDrawer (menurun, HP).
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Satu menu: label = teks yang tampil, path = alamat halaman tujuan.
 */
export interface NavItem {
  label: string;
  path: string;
}

/**
 * Daftar menu & urutannya. Untuk menambah/mengubah menu, edit daftar ini (dan tambahkan rutenya di App.tsx).
 */
const navItemsList: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Profil", path: "/profil" },
  { label: "Layanan", path: "/layanan" },
  { label: "Pernikahan", path: "/layanan/pernikahan" },
  { label: "Informasi", path: "/informasi" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Kontak", path: "/kontak" },
];

/**
 * className = kelas tambahan, onItemClick = dipanggil saat menu diklik (mis. menutup drawer), vertical = susun ke bawah.
 */
interface NavLinksProps {
  className?: string;
  onItemClick?: () => void;
  vertical?: boolean;
}

/**
 * Menampilkan semua menu. Menu halaman yang sedang dibuka otomatis diberi warna/tebal berbeda (isActive).
 */
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
          // Khusus "Home": hanya aktif jika alamat PERSIS "/" (kalau tidak, Home selalu tampak aktif di semua halaman)
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
