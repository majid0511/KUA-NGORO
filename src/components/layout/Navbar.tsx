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
    getProfil().then((profil) => {
      if (profil.phone) {
        setPhone(profil.phone);
        setWaNumber(toWaNumber(profil.phone));
      }
    });
  }, []);

  return (
    <>
      {/* Top Banner Notice for Official Institution */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="container-kua flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium truncate">
              Situs Resmi KUA Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-emerald-200 text-xs">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {phone}</span>
            </a>
            <span>•</span>
            <span className="text-emerald-300">Jam Kerja: 07.30 - 16.00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav-scrolled py-2.5 border-b border-stone-200/80"
            : "glass-nav py-3.5 border-b border-stone-200/40"
        }`}
      >
        <div className="container-kua flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            
          <img src={kuaLogo} alt="KUA Logo" className="w-10 h-10" />
              
            

            <div className="flex flex-col">
              <span className="font-bold text-stone-900 text-base sm:text-lg leading-tight tracking-tight group-hover:text-[#0f5132] transition-colors">
                KUA Kecamatan Ngoro
              </span>
              <span className="text-xs font-semibold text-stone-500 tracking-wide">
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
              className="hidden sm:inline-flex items-center gap-2 bg-[#0f5132] text-white hover:bg-[#073822] px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi KUA</span>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-6 h-6" />
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
