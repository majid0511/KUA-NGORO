// NAVBAR (menu atas situs publik): pita info resmi + logo & nama kantor + menu halaman + tombol "Hubungi KUA".
// Di layar kecil menu diganti tombol hamburger yang membuka MobileDrawer. Nomor WhatsApp/telepon diambil dari profil di Supabase.
//
// Transisi header (bar penuh -> pill mengambang) mengikuti posisi gulir secara kontinu, bukan sakelar on/off:
// - Satu nilai "progress" (0..1) dihitung dari scrollY lalu dihaluskan dengan spring.
// - Nilai itu ditulis ke CSS variable --p pada elemen header, dan semua ukuran (posisi, lebar, radius, padding)
//   dihitung dengan calc() dari --p. Tidak ada transition CSS yang saling berebut, tidak ada re-render React per frame.
// - Warna latar & bayangan tidak dianimasikan langsung; dua lapis latar di-crossfade lewat opacity (ringan untuk GPU).
// - Posisi logo dijaga tetap selama transisi, jadi konten tidak "melompat".
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, MessageSquare } from "lucide-react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { NavLinks } from "../navigation/NavLinks";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms/profil";
import kuaLogo from "../../assets/kualogo.png";

// Rentang gulir (px) tempat header berubah bertahap dari bar penuh menjadi pill.
// Dimulai setelah pita info (±28 px) hilang, yaitu saat header mulai menempel di atas layar.
const SCROLL_RANGE = [24, 104];

// Untuk pengguna yang memilih "kurangi gerakan": berubah seketika di satu titik.
const SNAP_RANGE = [48, 49];

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
 * Komponen menu atas. Header berubah bertahap menjadi pill berbayang seiring halaman digulir.
 */
export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  // progress: 0 = bar penuh di puncak halaman, 1 = pill mengambang. Dihaluskan dengan spring (tanpa memantul).
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, reduceMotion ? SNAP_RANGE : SCROLL_RANGE, [0, 1]);
  const spring = useSpring(raw, {
    stiffness: 220,
    damping: 32,
    mass: 0.7,
    restDelta: 0.0005,
    restSpeed: 0.0005,
  });
  const progress = reduceMotion ? raw : spring;

  const headerRef = useRef<HTMLElement | null>(null);
  // Status "sudah jadi pill" dipakai untuk warna teks & NavLinks; ambang berbeda (histeresis) agar tidak berkedip
  const pillRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Tulis progress ke --p langsung ke DOM (tanpa render ulang), dan perbarui status pill hanya saat berubah
  const sync = useCallback((value: number) => {
    headerRef.current?.style.setProperty("--p", value.toFixed(4));

    const next = pillRef.current ? value > 0.35 : value > 0.55;
    if (next !== pillRef.current) {
      pillRef.current = next;
      setIsScrolled(next);
    }
  }, []);

  // Selaraskan nilai awal sebelum layar digambar (mis. halaman dimuat ulang saat posisi sudah di tengah)
  useLayoutEffect(() => {
    sync(progress.get());
  }, [progress, sync]);

  useMotionValueEvent(progress, "change", sync);

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
          ref={headerRef}
          style={{ "--p": 0 } as React.CSSProperties}
          // Semua ukuran memakai calc() dari --p (0 = bar penuh, 1 = pill):
          // top 0 -> 0.75rem | lebar 100% -> 100% dikurangi margin | lebar maks 100% -> 77.5rem
          // radius 0 -> 1.75rem | padding horizontal & vertikal mengecil.
          // Padding horizontal + margin pill dijaga konstan di layar lebar, sehingga logo tidak bergeser.
          className="pointer-events-auto absolute inset-x-0 top-[calc(var(--p)_*_0.75rem)] mx-auto w-[calc(100%_-_var(--p)_*_1.5rem)] max-w-[calc(100%_-_var(--p)_*_(100%_-_77.5rem))] rounded-[calc(var(--p)_*_1.75rem)] px-[calc(1.25rem_-_var(--p)_*_0.25rem)] py-[calc(0.875rem_-_var(--p)_*_0.5rem)] backdrop-blur-md sm:w-[calc(100%_-_var(--p)_*_2.5rem)] sm:px-[calc(2rem_-_var(--p)_*_0.75rem)] lg:px-[calc(2.5rem_-_var(--p)_*_1.25rem)]"
        >
          {/* Lapisan latar: dua lapis di-crossfade. Lapis 1 = bar putih transparan, lapis 2 = pill hijau berbayang */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent border-b-stone-200/40 bg-white/90 opacity-[calc(1_-_var(--p))]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-emerald-800/60 bg-[#0f5132]/95 opacity-[var(--p)] shadow-[0_8px_30px_-8px_rgba(4,41,24,0.25),0_2px_8px_-2px_rgba(4,41,24,0.1)]"
          />

          <div className="relative mx-auto flex max-w-[75rem] items-center justify-center lg:justify-between">
            {/* Logo & nama kantor; mengkliknya kembali ke Beranda */}
            <Link
              to="/"
              onClick={() => {
                // Sudah di Beranda: gulung ke atas (pindah dari halaman lain sudah diurus ScrollToTop di App.tsx)
                if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center gap-3 focus:outline-none"
            >
              {/* Bingkai putih di belakang logo ikut muncul bertahap bersama progress */}
              <img
                src={kuaLogo}
                alt="KUA Logo"
                className="h-10 w-10 rounded-xl bg-[color:rgb(255_255_255_/_var(--p))] p-[calc(var(--p)_*_0.25rem)]"
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
                className={`hidden items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-colors duration-500 hover:shadow xl:inline-flex ${
                  isScrolled
                    ? "bg-white text-[#0f5132] hover:bg-emerald-50"
                    : "bg-[#0f5132] text-white hover:bg-[#073822]"
                }`}
              >
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