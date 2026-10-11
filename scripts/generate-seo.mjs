// MEMBUAT robots.txt DAN sitemap.xml OTOMATIS saat build (dijalankan lewat "prebuild" di package.json).
//
// Kenapa: robots.txt & sitemap.xml wajib berisi alamat LENGKAP situs (https://...). Alamat itu baru diketahui
// setelah situs ditayangkan, jadi dibuat saat build supaya tidak perlu diedit manual setiap ganti domain.
//
// Alamat situs diambil dari (urutan prioritas):
//   1. VITE_SITE_URL  (environment variable di Vercel, atau baris di file .env)  -> cara yang disarankan
//   2. VERCEL_PROJECT_PRODUCTION_URL  (disediakan otomatis oleh Vercel saat build, tanpa "https://")
// Jika keduanya tidak ada, file di folder public/ dibiarkan apa adanya dan muncul peringatan (build tetap lanjut).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// Halaman yang dimasukkan ke sitemap: [alamat, prioritas]. Tambahkan di sini jika ada halaman publik baru.
const PAGES = [
  ['/', '1.0'],
  ['/profil', '0.8'],
  ['/layanan', '0.8'],
  ['/layanan/pernikahan', '0.7'],
  ['/informasi', '0.7'],
  ['/kegiatan', '0.5'],
  ['/kontak', '0.6'],
];

// Membaca VITE_SITE_URL dari file .env (untuk pemakaian lokal; di Vercel sudah ada di process.env)
function fromDotEnv() {
  if (!existsSync('.env')) return '';
  const m = readFileSync('.env', 'utf8').match(/^\s*VITE_SITE_URL\s*=\s*(.+?)\s*$/m);
  return m ? m[1].replace(/^["']|["']$/g, '') : '';
}

let site = process.env.VITE_SITE_URL || fromDotEnv();
if (!site && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  site = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
}
site = site.trim().replace(/\/+$/, '');

if (!/^https?:\/\/[^\s/]+/.test(site)) {
  console.warn('[seo] Alamat situs tidak ditemukan/tidak valid (isi VITE_SITE_URL, mis. https://nama-situs.vercel.app).');
  console.warn('[seo] robots.txt & sitemap.xml di folder public/ TIDAK diubah.');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10); // tanggal build, format YYYY-MM-DD

const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${site}/sitemap.xml\n`;

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PAGES.map(([path, prio]) => `  <url><loc>${site}${path === '/' ? '/' : path}</loc><lastmod>${today}</lastmod><priority>${prio}</priority></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync('public/robots.txt', robots);
writeFileSync('public/sitemap.xml', sitemap);
console.log(`[seo] robots.txt & sitemap.xml dibuat untuk ${site}`);
