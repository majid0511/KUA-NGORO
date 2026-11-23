/**
 * POPUP PENGUMUMAN PEMBARUAN (KUA Ngoro 2.0)
 *
 * Menampilkan pengumuman otomatis versi baru jika pengunjung belum pernah melihatnya.
 * Dilengkapi tombol "Jelajahi Pembaruan" (/updates), tombol "Tutup", dan opsi "Jangan tampilkan lagi".
 * Memanfaatkan Modal native (<dialog>) bersama.
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2, X } from "lucide-react";
import { Modal } from "./ui/Modal";
import {
  shouldShowReleaseAnnouncement,
  markReleaseAsDismissed,
  type ReleaseNote,
} from "../lib/changelog";

export const UpdateAnnouncementModal: React.FC = () => {
  const [release, setRelease] = useState<ReleaseNote | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Jalankan pemeriksaan setelah halaman termuat
    const timer = window.setTimeout(() => {
      const eligible = shouldShowReleaseAnnouncement();
      if (eligible) {
        setRelease(eligible);
        setIsOpen(true);
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    if (release) {
      markReleaseAsDismissed(release.version);
    }
    setIsOpen(false);
  };

  if (!release) return null;

  // Ambil maksimal 3 poin highlight penting
  const highlights = release.entries.slice(0, 3);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="w-full">
        {/* Header Visual Modern Islamic Minimalist */}
        <div className="relative -mt-6 -mx-6 bg-gradient-to-br from-[#0f5132] to-[#1a6642] px-6 py-6 text-white overflow-hidden mb-5">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Pembaruan Versi {release.version}</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Tutup dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            KUA Ngoro Website 2.0
          </h2>
          <p className="mt-1 text-xs text-emerald-100/90 sm:text-sm">
            Rilis {release.date} · Pelayanan publik semakin cepat, handal & transparan.
          </p>
        </div>

        {/* Ringkasan & Poin Penting */}
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-stone-600">
            {release.summary || release.introduction}
          </p>

          {highlights.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f5132]">
                Sorotan Utama:
              </span>
              <ul className="space-y-1.5">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDontShowAgain}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 transition py-1"
          >
            Jangan tampilkan lagi
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              to="/updates"
              onClick={handleDontShowAgain}
              className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-full bg-[#0f5132] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#073822] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <span>Jelajahi Pembaruan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
