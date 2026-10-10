/**
 * Satu layanan: ringkasan singkat (shortDesc), penjelasan lengkap (fullDesc), nama ikon, persyaratan, dan langkah prosedur.
 */
// DATA CADANGAN LAYANAN KUA (nikah, wakaf, dll).
// Dipakai hanya bila Supabase tidak dikonfigurasi / gagal diakses; saat normal, layanan diambil dari tabel "layanan"
// (diisi lewat panel admin). Diubah ke bentuk Layanan di src/lib/cms/layanan.ts.
export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  requirements: string[];
  procedure: string[];
}

/**
 * Daftar semua layanan cadangan; urutan array = urutan tampil.
 */
export const servicesData: ServiceItem[] = [
  {
    id: "pernikahan",
    title: "Pernikahan & Rujuk",
    shortDesc: "Pendaftaran, verifikasi pendaftaran nikah online via SIMKAH, bimbingan calon pengantin, dan pelaksanaan akad nikah.",
    fullDesc: "Layanan pencatatan pernikahan dan rujuk bagi calon pengantin Muslim di wilayah Kecamatan Ngoro. Meliputi pemeriksaan berkas administrasi (N1-N6), verifikasi wali dan saksi, penerbitan Surat Rekomendasi Nikah, Bimbingan Perkawinan (Bimwin), hingga penerbitan Buku Nikah resmi.",
    icon: "HeartHandshake",
    requirements: [
      "Surat Pengantar Nikah dari Desa/Kelurahan (Model N1)",
      "Surat Persetujuan Calon Pengantin (Model N4)",
      "Surat Izin Orang Tua jika <21 tahun (Model N5)",
      "Fotokopi KTP, KK, & Akta Kelahiran calon pengantin & orang tua",
      "Pasfoto background biru ukuran 2x3 (4 lembar) & 4x6 (2 lembar)",
      "Surat Akta Cerai/Kematian (apabila berstatus Duda/Janda)",
      "Surat Rekomendasi Nikah dari KUA Asal (jika nikah di luar KUA tempat tinggal)"
    ],
    procedure: [
      "Daftar secara mandiri di situs resmi SIMKAH Kemenag (simkah4.kemenag.go.id) atau datang ke KUA Ngoro.",
      "Serahkan berkas fisik ke petugas KUA minimal 10 hari kerja sebelum hari H pernikahan.",
      "Petugas KUA melakukan pemeriksaan berkas (N3) serta wawancara calon pengantin & wali.",
      "Mengikuti kegiatan Bimbingan Perkawinan (Bimwin) Calon Pengantin.",
      "Pelaksanaan akad nikah di KUA (Gratis Rp0) atau Bedol/Luar KUA (Bayar PNBP Rp600.000 ke Bank resmi)."
    ]
  },
  {
    id: "kemasjidan",
    title: "Kemasjidan & Musala",
    shortDesc: "Pengurusan ID Masjid/Musala (SIMAS), kalibrasi & pengukuhan arah kiblat, serta pendataan pengurus takmir.",
    fullDesc: "Pelayanan bimbingan kemasjidan mencakup penerbitan Nomor ID Masjid/Musala pada SIMAS Kemenag RI, pengukuran & penetapan presisi arah kiblat oleh tim pakar KUA, fasilitasi permohonan bantuan kemasjidan, serta pembinaan organisasi takmir masjid se-Kecamatan Ngoro.",
    icon: "Building2",
    requirements: [
      "Surat permohonan penerbitan ID SIMAS dari Takmir Masjid/Musala",
      "Surat Keputusan (SK) Kepengurusan Takmir dari Desa/Kelurahan",
      "Profil singkat masjid/musala beserta foto tampak depan & dalam",
      "Surat permohonan penetapan arah kiblat (apabila mengajukan kalibrasi)"
    ],
    procedure: [
      "Pengurus takmir mengajukan berkas ke KUA Kecamatan Ngoro.",
      "Petugas melakukan verifikasi data dan peninjauan lokasi (untuk arah kiblat).",
      "Penerbitan Surat Keterangan ID SIMAS Kemenag RI."
    ]
  },
  {
    id: "wakaf",
    title: "Pelayanan Wakaf",
    shortDesc: "Penerbitan Akta Ikrar Wakaf (AIW), pendataan tanah wakaf (SIWAK), dan pembinaan pengelola nazhir.",
    fullDesc: "KUA bertindak sebagai Pejabat Pembuat Akta Ikrar Wakaf (PPAIW). KUA Ngoro memfasilitasi pengikrar wakaf (Wakif) dan pengelola tanah wakaf (Nazhir) untuk memproses sertifikasi tanah wakaf agar berkekuatan hukum tetap demi kemaslahatan umat.",
    icon: "Landmark",
    requirements: [
      "Sertifikat Hak Milik (SHM) atau Surat Kepemilikan Tanah yang sah",
      "Fotokopi KTP & KK Wakif (Pemberi Wakaf) & Nazhir (Pengelola)",
      "Surat Pengesahan Nazhir dari KUA / BWI Jombang",
      "Daftar Saksi Ikrar Wakaf minimal 2 orang (beserta KTP)"
    ],
    procedure: [
      "Wakif dan Nazhir berkonsultasi ke KUA Ngoro dengan membawa berkas pertanahan.",
      "Pemeriksaan berkas kepemilikan tanah dan legalitas Nazhir.",
      "Pelaksanaan Ikrar Wakaf di hadapan Kepala KUA (PPAIW) & penerbitan AIW/APAIW.",
      "Pengurusan kelanjutan sertifikat tanah wakaf ke Kantor Pertanahan (BPN)."
    ]
  },
  {
    id: "keluarga-sakinah",
    title: "Keluarga Sakinah & BP4",
    shortDesc: "Bimbingan perkawinan, konseling masalah rumah tangga, pencegahan stunting, dan ketahanan keluarga.",
    fullDesc: "Layanan konsultasi dan pembinaan keluarga sakinah dilaksanakan bekerjasama dengan Badan Penasihat Pembinaan dan Pelestarian Perkawinan (BP4). Bertujuan membantu pasangan suami istri menyelesaikan dinamika rumah tangga serta membangun ketahanan keluarga berlandaskan nilai syariat.",
    icon: "ShieldCheck",
    requirements: [
      "KTP suami & istri (atau calon pengantin)",
      "Buku Nikah / Duplikat Buku Nikah (untuk pasangan suami istri)",
      "Mengisi formulir konsultasi keluarga di KUA Ngoro"
    ],
    procedure: [
      "Pendaftaran jadwal konseling secara langsung atau WhatsApp KUA.",
      "Pelaksanaan sesi konseling dengan konselor BP4 / Penghulu KUA.",
      "Pemberian sertifikat/rekomendasi hasil bimbingan."
    ]
  },
  {
    id: "bimbingan-keagamaan",
    title: "Bimbingan Keagamaan",
    shortDesc: "Penyuluhan keagamaan Islam, pembinaan majelis taklim, sertifikasi halal produk UMK, dan pembacaan doa resmi.",
    fullDesc: "Layanan bimbingan dan penyuluhan agama Islam menghadirkan Penyuluh Agama Islam Fungsional KUA Ngoro di tengah masyarakat. Meliputi pembinaan rutin majelis taklim desa, edukasi toleransi beragama, bimbingan mualaf, hingga pendampingan sertifikasi halal gratis (SEHALAL) bagi pelaku usaha mikro.",
    icon: "BookOpen",
    requirements: [
      "Surat permohonan bimbingan/pembacaan doa dari instansi/masyarakat",
      "Surat pendaftaran majelis taklim (untuk registrasi Simpenais)"
    ],
    procedure: [
      "Mengajukan surat permohonan ke KUA Ngoro.",
      "Koordinasi penjadwalan ustaz/penyuluh fungsional."
    ]
  },
  {
    id: "informasi-keagamaan",
    title: "Informasi Keagamaan",
    shortDesc: "Pusat informasi publik jadwal shalat, penetapan hilal/zakat, konsultasi syariat, dan pengaduan masyarakat.",
    fullDesc: "Menyediakan akses informasi publik terpercaya mengenai kebijakan keagamaan Kementerian Agama, petunjuk nisab zakat/infak, jadwal shalat wilayah Kabupaten Jombang, serta saluran penampungan aspirasi dan pengaduan masyarakat.",
    icon: "Info",
    requirements: [
      "Tidak memerlukan persyarat khusus (Terbuka untuk seluruh masyarakat)"
    ],
    procedure: [
      "Masyarakat dapat datang langsung, mengakses situs web ini, atau via WhatsApp KUA Ngoro."
    ]
  }
];
