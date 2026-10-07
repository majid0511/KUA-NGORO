# MATERI & PANDUAN PENGUJIAN WEBSITE (WEB TESTING & QA TEST PLAN)
## Portal Informasi Publik & Panel Admin KUA Kecamatan Ngoro

---

## 📌 1. PENDAHULUAN

### 1.1 Deskripsi Aplikasi
Website **KUA Kecamatan Ngoro** adalah portal layanan publik berbasis web yang dibangun menggunakan stack modern:
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, React Router v7, Lucide Icons.
- **Backend CMS & Auth**: Supabase (Database PostgreSQL, Authentication, RLS Policies, Storage).
- **Backend Analytics**: Vercel Serverless Function & Google Analytics Data API v1beta (Google OAuth 2.0).
- **Hosting / Infrastructure**: Vercel.

### 1.2 Tujuan Pengujian
1. Memastikan seluruh fungsi pada **Halaman Publik** berjalan normal, bebas error, dan informatif bagi masyarakat.
2. Memastikan **Panel Admin (`/admin`)** aman, hanya dapat diakses oleh admin terotentikasi, dan fitur CRUD (Create, Read, Update, Delete) berjalan 100% pada database Supabase.
3. Memastikan **Dashboard Analytics** GA4 dapat menampilkan data statistik secara akurat tanpa membocorkan kredensial server.
4. Memastikan **Responsivitas UI** pada perangkat Mobile, Tablet, dan Desktop.
5. Memastikan **Fail-safe & Fallback mechanism** bekerja jika terjadi gangguan koneksi Supabase/API.

---

## 🎯 2. CAKUPAN PENGUJIAN (TEST SCOPE)

```
                       ┌──────────────────────────────────────────┐
                       │      CAKUPAN PENGUJIAN WEB KUA NGORO     │
                       └────────────────────┬─────────────────────┘
                                            │
           ┌────────────────────────────────┴────────────────────────────────┐
           ▼                                                                 ▼
┌─────────────────────┐                                           ┌─────────────────────┐
│   HALAMAN PUBLIK    │                                           │  PANEL ADMIN (/admin)│
├─────────────────────┤                                           ├─────────────────────┤
│ 1. Home / Beranda   │                                           │ 1. Login Auth       │
│ 2. Profil KUA       │                                           │ 2. Admin Guard      │
│ 3. Layanan & Nikah  │                                           │ 3. Dashboard GA4    │
│ 4. Informasi/Berita │                                           │ 4. CRUD 6 Konten    │
│ 5. Galeri & Kegiatan│                                           │ 5. Toggle Status    │
│ 6. Kontak & Lokasi  │                                           │ 6. Maintenance Mode │
│ 7. Bar Jadwal Sholat│                                           │ 7. Upload Media     │
└─────────────────────┘                                           └─────────────────────┘
```

---

## 📋 3. SKENARIO PENGUJIAN & TEST CASES (CHECKLIST)

### A. Pengujian Halaman Publik (Public Website)

