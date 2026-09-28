import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowUp, GraduationCap, ShieldCheck } from "lucide-react";
import { profileData } from "../../data/profile";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#042918] text-white pt-12 sm:pt-16 pb-24 sm:pb-8 border-t border-emerald-900/80">
      <div className="container-kua">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-emerald-900/60">
          
          {/* 1. Brand KUA Ngoro */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg leading-tight text-white">
                  KUA Kecamatan Ngoro
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  {profileData.ministry}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Kantor Urusan Agama (KUA) Kecamatan Ngoro bertugas memberikan pelayanan pencatatan nikah & rujuk, bimbingan keluarga sakinah, pelayanan wakaf, pembinaan kemasjidan, serta bimbingan keagamaan bagi masyarakat Kabupaten Jombang.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-medium text-emerald-300/90">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Portal Publik Resmi • Kabupaten Jombang</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/90">
              <li>
                <Link to="/" className="inline-block py-1 hover:text-white transition-colors hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/profil" className="inline-block py-1 hover:text-white transition-colors hover:underline">
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="inline-block py-1 hover:text-white transition-colors hover:underline">
                  Layanan
                </Link>
              </li>
              <li>
                <Link to="/informasi" className="inline-block py-1 hover:text-white transition-colors hover:underline">
                  Informasi
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="inline-block py-1 hover:text-white transition-colors hover:underline">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Institution */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Institution
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/90">
              <li>
                <a
                  href="https://kemenag.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 py-0.5 hover:text-white transition-colors group leading-snug"
                >
                  <span>Kementerian Agama</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://jatim.kemenag.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 py-0.5 hover:text-white transition-colors group leading-snug"
                >
                  <span>Kantor Wilayah Kementerian Agama Provinsi Jawa Timur</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://jombang.kemenag.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 py-0.5 hover:text-white transition-colors group leading-snug"
                >
                  <span>Kantor Kementerian Agama Kabupaten Jombang</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Developer Credit Box (Subtle Internship Signature) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Developer Credit</span>
            </h4>

            <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/80 space-y-2 text-xs">
              <p className="text-emerald-200/80 leading-relaxed">
                Website developed as an internship project by
              </p>
              <div className="space-y-0.5">
                <p className="font-bold text-white text-xs sm:text-sm leading-snug">
                  Mahasiswa Program Studi Hukum Keluarga (Syariah) est. 2024
                </p>
                <p className="font-semibold text-emerald-300 text-xs">
                  IAI At-Tahdzib Jombang
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-800/60 text-emerald-200 font-mono text-[11px] font-semibold border border-emerald-700/50">
                  Internship Project • 2026
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Copyright Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p className="text-center sm:text-left font-medium">
            © 2026 KUA Kecamatan Ngoro. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-center sm:text-right">
            <span className="text-emerald-400/80 text-xs font-semibold">
              KUA Ngoro Website • Internship Project • 2026
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-emerald-900/80 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors border border-emerald-700/50"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
