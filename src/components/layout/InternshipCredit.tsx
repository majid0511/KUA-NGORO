// ============================================================================
// SEMUA YANG BERKAITAN DENGAN "PROJECT MAGANG" ADA DI FILE INI (bagian kode situs).
//
// Isinya: kartu "Developer Credit" di footer + tulisan "Internship Project" di baris bawah footer.
// Seluruh teksnya ada di objek INTERNSHIP di bawah, jadi mengubah tulisan cukup di satu tempat.
//
// ---------------------------------------------------------------------------
// CARA MELEPAS SEMUA TENTANG MAGANG DARI TAMPILAN SITUS
// ---------------------------------------------------------------------------
// Cara termudah (tanpa menghapus apa pun):
//   Ubah SHOW_INTERNSHIP_CREDIT di bawah dari true menjadi false.
//   Kartu kredit pengembang dan tulisan "Internship Project" langsung hilang dari situs.
//
// Cara bersih (menghapus kodenya):
//   1. Hapus file ini (src/components/layout/InternshipCredit.tsx).
//   2. Di src/components/layout/Footer.tsx hapus 2 baris impor + 2 pemakaian:
//        - import { DeveloperCreditCard, InternshipFooterNote } from "./InternshipCredit";
//        - <DeveloperCreditCard />   (Kolom 4 footer)
//        - <InternshipFooterNote />  (baris bawah footer, di sebelah tombol panah ke atas)
//
// Catatan tampilan: setelah kolom 4 hilang, footer di layar lebar menyisakan ruang kosong di kanan
// (3 dari 12 kolom). Jika mengganggu, ubah "lg:col-span-4/2/3/3" pada kolom-kolom di Footer.tsx.
//
// ---------------------------------------------------------------------------
// BAGIAN LAIN YANG MENYEBUT MAGANG (BUKAN KODE SITUS; HAPUS/EDIT MANUAL)
// ---------------------------------------------------------------------------
// README.md (cari kata "magang", "Internship", "IAI At-Tahdzib"):
//   - bagian paling atas : label "Internship Project • 2026" dan paragraf "dikembangkan sebagai bagian dari project magang"
//   - "Project Status" & "Institution" (blok kutipan di bagian awal)
//   - bagian "Developer" : keterangan mahasiswa, program studi, kampus, dan "Kontribusi utama"
//   - bagian "Catatan" tentang status internship project, daftar kata kunci, dan penutup di bagian paling bawah
// ============================================================================
import React from "react";
import { GraduationCap } from "lucide-react";

/** Saklar utama: true = tulisan magang tampil di situs, false = semuanya disembunyikan. */
export const SHOW_INTERNSHIP_CREDIT = true;

/** Seluruh teks tentang magang. Ubah di sini jika ada yang perlu direvisi. */
const INTERNSHIP = {
  cardTitle: "Developer Credit",
  cardIntro: "Website developed as an internship project by",
  studentProgram: "Mahasiswa Program Studi Hukum Keluarga (Syariah) est. 2024",
  campus: "IAI At-Tahdzib Jombang",
  cardBadge: "Internship Project • 2026",
  footerNote: "KUA Ngoro Website • Internship Project • 2026",
};

/**
 * Kartu "Developer Credit" (Kolom 4 di footer): menyebut bahwa situs ini proyek magang mahasiswa.
 * Tidak menampilkan apa pun jika SHOW_INTERNSHIP_CREDIT = false.
 */
export const DeveloperCreditCard: React.FC = () => {
  if (!SHOW_INTERNSHIP_CREDIT) return null;

  return (
    <div className="space-y-3 lg:col-span-3">
      {/* Judul kolom */}
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">
        <GraduationCap className="h-4 w-4 text-emerald-400" />
        <span>{INTERNSHIP.cardTitle}</span>
      </h4>

      {/* Kartu: kalimat pengantar, identitas mahasiswa & kampus, dan lencana "Internship Project" */}
      <div className="space-y-2 rounded-2xl border border-emerald-800/80 bg-emerald-900/40 p-4 text-xs">
        <p className="leading-relaxed text-emerald-200/80">{INTERNSHIP.cardIntro}</p>

        <div className="space-y-0.5">
          <p className="text-xs font-bold leading-snug text-white sm:text-sm">{INTERNSHIP.studentProgram}</p>
          <p className="text-xs font-semibold text-emerald-300">{INTERNSHIP.campus}</p>
        </div>

        <div className="pt-2">
          <span className="inline-block rounded-md border border-emerald-700/50 bg-emerald-800/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-200">
            {INTERNSHIP.cardBadge}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Tulisan kecil "KUA Ngoro Website • Internship Project • 2026" di baris paling bawah footer.
 * Tidak menampilkan apa pun jika SHOW_INTERNSHIP_CREDIT = false.
 */
export const InternshipFooterNote: React.FC = () => {
  if (!SHOW_INTERNSHIP_CREDIT) return null;

  return <span className="text-xs font-semibold text-emerald-400/80">{INTERNSHIP.footerNote}</span>;
};
