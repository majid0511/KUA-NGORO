/**
 * Satu tautan resmi. "verified" = true berarti alamatnya sudah dipastikan benar (ditampilkan sebagai tanda terverifikasi).
 * "icon" harus berupa nama ikon yang dikenali komponen OfficialLinkCard.
 */
// DATA TAUTAN RESMI: daftar situs/aplikasi resmi terkait KUA (Kemenag RI, SIMKAH, dll) yang ditampilkan di Beranda.
// Diedit langsung di file ini.
export interface OfficialLinkItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'Kementerian' | 'Wilayah' | 'Layanan Digital';
  icon: string;
  verified: boolean;
}

/**
 * Daftar semua tautan resmi.
 */
export const officialLinksData: OfficialLinkItem[] = [
  {
    id: "kemenag-ri",
    name: "Kementerian Agama RI",
    description: "Portal resmi Kementerian Agama Republik Indonesia pusat.",
    url: "https://kemenag.go.id/",
    category: "Kementerian",
    icon: "Landmark",
    verified: true
  },
  {
    id: "kanwil-jatim",
    name: "Kanwil Kemenag Jawa Timur",
    description: "Kantor Wilayah Kementerian Agama Provinsi Jawa Timur.",
    url: "https://jatim.kemenag.go.id/",
    category: "Wilayah",
    icon: "Building",
    verified: true
  },
  {
    id: "kemenag-jombang",
    name: "Kankemenag Kabupaten Jombang",
    description: "Kantor Kementerian Agama Kabupaten Jombang.",
    url: "https://jombang.kemenag.go.id",
    category: "Wilayah",
    icon: "MapPin",
    verified: true
  },
  {
    id: "simkah",
    name: "SIMKAH Kemenag (Nikah Online)",
    description: "Sistem Informasi Manajemen Nikah untuk daftar nikah & cek kuota.",
    url: "https://simkah4.kemenag.go.id/",
    category: "Layanan Digital",
    icon: "HeartHandshake",
    verified: true
  },
  {
    id: "siwak",
    name: "SIWAK (Sistem Informasi Wakaf)",
    description: "Portal data tanah wakaf dan lokasi sertifikasi wakaf nasional.",
    url: "https://siwak.kemenag.go.id/",
    category: "Layanan Digital",
    icon: "FileCheck",
    verified: true
  },
  {
    id: "simas",
    name: "SIMAS (Sistem Informasi Masjid)",
    description: "Direktori masjid, musala, dan ID Registrasi Rumah Ibadah Kemenag.",
    url: "https://simas.kemenag.go.id/",
    category: "Layanan Digital",
    icon: "Building2",
    verified: true
  },
  {
    id: "simpenais",
    name: "SIMPENAIS (Majelis Taklim)",
    description: "Sistem pendataan dan pendaftaran majelis taklim terintegrasi.",
    url: "https://simpenais.kemenag.go.id/login",
    category: "Layanan Digital",
    icon: "BookOpen",
    verified: true
  }
];