| Test ID | Fitur / Komponen | Skenario Pengujian | Langkah-Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|---|
| **PUB-01** | Navigation Bar | Navigasi menu utama | Klik seluruh link menu di Header (Beranda, Profil, Layanan, Informasi, Kegiatan, Kontak). | Halaman berpindah sesuai rute URL tanpa reload penuh (SPA) dan status link aktif berubah warna. | `[ ] Pass` |
| **PUB-02** | Mobile Drawer | Menu navigasi pada layar HP | Buka web pada layar mobile (width < 768px), klik ikon Hamburger Menu. | Drawer slide-in dari kiri dengan rapi. Saat link diklik, drawer otomatis menutup. | `[ ] Pass` |
| **PUB-03** | Jadwal Sholat Bar | Menampilkan jadwal sholat harian | Buka halaman beranda, perhatikan bar jadwal sholat di bawah Navbar. | Menampilkan jam Subuh, Dzuhur, Ashar, Maghrib, Isya untuk Kab. Jombang. Waktu sholat aktif mendapat *highlight badge* putih. | `[ ] Pass` |
| **PUB-04** | Quick Access Bar | Akses cepat lokasi, telepon, WA | Klik kartu Lokasi, Telepon, WhatsApp, dan Jam Pelayanan pada Beranda. | Menampilkan alamat & nomor telepon dinamis dari CMS. Klik WhatsApp membuka `wa.me/` di tab baru. | `[ ] Pass` |
| **PUB-05** | Halaman Profil | Menampilkan profil kelembagaan | Buka halaman `/profil`. | Menampilkan Nama KUA, Deskripsi, Sejarah, Visi & Misi, Wilayah Kerja 13 Desa, dan Daftar Pegawai/Staf dari CMS. | `[ ] Pass` |
| **PUB-06** | Detail Berita | Membaca artikel berita | Buka `/informasi`, lalu klik salah satu kartu berita. | URL berpindah ke `/news/:slug`. Konten berita, judul, penulis, tanggal, dan gambar utama tampil utuh. | `[ ] Pass` |
| **PUB-07** | Filter Galeri | Filtering foto kegiatan | Buka `/kegiatan`, klik tab kategori (Kegiatan, Pelayanan, Acara, Lainnya). | Daftar galeri ter-filter sesuai kategori secara responsif dan cepat. | `[ ] Pass` |
| **PUB-08** | Formulir Kontak | Pengiriman pesan konsultasi | Buka `/kontak`, isi Nama, HP, Topik, Pesan, lalu klik "Kirim via WhatsApp". | Aplikasi membuka WhatsApp Web / Apps dengan teks pesan yang sudah terformat rapi. | `[ ] Pass` |
| **PUB-09** | Maintenance Mode | Tampilan saat situs di-maintenance | Aktifkan Maintenance Mode di Admin Dashboard, lalu buka situs publik di incognito tab. | Seluruh situs publik menampilkan layar "Web dalam Maintenance" dan tidak bisa diakses pengunjung umum. | `[ ] Pass` |

---

### B. Pengujian Autentikasi & Keamanan Panel Admin (`/admin`)

| Test ID | Fitur / Komponen | Skenario Pengujian | Langkah-Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|---|
| **SEC-01** | Admin Guard | Akses paksa tanpa login | Buka langsung URL `/admin` atau `/admin/berita` tanpa login terlebih dahulu. | Sistem otomatis melakukan *redirect* paksa ke halaman `/admin/login`. | `[ ] Pass` |
| **SEC-02** | Login Valid | Login admin dengan kredensial benar | Buka `/admin/login`, masukkan email & password admin terdaftar di Supabase Auth & tabel `admins`. | Login berhasil dan user diarahkan ke halaman `/admin` (Dashboard). | `[ ] Pass` |
| **SEC-03** | Login Invalid | Login dengan email/password salah | Buka `/admin/login`, masukkan password acak. | Login gagal, pesan kesalahan merah muncul, dan user tidak bisa masuk. | `[ ] Pass` |
| **SEC-04** | Non-Admin Auth | Login user biasa yang tidak terdaftar di tabel `admins` | Login dengan akun Supabase Auth yang tidak terdaftar di tabel database `admins`. | Akses ditolak dan user tidak bisa membuka panel admin. | `[ ] Pass` |
| **SEC-05** | Logout | Ke luar dari sesi admin | Di panel admin, klik tombol "Keluar" di bagian bawah sidebar. | Sesi Supabase Auth dihancurkan dan halaman kembali ke `/admin/login`. | `[ ] Pass` |

---

### C. Pengujian Pengelolaan Konten CMS (CRUD Supabase)

| Test ID | Fitur / Komponen | Skenario Pengujian | Langkah-Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|---|
| **CMS-01** | CRUD Berita | Tambah berita baru dengan gambar | Buka `/admin/berita` → Tambah Berita → Upload gambar → Simpan status `published`. | Berita baru tersimpan di database Supabase & file gambar ter-upload di Storage Bucket `media`. Berita langsung muncul di halaman publik `/informasi`. | `[ ] Pass` |
| **CMS-02** | Toggle Status | Ubah status Berita (Draft / Published) | Di `/admin/berita`, klik tombol toggle status berita dari `Published` ke `Draft`. | Status berubah. Berita berstatus `Draft` otomatis tersembunyi dari halaman publik. | `[ ] Pass` |
| **CMS-03** | CRUD Pengumuman | Masa kedaluwarsa pengumuman | Buat pengumuman dengan tanggal `expires_at` kemarin. | Pengumuman tersimpan tetapi otomatis disembunyikan di halaman publik karena sudah expired. | `[ ] Pass` |
| **CMS-04** | Edit Profil KUA | Mengubah alamat & kontak KUA | Buka `/admin/profil`, ubah Alamat Kantor & Nomor Telepon, lalu klik "Simpan Perubahan". | Data tersimpan di tabel `profil`. Halaman publik (`/`, `/profil`, `/kontak`) langsung menampilkan alamat & telepon baru. | `[ ] Pass` |
| **CMS-05** | CRUD Staf | Mengurutkan posisi staf | Buka `/admin/staf`, ubah nilai kolom `order` staf. | Urutan staf di halaman `/profil` berubah sesuai nomor urut terkecil. | `[ ] Pass` |
| **CMS-06** | CRUD Galeri | Hapus foto galeri | Di `/admin/galeri`, klik ikon Hapus pada salah satu foto → Konfirmasi Ya. | Data terhapus dari Supabase dan foto hilang dari halaman `/kegiatan`. | `[ ] Pass` |

