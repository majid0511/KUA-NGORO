export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Pengumuman' | 'Berita' | 'Artikel';
  date: string;
  author: string;
  imageUrl: string;
  featured?: boolean;
}

export const newsData: NewsItem[] = [
  {
    id: "berita-1",
    title: "Sosialisasi Pendaftaran Nikah Online via SIMKAH 4 Bagi Masayarakat Ngoro",
    slug: "sosialisasi-pendaftaran-nikah-online-simkah",
    excerpt: "KUA Kecamatan Ngoro terus mengedukasi masyarakat mengenai kemudahan mendaftar nikah secara daring tanpa perlu mengantre lama di kantor.",
    content: "KUA Kecamatan Ngoro menyelenggarakan kegiatan sosialisasi pendaftaran nikah daring melalui aplikasi SIMKAH 4.0. Melalui kemudahan digital ini, calon pengantin dapat membuat akun, memilih jadwal akad, serta mengunggah dokumen persyaratan utama dari smartphone. KUA Ngoro berkomitmen memberikan pelayanan yang cepat, transparan, dan dapat diakses dari mana saja.",
    category: "Berita",
    date: "2026-09-15",
    author: "Tim Humas KUA Ngoro",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "pengumuman-1",
    title: "Jadwal Pelaksanaan Bimbingan Perkawinan (Bimwin) Mandiri Angkatan III",
    slug: "jadwal-bimbingan-perkawinan-angkatan-iii",
    excerpt: "Diberitahukan kepada seluruh calon pengantin terdaftar untuk mengikuti Bimwin Mandiri yang dilaksanakan setiap hari Rabu.",
    content: "Dalam rangka pembekalan ketahanan keluarga, KUA Ngoro mewajibkan calon pengantin yang telah lolos verifikasi berkas untuk mengikuti Bimbingan Perkawinan. Kegiatan diampu oleh Penyuluh Agama Islam Fungsional dan tenaga medis Puskesmas Ngoro.",
    category: "Pengumuman",
    date: "2026-09-10",
    author: "Seksi Bimwin KUA Ngoro",
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "artikel-1",
    title: "Memahami Transparansi Biaya Nikah: Rp0 di KUA vs Rp600.000 Bedol",
    slug: "transparansi-biaya-nikah-kua-vs-bedol",
    excerpt: "Penjelasan resmi Peraturan Pemerintah mengenai ketentuan biaya nikah gratis di KUA pada jam kerja dan biaya resmi bedol luar kantor.",
    content: "Sesuai Peraturan Pemerintah Nomor 59 Tahun 2018, biaya nikah yang dilaksanakan di Balai Nikah KUA pada hari dan jam kerja adalah Rp 0 (Gratis). Sementara untuk akad nikah di luar KUA atau di luar jam kerja dikenakan tarif resmi sebesar Rp 600.000 yang disetorkan langsung ke Kas Negara via Bank/Post (PNBP). KUA Ngoro tidak memungut biaya tambahan apapun di luar ketentuan resmi negara.",
    category: "Artikel",
    date: "2026-08-28",
    author: "Penghulu KUA Ngoro",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "berita-2",
    title: "Pendataan dan Kalibrasi Presisi Arah Kiblat Masjid di Kecamatan Ngoro",
    slug: "pendataan-kalibrasi-arah-kiblat-masjid-ngoro",
    excerpt: "Tim Falaqiyyah KUA Ngoro melakukan verifikasi dan pengukuran ulang arah kiblat masjid desa atas permohonan takmir.",
    content: "Tim pelayanan kemasjidan KUA Ngoro memfasilitasi takmir masjid dalam penentuan akurasi arah kiblat menggunakan alat kompas standar dan pemetaan bayang matahari (Roshdul Qiblah).",
    category: "Berita",
    date: "2026-08-14",
    author: "Penyuluh Kemasjidan",
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pengumuman-2",
    title: "Layanan Konsultasi & Pengaduan Publik Terpadu via WhatsApp Resmi KUA",
    slug: "layanan-pengaduan-whatsapp-resmi-kua",
    excerpt: "Masyarakat Kecamatan Ngoro dapat mengajukan pertanyaan, cek berkas nikah, dan saran melalui nomor WhatsApp resmi.",
    content: "Untuk memberikan respon cepat kepada publik, KUA Ngoro mengaktifkan saluran komunikasi WhatsApp resmi di nomor 0851-3322-5303 pada jam kerja efektif.",
    category: "Pengumuman",
    date: "2026-07-20",
    author: "Tim Pelayanan KUA",
    imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=800&q=80"
  }
];
