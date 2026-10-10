// Pintu masuk tunggal lapisan data (CMS). Halaman cukup menulis: import { getBerita } from "../lib/cms"
// tanpa perlu tahu file mana yang menyimpannya. Semua fungsi pengambil data & tipe diekspor ulang dari sini.
export * from './types';
export * from './client';
export * from './berita';
export * from './pengumuman';
export * from './layanan';
export * from './profil';
export * from './staf';
export * from './galeri';
