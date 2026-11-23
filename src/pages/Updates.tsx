/**
 * HALAMAN CATATAN RILIS & PEMBARUAN SISTEM (/updates)
 *
 * Menampilkan catatan rilis publik KUA Ngoro 2.0 secara transparan
 * yang dibaca langsung dari update.md.
 */
import React from "react";
import { Sparkles, Calendar, Tag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { getPublicReleases, type ChangelogCategory } from "../lib/changelog";

const categoryStyles: Record<
  ChangelogCategory,
  { label: string; badge: string; dot: string }
> = {
  NEW: {
    label: "Fitur Baru",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
  },
  IMPROVED: {
    label: "Peningkatan",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-600",
  },
  FIXED: {
    label: "Perbaikan",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-600",
  },
  CONTENT: {
    label: "Informasi",
    badge: "bg-purple-50 text-purple-800 border-purple-200",
    dot: "bg-purple-600",
  },
};

export default function Updates() {
  usePageMeta({
    title: "Catatan Rilis & Pembaruan Sistem",
    description:
      "Transparansi pembaruan fitur, peningkatan keandalan layanan digital, dan perbaikan situs resmi KUA Kecamatan Ngoro.",
    path: "/updates",
  });

  const releases = getPublicReleases();

  return (
    <div className="py-10 space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-stone-50/40 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>TRANSPARANSI DIGITAL KUA NGORO 2.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Catatan Pembaruan Sistem
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Dokumentasi riwayat pembaruan resmi portal layanan Kantor Urusan
              Agama Kecamatan Ngoro, Kabupaten Jombang. Menjamin transparansi
              fitur, keandalan jadwal sholat hisab, dan kemudahan bagi warga.
            </p>
          </div>
        </div>
      </section>

      {/* Konten Utama Rilis */}
      <div className="container-kua max-w-4xl space-y-12">
        {releases.map((rel, index) => {
          const isLatest = index === 0;

          return (
            <article
              key={rel.version}
              className={`rounded-3xl border bg-white p-6 sm:p-8 transition-shadow ${
                isLatest
                  ? "border-emerald-200 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-500/20"
                  : "border-stone-200/80 shadow-sm"
              }`}
            >
              {/* Header Rilis */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 px-3 py-1 font-mono text-sm font-bold text-stone-900">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" />
                    {rel.version}
                  </span>

                  {isLatest && (
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Rilis Terbaru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  <span>{rel.date}</span>
                </div>
              </div>

              {/* Pengantar & Ringkasan */}
              <div className="mt-5 space-y-3">
                {rel.introduction && (
                  <p className="text-sm font-medium leading-relaxed text-stone-800 sm:text-base">
                    {rel.introduction}
                  </p>
                )}
                {rel.summary && (
                  <p className="text-xs text-stone-500 sm:text-sm">
                    {rel.summary}
                  </p>
                )}
              </div>

              {/* Daftar Perubahan per Kategori */}
              {rel.entries.length > 0 && (
                <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Daftar Perubahan:
                  </h2>
                  <div className="grid gap-2.5">
                    {rel.entries.map((item, idx) => {
                      const style = categoryStyles[item.category] || {
                        label: item.category,
                        badge: "bg-stone-50 text-stone-800 border-stone-200",
                        dot: "bg-stone-500",
                      };

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-stone-100/80 bg-stone-50/50 p-3"
                        >
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold ${style.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                            />
                            {style.label}
                          </span>
                          <span className="text-xs text-stone-700 leading-relaxed sm:text-sm">
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {releases.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-500">
            <p>Belum ada catatan rilis publik yang tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
