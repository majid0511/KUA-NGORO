export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export const activitiesData: ActivityItem[] = [
  {
    id: "act-1",
    title: "Bimbingan Perkawinan (Bimwin) Calon Pengantin Angkatan Terpadu",
    category: "Bimbingan",
    date: "September 2026",
    location: "Aula KUA Kecamatan Ngoro",
    description: "Pelaksanaan kelas pembekalan calon pengantin meliputi pilar pernikahan sakinah, kesehatan reproduksi, serta pengelolaan keuangan keluarga.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "act-2",
    title: "Pelaksanaan Akad Nikah Terperiksa di Balai Nikah KUA Ngoro",
    category: "Pernikahan",
    date: "Agustus 2026",
    location: "Balai Nikah KUA Ngoro",
    description: "Prosesi penandatanganan Akta Nikah dan penyerahan Buku Nikah resmi secara khidmat di ruang pelayanan utama.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "act-3",
    title: "Penyerahan Sertifikat Akta Ikrar Wakaf (AIW) Tanah Musala Desa",
    category: "Wakaf",
    date: "Agustus 2026",
    location: "Desa Pulorejo, Ngoro",
    description: "Penyerahan Akta Ikrar Wakaf resmi oleh Kepala KUA selaku PPAIW kepada pengurus Nazhir tanah tempat ibadah.",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "act-4",
    title: "Pembinaan & Pendataan Majelis Taklim Ibu-Ibu Tingkat Kecamatan",
    category: "Penyuluhan",
    date: "Juli 2026",
    location: "Desa Japanan, Ngoro",
    description: "Kunjungan kerja Penyuluh Agama Islam Fungsional KUA Ngoro dalam memberikan bimbingan keagamaan rutin.",
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "act-5",
    title: "Rapat Koordinasi Bersama Lintas Sektor & Ikatan Penghulu Jombang",
    category: "Kelembagaan",
    date: "Juni 2026",
    location: "KUA Kecamatan Ngoro",
    description: "Rapat evaluasi mutu pelayanan publik dan peningkatan efisiensi pendaftaran nikah berbasis aplikasi digital.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "act-6",
    title: "Pemeriksaan dan Akurasi Kiblat Masjid Baru di Wilayah Kerja",
    category: "Kemasjidan",
    date: "Mei 2026",
    location: "Desa Genukwatu, Ngoro",
    description: "Pengukuran presisi menggunakan instrumen kompas geodesi oleh tim kemasjidan KUA Ngoro.",
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80"
  }
];
