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
  address: "Jl. Arjuno No.N No.7, Pandean, Ngoro, Kec. Ngoro, Kabupaten Jombang, Jawa Timur 61473",
  phone: "085133225303",
  whatsapp: "085133225303",
  email: "",
  officeHours: "",
  mapsUrl: "https://www.google.com/maps/place/KUA+Kecamatan+Ngoro/@-7.6925264,112.2692273,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7868772497aa05:0x2fe556b013739c7f!8m2!3d-7.6925264!4d112.2718022!16s%2Fg%2F1hm4df361?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",

  social: {
    // TODO: Lengkapi jika akun resmi tersedia.
    instagram: "",
    facebook: "",
    youtube: "",
  },

  isOfficiallyConfirmed: false,
  copyrightYear: 2026,
};
