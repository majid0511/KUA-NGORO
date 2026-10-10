/**
 * Bentuk satu berita/pengumuman lokal. "category" menentukan jenisnya; "featured" menandai konten penting/disorot.
 */
// DATA CADANGAN BERITA & PENGUMUMAN.
// Sengaja dikosongkan: konten berita/pengumuman yang tampil berasal dari Supabase (diisi lewat panel admin).
// Array ini hanya dipakai bila Supabase tidak dikonfigurasi / gagal diakses.
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
  
];
