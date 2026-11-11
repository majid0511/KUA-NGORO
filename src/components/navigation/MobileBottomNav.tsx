// NAVIGASI BAWAH UNTUK HP & TABLET: lima menu utama berbentuk ikon, menempel di bawah layar.
// Menggantikan tombol hamburger + drawer lama. Disembunyikan di layar lebar (lg ke atas) yang memakai menu di Navbar.
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Landmark, HeartHandshake, Newspaper, Phone } from "lucide-react";

// Maksimal 5 menu. "end" = hanya aktif jika alamat persis sama (agar Layanan tidak ikut aktif di /layanan/pernikahan).
const items = [
  { to: "/", label: "Beranda", icon: Home, end: true },
  { to: "/layanan", label: "Layanan", icon: Landmark, end: true },
  { to: "/layanan/pernikahan", label: "Nikah", icon: HeartHandshake, end: false },
  { to: "/informasi", label: "Informasi", icon: Newspaper, end: false },
  { to: "/kontak", label: "Kontak", icon: Phone, end: false },
];

/**
 * Bilah menu bawah. Menu halaman yang sedang dibuka diberi warna hijau + latar bulat di belakang ikonnya.
 */
export const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Menu utama"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
    >
      <ul className="grid grid-cols-5 px-2 py-1.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-bold transition-colors ${
                  isActive ? "text-[#0f5132]" : "text-stone-500 hover:text-stone-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? "bg-emerald-100" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};