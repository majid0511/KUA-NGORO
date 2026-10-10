// BAGIAN AJAKAN MENGHUBUNGI (call-to-action): pita hijau berisi ajakan "Butuh Informasi Lebih Lanjut?"
// dengan tombol ke halaman Kontak dan tombol chat WhatsApp. Dipasang di bagian bawah banyak halaman.
import React from "react";
import { Link } from "react-router-dom";
import { Phone, MessageSquare } from "lucide-react";
import { profileData } from "../../data/profile";

/**
 * Komponen ajakan menghubungi KUA. Nomor WhatsApp diambil dari data profil lokal.
 */
export const ContactCtaSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#042918] via-[#0f5132] to-[#042918] text-white relative overflow-hidden">
      {/* Hiasan: kilau cahaya halus di pojok kanan atas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="container-kua relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Butuh Informasi Lebih Lanjut?
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
          Tim pelayanan KUA Kecamatan Ngoro siap membantu menjawab pertanyaan seputar nikah, wakaf, kemasjidan, dan bimbingan keagamaan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/kontak"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#0f5132] hover:bg-emerald-50 px-7 py-3.5 rounded-xl font-bold text-base transition shadow-lg hover:shadow-xl"
          >
            <Phone className="w-5 h-5 text-[#0f5132]" />
            <span>Hubungi KUA</span>
          </Link>

          <a
            href={`https://wa.me/${profileData.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/30 px-7 py-3.5 rounded-xl font-bold text-base transition shadow-md"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            <span>Konsultasi WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
