
import React from "react";
import { ExternalLink, ShieldCheck, ArrowUpRight } from "lucide-react";

import { OfficialLinkCard } from "../cards/OfficialLinkCard";
import { officialLinksData } from "../../data/officialLinks";

/**
 * Menampilkan direktori tautan portal resmi Kementerian Agama.
 * Data portal tetap berasal dari officialLinksData.
 */
export const OfficialLinksSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/70 bg-stone-50 py-16 sm:py-20 lg:py-24">
      <div className="container-kua relative">

        {/* Header section. */}
        <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">

          {/* Judul dan deskripsi. */}
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-bold tracking-wider text-emerald-900">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              EKOSISTEM DIGITAL KEMENAG
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
              Terhubung dengan
              <span className="block text-emerald-800">
                Portal Resmi Kemenag
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Temukan akses menuju portal instansi dan aplikasi digital
              resmi Kementerian Agama Republik Indonesia dalam satu tempat.
            </p>
          </div>

          {/* Informasi jumlah portal. */}
          <div className="flex items-center gap-3 self-start rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm lg:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <ExternalLink className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xl font-extrabold leading-none text-stone-900">
                {officialLinksData.length}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-500">
                Portal tersedia
              </p>
            </div>
          </div>
        </div>

        {/* Grid portal resmi. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officialLinksData.map((link) => (
            <div
              key={link.id}
              className="group relative min-w-0"
            >
              <OfficialLinkCard
                name={link.name}
                description={link.description}
                url={link.url}
                category={link.category}
                icon={link.icon}
                verified={link.verified}
              />
            </div>
          ))}
        </div>

        {/* Catatan keamanan dan informasi. */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />

            <div>
              <p className="text-sm font-bold text-emerald-950">
                Akses portal resmi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-900/80 sm:text-sm">
                Pastikan alamat situs yang dikunjungi sesuai dengan domain
                resmi instansi terkait.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>Portal eksternal</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
};