---

### D. Pengujian Dashboard Analytics GA4 (Google OAuth 2.0)

| Test ID | Fitur / Komponen | Skenario Pengujian | Langkah-Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|---|
| **ANA-01** | Vercel Function API | Verifikasi endpoint `/api/analytics` | Panggil GET `/api/analytics` tanpa Authorization header. | API merespons `401 Unauthorized` (Akses ditolak untuk menjaga privasi data). | `[ ] Pass` |
| **ANA-02** | Data Analytics UI | Menampilkan data statistik GA4 | Login sebagai admin, buka halaman `/admin`. | Komponen *Analytics Website* memuat 4 Stat Cards, Grafik SVG 7/30/90 Hari, Top Pages, Sumber Traffic, & Perangkat. | `[ ] Pass` |
| **ANA-03** | Filter Periode | Mengubah periode 7 / 30 / 90 Hari | Klik tombol pilihan "7 Hari", "30 Hari", atau "90 Hari". | Data grafik dan angka statistik diperbarui sesuai periode yang dipilih. | `[ ] Pass` |
| **ANA-04** | Tombol Refresh | Memperbarui data analytics | Klik tombol `↻ Refresh`. | Ikon berputar (loading) dan data terbaru dari GA Data API diambil ulang tanpa reload halaman. | `[ ] Pass` |
| **ANA-05** | Unconfigured State | Penanganan jika env GA4 belum diisi | Hapus/kosongkan sementara env GA4 di Vercel. | Dashboard menampilkan pesan edukatif bahwa GA4 belum dikonfigurasi, tanpa merusak halaman admin lainnya. | `[ ] Pass` |

---

## 🐞 4. PANDUAN PELAPORAN BUG (BUG REPORTING GUIDE)

Jika Tester menemukan kegagalan (*Fail*) saat melakukan pengujian, buat laporan bug dengan format standar berikut:

### Format Laporan Bug (Bug Report Template)
```markdown
### 🐛 [BUG REPORT] - [Judul Singkat Masalah]

- **ID Test Case**: (Contoh: CMS-01 / SEC-02)
- **Modul / Halaman**: (Contoh: /admin/berita)
- **Tingkat Keparahan (Severity)**: [Critical / Major / Minor / Low]
- **Perangkat / Browser**: (Contoh: Windows 11 / Chrome v122 / iPhone 14 Safari)

#### 📝 Langkah Reproduksi (Steps to Reproduce):
1. Buka halaman `/admin/berita`
2. Klik tombol "Tambah Berita"
3. Unggah gambar berukuran 5MB
4. Klik "Simpan"

#### ❌ Hasil yang Terjadi (Actual Result):
Layar menjadi putih (blank screen) dan muncul error HTTP 413 pada Console Browser.

#### ✅ Hasil yang Diharapkan (Expected Result):
Sistem menampilkan pesan peringatan merah: "Ukuran gambar terlalu besar (Maksimal 2 MB)".

#### 📷 Bukti Screenshot / Console Log:
[ Lampirkan Foto / File Screenshot di sini ]
```

---

## 📊 5. METRIK KELAYAKAN RILIS (RELEASE CRITERIA)

Website dinyatakan **SIAP RILIS (READY FOR PRODUCTION)** apabila memenuhi kriteria berikut:
1. **Critical & Major Bugs = 0** (Tidak ada error yang membuat sistem crash atau kebocoran keamanan).
2. **Pass Rate Test Cases ≥ 95%**.
3. **Build Status**: Perintah `npm run build` berjalan sukses tanpa error TypeScript.
4. **Linter Status**: Perintah `npx oxlint src api` terbebas dari kesalahan kritis.
5. **SEO & Accessibility**: Tidak ada broken links pada halaman publik.
