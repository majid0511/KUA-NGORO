// FOOTER (bagian bawah situs publik): profil singkat KUA, tautan cepat, tautan instansi induk, kredit pengembang, dan hak cipta.
// Ditampilkan di semua halaman publik (dipasang sekali di App.tsx).
import React from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  ArrowUp,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { profileData } from "../../data/profile";
import kualogo from "../../assets/kualogo.png";

/**
 * Komponen footer, terdiri dari 4 kolom informasi + baris hak cipta di paling bawah.
 */
export const Footer: React.FC = () => {
  // Menggulung halaman ke paling atas dengan halus (dipakai tombol panah di pojok kanan bawah footer)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-emerald-900/80 bg-[#042918] pb-24 pt-12 text-white sm:pb-8 sm:pt-16">
      <div className="container-kua">
        {/* Grid utama footer: 4 kolom (1 kolom di HP, 2 di tablet, 12 bagian di layar lebar) */}
        <div className="grid grid-cols-1 gap-8 border-b border-emerald-900/60 pb-10 md:grid-cols-2 md:gap-10 sm:pb-12 lg:grid-cols-12">
          {/* Kolom 1: logo, nama, dan deskripsi singkat KUA Ngoro */}
          <div className="space-y-4 text-left lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                <img
                  src={kualogo}
                  alt="Logo KUA Kecamatan Ngoro"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
                  KUA Kecamatan Ngoro
                </h3>
                <p className="text-xs font-medium text-emerald-300">
                  {profileData.ministry}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
              Kantor Urusan Agama (KUA) Kecamatan Ngoro bertugas memberikan
              pelayanan pencatatan nikah & rujuk, bimbingan keluarga sakinah,
              pelayanan wakaf, pembinaan kemasjidan, serta bimbingan keagamaan
              bagi masyarakat Kabupaten Jombang.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs font-medium text-emerald-300/90">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Portal Publik Resmi • Kabupaten Jombang</span>
            </div>
          </div>

          {/* Kolom 2: tautan cepat ke halaman utama situs */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/90 sm:text-sm">
              <li>
                <Link
                  to="/"
                  className="inline-block py-1 transition-colors hover:text-white hover:underline"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/profil"
                  className="inline-block py-1 transition-colors hover:text-white hover:underline"
                >
                  Profil
                </Link>
              </li>
              <li>
                <Link
                  to="/layanan"
                  className="inline-block py-1 transition-colors hover:text-white hover:underline"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  to="/informasi"
                  className="inline-block py-1 transition-colors hover:text-white hover:underline"
                >
                  Informasi
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="inline-block py-1 transition-colors hover:text-white hover:underline"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: tautan ke situs resmi instansi induk (Kemenag pusat, provinsi, kabupaten); dibuka di tab baru */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">
              Institution
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90 sm:text-sm">
              <li>
                <a
                  href="https://kemenag.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 py-0.5 leading-snug transition-colors hover:text-white"
                >
                  <span>Kementerian Agama</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://jatim.kemenag.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 py-0.5 leading-snug transition-colors hover:text-white"
                >
                  <span>Kantor Wilayah Kementerian Agama Provinsi Jawa Timur</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://jombang.kemenag.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 py-0.5 leading-snug transition-colors hover:text-white"
                >
                  <span>Kantor Kementerian Agama Kabupaten Jombang</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: kredit pengembang (proyek magang mahasiswa IAI At-Tahdzib) */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>Developer Credit</span>
            </h4>

            <div className="space-y-2 rounded-2xl border border-emerald-800/80 bg-emerald-900/40 p-4 text-xs">
              <p className="leading-relaxed text-emerald-200/80">
                Website developed as an internship project by
              </p>

              <div className="space-y-0.5">
                <p className="text-xs font-bold leading-snug text-white sm:text-sm">
                  Mahasiswa Program Studi Hukum Keluarga (Syariah) est. 2024
                </p>
                <p className="text-xs font-semibold text-emerald-300">
                  IAI At-Tahdzib Jombang
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block rounded-md border border-emerald-700/50 bg-emerald-800/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-200">
                  Internship Project • 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris paling bawah: hak cipta + tombol kembali ke atas */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-emerald-200/80 sm:flex-row sm:pt-8">
          <p className="text-center font-medium sm:text-left">
            © 2026 KUA Kecamatan Ngoro. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:gap-4 sm:text-right">
            <span className="text-xs font-semibold text-emerald-400/80">
              KUA Ngoro Website • Internship Project • 2026
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="rounded-lg border border-emerald-700/50 bg-emerald-900/80 p-2 text-emerald-200 transition-colors hover:bg-emerald-800 hover:text-white"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
