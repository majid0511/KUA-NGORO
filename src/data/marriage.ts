export interface MarriageStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

export interface DocumentItem {
  code: string;
  title: string;
  issuedBy: string;
  description: string;
  requiredFor: string;
}

export const marriageSteps: MarriageStep[] = [
  {
    step: "01",
    title: "Persiapan & Pengurusan Surat Desa",
    subtitle: "Mendatangi Kantor Desa/Kelurahan tempat tinggal",
    description: "Calon pengantin mengurus Surat Pengantar Nikah (Model N1) di RT/RW dan Kantor Desa/Kelurahan asal.",
    details: [
      "Minta surat pengantar dari ketua RT/RW setempat.",
      "Bawa KTP, KK, & Akta Kelahiran ke Kantor Desa/Kelurahan.",
      "Peroleh formulir resmi N1 (Pengantar Nikah) dan N4 (Persetujuan Calon Pengantin)."
    ]
  },
  {
    step: "02",
    title: "Kelengkapan Dokumen & Pasfoto",
    subtitle: "Menyiapkan persyaratan fisik & digital",
    description: "Melengkapi seluruh berkas administratif, foto latar biru, sertifikat vaksin/kesehatan, dan izin wali.",
    details: [
      "Pasfoto latar biru: 2x3 (4 lembar), 4x6 (2 lembar) berbusana rapi/berjilbab.",
      "Fotokopi KTP, KK, Akta Kelahiran calon pengantin & orang tua.",
      "Imunisasi TT / pemeriksaan kesehatan catin dari Puskesmas Ngoro.",
      "Dokumen pendukung (Akta Cerai jika Duda/Janda, N6 jika Orang Tua Meninggal)."
    ]
  },
  {
    step: "03",
    title: "Pendaftaran Online / Langsung KUA",
    subtitle: "Pendaftaran via SIMKAH atau Front Office KUA Ngoro",
    description: "Mendaftarkan jadwal nikah minimal 10 hari kerja sebelum hari akad nikah dilaksanakan.",
    details: [
      "Buka laman simkah4.kemenag.go.id, buat akun dan pilih lokasi KUA Kecamatan Ngoro.",
      "Input data NIK catin, data wali, dan tentukan lokasi akad (di KUA atau Bedol/Luar KUA).",
      "Cetak bukti pendaftaran online atau bawa nomor pendaftaran ke KUA Ngoro."
    ]
  },
  {
    step: "04",
    title: "Pemeriksaan Berkas & Wali (N3)",
    subtitle: "Verifikasi tatap muka oleh Penghulu KUA Ngoro",
    description: "Petugas KUA memverifikasi keabsahan dokumen, kepastian wali nikah, serta status keimanan & kebebasan halangan nikah.",
    details: [
      "Calon pengantin bersama Wali Nikah hadir ke KUA Ngoro sesuai jadwal pemeriksaan.",
      "Penghulu memvalidasi data SIMKAH dengan dokumen fisik asli.",
      "Pembayaran biaya PNBP Rp 600.000 via Bank/Pos (HANYA JIKA nikah di luar KUA/Bedol)."
    ]
  },
  {
    step: "05",
    title: "Bimwin & Pelaksanaan Akad Nikah",
    subtitle: "Mengikuti Bimbingan & Hari Bahagia Akad Nikah",
    description: "Mengikuti Bimbingan Perkawinan (Bimwin) dan dilanjutkan prosesi Ijab Kabul serta penyerahan Buku Nikah.",
    details: [
      "Mengikuti bimbingan perkawinan interaktif bersama konselor KUA Ngoro.",
      "Pelaksanaan akad nikah dipimpin Penghulu / Wali Nikah disaksikan 2 saksi sah.",
      "Penandatanganan Akta Nikah & penyerahan Buku Nikah resmi serta Kartu Nikah Digital."
    ]
  }
];

export const documentChecklist: DocumentItem[] = [
  {
    code: "Model N1",
    title: "Surat Pengantar Nikah",
    issuedBy: "Kantor Desa / Kelurahan",
    description: "Surat keterangan resmi dari kepala desa/lurah yang menyatakan calon pengantin berstatus tidak ada halangan menikah.",
    requiredFor: "Semua Calon Pengantin"
  },
  {
    code: "Model N4",
    title: "Surat Persetujuan Calon Pengantin",
    issuedBy: "Calon Pengantin (Ditandatangani berdua)",
    description: "Pernyataan tertulis kesepakatan dan persetujuan kedua belah pihak calon suami dan calon istri.",
    requiredFor: "Semua Calon Pengantin"
  },
  {
    code: "Model N5",
    title: "Surat Izin Orang Tua",
    issuedBy: "Orang Tua / Wali",
    description: "Wajib melampirkan izin tertulis orang tua apabila calon pengantin berusia di bawah 21 tahun.",
    requiredFor: "Usia < 21 Tahun"
  },
  {
    code: "N6 / Akta Kematian",
    title: "Surat Kematian Suami/Istri",
    issuedBy: "Desa / Dinas Dukcapil",
    description: "Surat keterangan kematian bagi calon pengantin yang berstatus Duda/Janda mati.",
    requiredFor: "Duda / Janda Mati"
  },
  {
    code: "Akta Cerai",
    title: "Akta Perceraian Asli",
    issuedBy: "Pengadilan Agama",
    description: "Dokumen resmi perceraian yang telah berkekuatan hukum tetap (Inkracht).",
    requiredFor: "Duda / Janda Cerai"
  },
  {
    code: "Rekomendasi Nikah",
    title: "Surat Rekomendasi Nikah",
    issuedBy: "KUA Asal Domisili",
    description: "Diperlukan jika calon pengantin pria/wanita berasal dari luar wilayah Kecamatan Ngoro.",
    requiredFor: "Warga Luar Ngoro"
  }
];

export const marriageFees = {
  inOffice: {
    amount: "Rp 0,- (GRATIS)",
    location: "Di Balai Nikah KUA Ngoro",
    schedule: "Senin - Jumat (Jam Kerja Efektif KUA)",
    note: "Sesuai PP No. 59 Tahun 2018. Bebas biaya retribusi dan pungli apapun."
  },
  outOffice: {
    amount: "Rp 600.000,-",
    location: "Luar KUA (Rumah / Masjid / Gedung / Bedol)",
    schedule: "Di luar jam kerja atau di luar Balai Nikah KUA",
    note: "Setoran resmi Penerimaan Negara Bukan Pajak (PNBP) disetor via Bank / Kode Billing Simkah / Pos."
  }
};
