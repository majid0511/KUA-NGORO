// Konfigurasi identitas dan kontak resmi KUA Kecamatan Ngoro.
// PENTING: Jangan mengisi field kosong dengan data rekaan.
// Isi hanya setelah data resmi terverifikasi tersedia.

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  district: string;
  regency: string;
  province: string;
  ministry: string;
  tagline: string;

  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  mapsUrl: string;

  social: SocialLinks;

  // Status "situs resmi" hanya ditampilkan jika sudah dikonfirmasi benar.
  isOfficiallyConfirmed: boolean;

  copyrightYear: number;
}

export const siteConfig: SiteConfig = {
  name: "KUA Kecamatan Ngoro",
  shortName: "KUA Ngoro",
  district: "Ngoro",
  regency: "Jombang",
  province: "Jawa Timur",
  ministry: "Kementerian Agama Republik Indonesia",
  tagline: "Layanan KUA Ngoro, kini lebih mudah diakses.",

  // TODO: Lengkapi setelah data resmi terverifikasi.
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  officeHours: "",
  mapsUrl: "",

  social: {
    // TODO: Lengkapi jika akun resmi tersedia.
    instagram: "",
    facebook: "",
    youtube: "",
  },

  isOfficiallyConfirmed: false,
  copyrightYear: 2026,
};
