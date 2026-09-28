import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, ArrowUp } from "lucide-react";
import { profileData } from "../../data/profile";
import { officialLinksData } from "../../data/officialLinks";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#042918] text-white pt-16 pb-8 border-t border-emerald-900">
      <div className="container-kua">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-emerald-900/80">
          {/* Column 1: Institution Brand & Profile */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">
                  KUA Kecamatan Ngoro
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  {profileData.ministry}
                </p>
              </div>
            </div>

            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Unit Pelayanan Publik Kementerian Agama RI di tingkat kecamatan yang melayani pencatatan nikah & rujuk, bimbingan keluarga, kemasjidan, serta pembinaan kehidupan keagamaan di Ngoro, Kabupaten Jombang.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Portal Publik Resmi • Berbasis Layanan Digital</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/90">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-white transition">
                  Profil KUA
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-white transition">
                  Layanan KUA
                </Link>
              </li>
              <li>
                <Link to="/layanan/pernikahan" className="hover:text-white transition">
                  Panduan Pernikahan
                </Link>
              </li>
              <li>
                <Link to="/informasi" className="hover:text-white transition">
                  Informasi & Berita
                </Link>
              </li>
              <li>
                <Link to="/kegiatan" className="hover:text-white transition">
                  Dokumentasi Kegiatan
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-white transition">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Kontak & Alamat
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="leading-normal">{profileData.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${profileData.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition font-mono"
                >
                  WhatsApp: {profileData.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${profileData.email}`}
                  className="hover:text-white transition font-mono text-xs truncate"
                >
                  {profileData.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p>{profileData.officeHours.workDays}</p>
                  <p>{profileData.officeHours.fridayHours}</p>
                  <p className="text-emerald-400/80">{profileData.officeHours.weekend}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Link Resmi Kemenag
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/90">
              {officialLinksData.slice(0, 5).map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Subdued Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <p className="text-center sm:text-left">
            © 2026 KUA Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400/70 text-[11px]">
              KUA Ngoro Website • Internship Project 2026
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
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
