/**
 * Bentuk satu data kegiatan lokal. Field "location" tidak dipakai lagi karena tabel galeri tidak punya kolom lokasi.
 */
// DATA CADANGAN KEGIATAN (galeri).
// Saat ini sengaja dikosongkan: foto kegiatan yang tampil di situs berasal dari tabel "galeri" di Supabase
// (diisi lewat panel admin). Array ini hanya dipakai bila Supabase tidak dikonfigurasi / gagal diakses.
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

export const activitiesData: ActivityItem[] = [];
