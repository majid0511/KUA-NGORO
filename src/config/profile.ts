// Konfigurasi profil kelembagaan KUA Kecamatan Ngoro.
// Data yang belum terverifikasi dibiarkan kosong (array kosong / string kosong)
// agar tidak menampilkan informasi yang belum tentu benar kepada publik.

export interface Duty {
  id: string;
  title: string;
  description: string;
}

export interface Village {
  id: string;
  name: string;
}

export interface OrgNode {
  id: string;
  title: string;
  name?: string;
  children?: OrgNode[];
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  description?: string;
  photoUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export interface ProfileConfig {
  name: string;
  identity: {
    officialName: string;
    district: string;
    regency: string;
    province: string;
    ministry: string;
  };
  aboutShort: string;
  aboutFull: string;
  vision: string;
  missions: string[];
  duties: Duty[];
  serviceArea: Village[];
  organizationalStructure: OrgNode | null;
  staff: StaffMember[];
  activities: Activity[];
  gallery: GalleryItem[];
}

export const profileConfig: ProfileConfig = {
  name: "KUA Kecamatan Ngoro",

  identity: {
    officialName: "Kantor Urusan Agama Kecamatan Ngoro",
    district: "Kecamatan Ngoro",
    regency: "Kabupaten Jombang",
    province: "Jawa Timur",
    ministry: "Kementerian Agama Republik Indonesia",
  },

  aboutShort:
    "KUA Kecamatan Ngoro adalah unit pelayanan Kementerian Agama yang menangani urusan agama Islam di tingkat kecamatan, mulai dari pencatatan nikah dan rujuk hingga bimbingan keagamaan bagi masyarakat.",

  aboutFull:
    "Kantor Urusan Agama (KUA) Kecamatan Ngoro merupakan unit pelaksana teknis Kementerian Agama Republik Indonesia di tingkat kecamatan. KUA Ngoro memberikan pelayanan dan informasi keagamaan kepada masyarakat, termasuk pencatatan nikah dan rujuk, bimbingan keluarga sakinah, pelayanan wakaf, pembinaan kemasjidan, serta bimbingan dan penyuluhan agama Islam. Sebagai bagian dari struktur pemerintahan yang paling dekat dengan masyarakat, KUA Ngoro berperan menjembatani kebutuhan keagamaan warga dengan kebijakan dan layanan resmi negara.",

  // TODO: Isi setelah visi-misi resmi terverifikasi tersedia.
  vision: "",
  missions: [],

  duties: [
    {
      id: "nikah-rujuk",
      title: "Pelayanan pencatatan nikah dan rujuk",
      description:
        "Melayani pendaftaran, pencatatan, dan penerbitan dokumen pernikahan serta rujuk sesuai ketentuan yang berlaku.",
    },
    {
      id: "bimbingan-keluarga",
      title: "Bimbingan keluarga",
      description:
        "Memberikan bimbingan perkawinan dan pembinaan keluarga sakinah bagi calon pengantin dan keluarga.",
    },
    {
      id: "bimbingan-kemasjidan",
      title: "Bimbingan kemasjidan",
      description:
        "Melakukan pembinaan dan pendataan terhadap masjid dan musala di wilayah kerja.",
    },
    {
      id: "wakaf",
      title: "Pelayanan wakaf",
      description:
        "Memfasilitasi pencatatan dan pembinaan tanah wakaf sesuai ketentuan perundang-undangan.",
    },
    {
      id: "bimbingan-keagamaan",
      title: "Bimbingan keagamaan",
      description:
        "Memberikan penyuluhan dan bimbingan keagamaan kepada masyarakat di wilayah Kecamatan Ngoro.",
    },
    {
      id: "pembinaan-masyarakat",
      title: "Pembinaan masyarakat",
      description:
        "Melaksanakan pembinaan kehidupan beragama di tengah masyarakat secara berkelanjutan.",
    },
    {
      id: "majelis-taklim",
      title: "Pelayanan majelis taklim",
      description:
        "Melakukan pendataan dan pembinaan terhadap majelis taklim yang aktif di wilayah kerja.",
    },
    {
      id: "informasi-keagamaan",
      title: "Informasi keagamaan",
      description:
        "Menyediakan informasi resmi terkait layanan dan kegiatan keagamaan bagi masyarakat umum.",
    },
  ],

  // TODO: Isi nama desa/kelurahan setelah data wilayah kerja resmi terverifikasi.
  serviceArea: [
    { id: "desa-ngoro", name: "Ngoro" },
    { id: "desa-pulorejo", name: "Pulorejo" },
    { id: "desa-japanan", name: "Japanan" },
  ],

  // TODO: Isi struktur organisasi setelah data resmi terverifikasi.
  organizationalStructure: {
  id: "kepala",
  title: "Kepala KUA",
  name: "Nama Kepala KUA", // opsional, kosongkan jika belum ada
  children: [
    { id: "penyuluh", title: "Penyuluh Agama" },
    { id: "admin", title: "Administrasi" },
    { id: "pelayanan", title: "Pelayanan" },
  ],
},

  // TODO: Isi data pegawai setelah tersedia dan terverifikasi.
  staff: [
    {
    id: "staff-1",
    name: "kiki",
    position: "Kepala KUA",
    description: "Deskripsi singkat tugas atau bidang.",
    photoUrl: "/staff/kiki.jpg", // taruh filenya di folder public/staff/
  },
  ],

  // TODO: Isi kegiatan nyata KUA Ngoro setelah data tersedia.
  activities: [
    {
    id: "bimbingan-perkawinan-2026",
    title: "Bimbingan Perkawinan",
    description: "Pembekalan bagi calon pengantin sebelum menikah.",
    category: "Bimbingan",
  },
  ],

  // TODO: Isi galeri dengan foto resmi kegiatan KUA Ngoro.
  gallery: [
    {
    id: "gal-1",
    imageUrl: "/gallery/kegiatan-1.jpg",
    caption: "Bimbingan perkawinan, September 2026",
    category: "Bimbingan",
  },
  ],
};
