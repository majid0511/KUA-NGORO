import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { profileData } from "../../data/profile";
import { SectionHeading } from "../ui/SectionHeading";
import fotoNikah from "../../assets/fotonikah.webp";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60">
      <div className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-lg bg-stone-100 aspect-[4/3]">
              <img
                src={fotoNikah}
                alt="Kantor KUA Ngoro Melayani Masyarakat"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

              <div className="absolute bottom-6 sm:bottom-28 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  KUA Kecamatan Ngoro
                </span>
                <p className="text-sm sm:text-base font-semibold text-stone-100">
                  Melayani 13 Desa se-Kecamatan Ngoro, Kabupaten Jombang
                </p>
              </div>
            </div>

            {/* Accent badge */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-[#0f5132] text-white p-5 rounded-2xl shadow-xl max-w-xs flex-col space-y-1">
              <span className="text-2xl font-extrabold text-amber-400">PPAIW & SIMKAH</span>
              <span className="text-xs font-medium text-emerald-100">
                Pencatatan Nikah, Wakaf, & Bimbingan Keagamaan Resmi
              </span>
            </div>
          </motion.div>

          {/* Right Column Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
            <SectionHeading
              eyebrow="TENTANG KUA"
              title="Melayani Masyarakat, Membina Kehidupan Keagamaan"
              className="mb-4"
            />

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {profileData.aboutShort}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0f5132] shrink-0 mt-0.5" />
                <span className="text-stone-800 font-medium text-sm sm:text-base">
                  Pelayanan Pendaftaran Nikah Gratis di KUA pada hari & jam kerja.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0f5132] shrink-0 mt-0.5" />
                <span className="text-stone-800 font-medium text-sm sm:text-base">
                  Fasilitasi Sertifikasi Ikrar Wakaf (AIW/APAIW) & Pengukuran Kiblat.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0f5132] shrink-0 mt-0.5" />
                <span className="text-stone-800 font-medium text-sm sm:text-base">
                  Pembinaan Bimbingan Perkawinan (Bimwin) & Konseling BP4.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 bg-emerald-100 text-[#0f5132] hover:bg-[#0f5132] hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-xs"
              >
                <span>Selengkapnya Tentang KUA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
