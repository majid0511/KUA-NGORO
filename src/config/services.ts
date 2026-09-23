// Daftar layanan digital resmi terkait urusan agama.
// Aturan penting: jangan pernah mengarang URL. Jika belum terverifikasi,
// gunakan url: "#" dan tandai dengan TODO di bawah.

export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string; // nama ikon dari lucide-react
  category: string;
  external: boolean;
  verified: boolean;
}

export const services: Service[] = [
  {
    id: "simkah",
    name: "SIMKAH",
    description: "Sistem informasi manajemen nikah untuk pendataan dan layanan pernikahan.",
    // TODO: Verifikasi URL resmi SIMKAH sebelum ditayangkan.
    url: "https://simkah.kemenag.go.id",
    icon: "HeartHandshake",
    category: "Pernikahan",
    external: true,
    verified: true,
  },
  {
    id: "kemenag-ri",
    name: "Kementerian Agama RI",
    description: "Portal resmi Kementerian Agama Republik Indonesia.",
    url: "https://kemenag.go.id",
    icon: "Landmark",
    category: "Kelembagaan",
    external: true,
    verified: true,
  },
  {
    id: "kemenag-jatim",
    name: "Kementerian Agama Jawa Timur",
    description: "Portal resmi Kantor Wilayah Kementerian Agama Provinsi Jawa Timur.",
    url: "https://jatim.kemenag.go.id",
    icon: "Landmark",
    category: "Kelembagaan",
    external: true,
    verified: true,
  },
  {
    id: "kemenag-jombang",
    name: "Kementerian Agama Kabupaten Jombang",
    description: "Portal resmi Kantor Kementerian Agama Kabupaten Jombang.",
    url: "https://jombang.kemenag.go.id",
    icon: "Landmark",
    category: "Kelembagaan",
    external: true,
    verified: true,
  },
  {
    id: "siwak",
    name: "SIWAK",
    description: "Sistem informasi dan layanan data wakaf.",
    // TODO: Verifikasi URL resmi SIWAK sebelum ditayangkan.
    url: "#",
    icon: "Landmark",
    category: "Wakaf",
    external: true,
    verified: false,
  },
  {
    id: "simas",
    name: "SIMAS",
    description: "Sistem informasi masjid dan musala.",
    // TODO: Verifikasi URL resmi SIMAS sebelum ditayangkan.
    url: "#",
    icon: "Building2",
    category: "Kemasjidan",
    external: true,
    verified: false,
  },
  {
    id: "kembangdaman",
    name: "Kembangdaman",
    description: "Layanan sertifikasi dan pendataan masjid/musala.",
    // TODO: Verifikasi URL resmi Kembangdaman sebelum ditayangkan.
    url: "#",
    icon: "Building2",
    category: "Kemasjidan",
    external: true,
    verified: false,
  },
  {
    id: "kembang-dawa",
    name: "Kembang Dawa",
    description: "Layanan data dan informasi wakaf.",
    // TODO: Verifikasi URL resmi Kembang Dawa sebelum ditayangkan.
    url: "#",
    icon: "Landmark",
    category: "Wakaf",
    external: true,
    verified: false,
  },
  {
    id: "simpenais",
    name: "Simpenais",
    description: "Layanan terkait pendataan majelis taklim.",
    // TODO: Verifikasi URL resmi Simpenais sebelum ditayangkan.
    url: "#",
    icon: "BookOpenText",
    category: "Majelis Taklim",
    external: true,
    verified: false,
  },
];
