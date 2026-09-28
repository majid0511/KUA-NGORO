export interface FaqCategory {
  id: string;
  category: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export const faqData: FaqCategory[] = [
  {
    id: "pernikahan",
    category: "Pernikahan & SIMKAH",
    items: [
      {
        question: "Berapa hari sebelum hari H pendaftaran nikah harus diserahkan?",
        answer: "Sesuai regulasi Peraturan Menteri Agama, pendaftaran nikah dan penyerahan berkas fisik idealnya dilakukan paling lambat 10 hari kerja sebelum hari akad nikah dilaksanakan. Jika kurang dari 10 hari kerja, dibutuhkan Surat Dispensasi Nikah dari Camat Ngoro."
      },
      {
        question: "Apakah akad nikah di Balai Nikah KUA Ngoro dipungut biaya?",
        answer: "Tidak dipungut biaya alias GRATIS (Rp 0,-), selama akad nikah dilaksanakan di Balai Nikah KUA Ngoro pada jam kerja resmi (Senin s.d. Jumat)."
      },
      {
        question: "Berapa biaya akad nikah yang dilaksanakan di rumah atau gedung (Bedol)?",
        answer: "Biaya nikah di luar kantor KUA / di luar jam kerja adalah Rp 600.000,-. Biaya ini merupakan tarif Penerimaan Negara Bukan Pajak (PNBP) resmi yang disetorkan langsung oleh calon pengantin ke rekening Kas Negara melalui Bank Mandiri, BRI, BNI, Pos, atau E-Banking menggunakan Kode Billing SIMKAH."
      },
      {
        question: "Bagaimana jika calon suami berasal dari luar Kecamatan Ngoro?",
        answer: "Calon pengantin pria dari luar daerah wajib mengurus Surat Rekomendasi Nikah terlebih dahulu dari KUA kecamatan asal tempat tinggal sesuai domisili KTP, kemudian diserahkan ke KUA Ngoro."
      }
    ]
  },
  {
    id: "layanan-umum",
    category: "Layanan Umum & Operasional",
    items: [
      {
        question: "Apa saja jam pelayanan operasional KUA Kecamatan Ngoro?",
        answer: "KUA Kecamatan Ngoro membuka pelayanan administrasi publik pada hari Senin sampai Kamis pukul 07.30 - 16.00 WIB, dan hari Jumat pukul 07.30 - 16.30 WIB. Sabtu, Minggu, dan Hari Libur Nasional tutup."
      },
      {
        question: "Bagaimana cara konsultasi atau pengaduan secara daring?",
        answer: "Masyarakat dapat memanfaatkan saluran konseling resmi via WhatsApp KUA Ngoro di nomor 0851-3322-5303 atau melalui formulir pesan di halaman Kontak website ini."
      }
    ]
  },
  {
    id: "wakaf-masjid",
    category: "Wakaf & Kemasjidan",
    items: [
      {
        question: "Bagaimana cara mendaftarkan tanah wakaf masjid/musala agar bersertifikat?",
        answer: "Wakif (pemberi wakaf) dan Nazhir (pengelola) membawa dokumen sertifikat tanah / bukti kepemilikan ke KUA Ngoro. Kepala KUA selaku PPAIW akan menerbitkan Akta Ikrar Wakaf (AIW) untuk selanjutnya diproses ke BPN Kabupaten Jombang."
      },
      {
        question: "Bagaimana mengurus Nomor ID SIMAS untuk masjid atau musala baru?",
        answer: "Pengurus Takmir mengajukan permohonan ke KUA Ngoro dilampiri SK Takmir dari Desa dan foto kondisi bangunan masjid. Petugas KUA akan memverifikasi dan menerbitkan Surat Keterangan ID SIMAS resmi."
      }
    ]
  }
];
