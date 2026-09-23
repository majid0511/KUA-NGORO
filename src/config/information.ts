// Konten halaman informasi publik. Jawaban FAQ dijaga tetap umum dan aman
// (tidak mengarang persyaratan hukum atau prosedur yang belum terverifikasi).

export interface InfoTopic {
  id: string;
  title: string;
  summary: string;
  body: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const infoTopics: InfoTopic[] = [
  {
    id: "pernikahan",
    title: "Pernikahan",
    summary: "Informasi umum seputar pencatatan nikah dan rujuk.",
    body: "KUA Kecamatan Ngoro melayani pencatatan nikah dan rujuk bagi warga negara Indonesia yang beragama Islam di wilayah Kecamatan Ngoro. Untuk persyaratan dan jadwal terkini, silakan hubungi KUA Ngoro secara langsung atau melalui SIMKAH.",
  },
  {
    id: "wakaf",
    title: "Wakaf",
    summary: "Informasi umum seputar layanan wakaf.",
    body: "KUA Ngoro memfasilitasi pencatatan dan pembinaan tanah wakaf di wilayah kerjanya. Untuk proses dan dokumen yang dibutuhkan, masyarakat disarankan berkonsultasi langsung dengan petugas KUA.",
  },
  {
    id: "masjid-musala",
    title: "Masjid & Musala",
    summary: "Informasi umum seputar pendataan dan pembinaan masjid/musala.",
    body: "KUA Ngoro melakukan pendataan dan pembinaan terhadap masjid dan musala di wilayah Kecamatan Ngoro sebagai bagian dari bimbingan kemasjidan.",
  },
  {
    id: "majelis-taklim",
    title: "Majelis Taklim",
    summary: "Informasi umum seputar pendataan majelis taklim.",
    body: "Majelis taklim yang aktif di wilayah Kecamatan Ngoro dapat didata dan dibina melalui KUA Ngoro sebagai bagian dari pembinaan kehidupan beragama masyarakat.",
  },
  {
    id: "bimbingan-keagamaan",
    title: "Bimbingan Keagamaan",
    summary: "Informasi umum seputar penyuluhan dan bimbingan keagamaan.",
    body: "KUA Ngoro memberikan bimbingan dan penyuluhan keagamaan kepada masyarakat, termasuk bimbingan perkawinan bagi calon pengantin.",
  },
  {
    id: "pengumuman",
    title: "Pengumuman",
    summary: "Ruang untuk pengumuman resmi dari KUA Ngoro.",
    // TODO: Isi dengan pengumuman resmi saat tersedia.
    body: "",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apa layanan yang tersedia di KUA Ngoro?",
    answer:
      "KUA Ngoro melayani pencatatan nikah dan rujuk, bimbingan keluarga, pelayanan wakaf, bimbingan kemasjidan, serta bimbingan dan penyuluhan keagamaan.",
  },
  {
    id: "faq-2",
    question: "Bagaimana cara mendapatkan informasi layanan pernikahan?",
    answer:
      "Informasi layanan pernikahan dapat diperoleh melalui halaman Informasi pada situs ini, melalui SIMKAH, atau dengan menghubungi KUA Ngoro secara langsung.",
  },
  {
    id: "faq-3",
    question: "Di mana lokasi KUA Ngoro?",
    answer:
      "Lokasi resmi KUA Ngoro dapat dilihat pada halaman Kontak. Jika informasi peta belum tersedia, silakan hubungi KUA Ngoro untuk arahan lokasi.",
  },
  {
    id: "faq-4",
    question: "Bagaimana cara mengakses layanan wakaf?",
    answer:
      "Layanan wakaf dapat diakses melalui halaman Layanan pada situs ini atau dengan berkonsultasi langsung dengan petugas KUA Ngoro.",
  },
  {
    id: "faq-5",
    question: "Bagaimana cara menghubungi KUA Ngoro?",
    answer:
      "Kontak resmi KUA Ngoro tersedia pada halaman Kontak, termasuk nomor telepon, WhatsApp, dan alamat kantor apabila sudah dikonfirmasi.",
  },
];
