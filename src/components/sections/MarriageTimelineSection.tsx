// BAGIAN ALUR PERNIKAHAN di Beranda: lima langkah persiapan nikah ditampilkan sebagai garis waktu
// (mendatar di layar lebar, menurun di HP) + tombol menuju panduan pernikahan lengkap. Data dari data/marriage.ts.
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { marriageSteps } from "../../data/marriage";

/**
 * Komponen garis waktu langkah pernikahan; tiap kartu muncul bergantian saat discroll ke layar.
 */
export const MarriageTimelineSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60 overflow-hidden">
      <div className="container-kua">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold tracking-wider uppercase mb-3">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <span>ALUR CALON PENGANTIN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Persiapan Pernikahan di KUA
          </h2>

          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
            Tahapan mudah pendaftaran dan pengurusan pernikahan resmi bagi calon pengantin di Kecamatan Ngoro.
          </p>
        </div>

        {/* Garis waktu: mendatar di layar lebar, menurun di HP */}
        <div className="relative">
          {/* Garis penghubung antar kartu (hanya di layar lebar) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-emerald-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {/* Satu kartu per langkah; delay bertingkat membuat kartu muncul satu per satu */}
            {marriageSteps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-700/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#0f5132] text-white flex items-center justify-center font-bold font-mono text-base shadow-sm">
                      {item.step}
                    </span>

                    {idx < marriageSteps.length - 1 && (
                      <span className="hidden lg:block text-stone-300 font-bold text-xl">
                        →
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-1 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-amber-800 mb-2">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Langkah {idx + 1} dari 5</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tombol menuju halaman panduan pernikahan lengkap */}
        <div className="mt-12 text-center">
          <Link
            to="/layanan/pernikahan"
            className="inline-flex items-center gap-2.5 bg-[#0f5132] text-white hover:bg-[#073822] px-7 py-3.5 rounded-xl font-bold text-base transition shadow-md hover:shadow-lg"
          >
            <span>Lihat Panduan Pernikahan Lengkap</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
