// NAVBAR (menu atas situs publik): pita info resmi + logo & nama kantor + menu halaman + tombol "Hubungi KUA".
// Di layar kecil menu diganti tombol hamburger yang membuka MobileDrawer. Nomor WhatsApp/telepon diambil dari profil di Supabase.
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, MessageSquare } from "lucide-react";
import { NavLinks } from "../navigation/NavLinks";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms/profil";
import kuaLogo from "../../assets/kualogo.png";

/**
 * Mengubah nomor telepon (mis. "0851-3322-5303") menjadi format yang dipakai tautan WhatsApp wa.me:
 * buang semua karakter selain angka, lalu awalan 0 diganti kode negara 62 (hasil: "6285133225303").
 */
function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("628")) return digits;

  return digits;
}
/**
 * Komponen menu atas. Mengubah gaya (lebih padat & berbayang) setelah halaman di-scroll lebih dari 20 piksel.
 */
export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  // Apakah menu samping (drawer) di HP sedang terbuka
  const scrollPosition = useScrollPosition();
  // True jika halaman sudah digulir > 20 piksel -> header tampil dengan gaya "scrolled"
  // Dua ambang berbeda (histeresis): jadi pill di > 48 px, kembali normal di < 8 px, supaya tidak berkedip
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    setIsScrolled((prev) => (prev ? scrollPosition > 8 : scrollPosition > 48));
  }, [scrollPosition]);

  // Nomor WA & telepon yang ditampilkan; awalnya dari data lokal, lalu diganti data dari database jika ada
  const [waNumber, setWaNumber] = useState(profileData.whatsapp);
  const [phone, setPhone] = useState(profileData.phone);

  useEffect(() => {
    // Ambil profil terbaru dari Supabase; jika nomor telepon terisi, pakai untuk tampilan & tautan WhatsApp
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
      {/* Pita atas: penanda bahwa ini situs resmi instansi + kontak WhatsApp (kontak disembunyikan di HP) */}
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

      {/* Header utama: menempel di atas layar saat discroll (sticky) */}
         <div className="pointer-events-none sticky top-0 z-40 h-[4.4rem]">
      <header
        className={`pointer-events-auto absolute inset-x-0 mx-auto border backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? "top-3 w-[calc(100%-1.5rem)] max-w-[75rem] rounded-[1.75rem] bg-[#0f5132]/95 px-4 py-1.5 border-emerald-800/60 shadow-[0_8px_30px_-8px_rgba(4,41,24,0.25),0_2px_8px_-2px_rgba(4,41,24,0.1)] sm:w-[calc(100%-2.5rem)] sm:px-5"
            : "top-0 w-full max-w-full rounded-none bg-white/90 px-5 py-3.5 sm:px-8 lg:px-10 border-transparent border-b-stone-200/40 shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-[75rem] items-center justify-center lg:justify-between">
          {/* Logo & nama kantor; mengkliknya kembali ke Beranda */}
          <Link
            to="/"
            onClick={() => {
              // Sudah di Beranda: gulung ke atas (pindah dari halaman lain sudah diurus ScrollToTop di App.tsx)
              if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <img
  src={kuaLogo}
  alt="KUA Logo"
  className={`h-10 w-10 rounded-xl transition-all duration-500 ${isScrolled ? "bg-white p-1" : ""}`}
/>

            <div className="flex flex-col">
              <span
  className={`text-base font-bold leading-tight tracking-tight transition-colors duration-500 sm:text-lg ${
    isScrolled ? "text-white" : "text-stone-900 group-hover:text-[#0f5132]"
  }`}
>
                KUA Kecamatan Ngoro
              </span>
              <span
  className={`text-xs font-semibold tracking-wide transition-colors duration-500 ${
    isScrolled ? "text-emerald-200" : "text-stone-500"
  }`}
>
                Kabupaten Jombang
              </span>
            </div>
          </Link>

          {/* Menu halaman untuk layar lebar (disembunyikan di HP/tablet) */}
          <div className="hidden lg:block">
            <NavLinks onDark={isScrolled} />
          </div>

          {/* Sisi kanan: tombol "Hubungi KUA" (layar lebar) dan tombol hamburger (HP) */}
          <div className="flex items-center gap-3">
            <Link
              to="/kontak"
className={`hidden items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-all duration-500 hover:shadow xl:inline-flex ${
  isScrolled
    ? "bg-white text-[#0f5132] hover:bg-emerald-50"
    : "bg-[#0f5132] text-white hover:bg-[#073822]"
}`}            >
              <Phone className="h-4 w-4" />
              <span>Hubungi KUA</span>
            </Link>

            {/* Tombol hamburger: membuka menu samping di layar kecil */}
          
         
          </div>
        </div>
      </header>
      </div>

      
    </>
  );
};
