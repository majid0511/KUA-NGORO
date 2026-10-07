import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, MessageSquare } from "lucide-react";
import { NavLinks } from "../navigation/NavLinks";
import { MobileDrawer } from "../navigation/MobileDrawer";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms/profil";
import kuaLogo from "../../assets/kualogo.png";

function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("628")) return digits;

  return digits;
}

export const Navbar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 20;

  const [waNumber, setWaNumber] = useState(profileData.whatsapp);
  const [phone, setPhone] = useState(profileData.phone);

  useEffect(() => {
    getProfil().then((response) => {
      const profil = response.data;

      if (profil?.phone) {
        setPhone(profil.phone);
        setWaNumber(toWaNumber(profil.phone));
      }
    });
  }, []);

  return (
    <>
      {/* Top Banner Notice for Official Institution */}
      <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-100">
        <div className="container-kua flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
            <span className="truncate font-medium">
              Situs Resmi KUA Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur
            </span>
          </div>

          <div className="hidden items-center gap-4 text-xs text-emerald-200 sm:flex">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition hover:text-white"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp: {phone}</span>
            </a>

            <span>•</span>
            <span className="text-emerald-300">
              Jam Kerja: 07.30 - 16.00 WIB
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav-scrolled border-b border-stone-200/80 py-2.5"
            : "glass-nav border-b border-stone-200/40 py-3.5"
        }`}
      >
        <div className="container-kua flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <img src={kuaLogo} alt="KUA Logo" className="h-10 w-10" />

            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-[#0f5132] sm:text-lg">
                KUA Kecamatan Ngoro
              </span>
              <span className="text-xs font-semibold tracking-wide text-stone-500">
                Kabupaten Jombang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <NavLinks />
          </div>

          {/* Right Action CTA & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <Link
              to="/kontak"
              className="hidden items-center gap-2 rounded-xl bg-[#0f5132] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#073822] hover:shadow sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi KUA</span>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="rounded-xl p-2 text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};
