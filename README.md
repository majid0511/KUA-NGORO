# KUA Kecamatan Ngoro — Website Resmi

Website portal layanan resmi KUA Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur. Dibangun dengan **React + TypeScript + Vite** dan **Tailwind CSS v4**.

## Fitur

- **Beranda** — Hero dengan foto KUA, ringkasan layanan, informasi, kegiatan, dan kontak.
- **Profil** — Profil KUA, struktur organisasi, dan staf.
- **Layanan** — Daftar layanan resmi urusan agama.
- **Informasi** — Informasi umum seputar layanan keagamaan.
- **Kontak** — Kanal kontak resmi KUA Ngoro.

## Teknologi

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) — build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [React Router](https://reactrouter.com) — routing
- [Lucide React](https://lucide.dev) — ikon
- [Oxlint](https://oxc.rs) — linter

## Struktur Proyek

```
src/
├── assets/          # Gambar & aset statis (mis. hero.png)
├── components/      # Komponen UI (Navbar, Hero, Footer, dll.)
├── config/          # Konfigurasi data (site, services, profile, information)
├── pages/           # Halaman (Home, Profile, Services, Information, Contact)
├── App.tsx          # Routing utama
├── index.css        # Tema & style global
└── main.tsx         # Entry point
```

## Menjalankan di Lokal

```bash
# Install dependensi
npm install

# Jalankan dev server (http://localhost:5173)
npm run dev

# Build produksi
npm run build

# Preview hasil build
npm run preview

# Lint
npm run lint
```

## Mengganti Foto Hero

Ganti file `src/assets/hero.png` dengan foto KUA yang diinginkan. Foto akan otomatis tampil sebagai latar belakang transparan di bagian hero halaman beranda.

## Ukuran Foto Staff

Foto staff ditampilkan berbentuk lingkaran (bulat) dengan ukuran tampilan 96×96 px. Untuk hasil yang tajam di layar retina, gunakan foto dengan ketentuan:

| Aspek | Rekomendasi |
| --- | --- |
| Format | JPG atau PNG |
| Ukuran minimum | 400×400 px (persegi) |
| Ukuran ideal | 800×800 px (persegi) |
| Ukuran maksimal | 1200×1200 px |
| Ukuran file | ≤ 200 KB |
| Orientasi | Persegi (1:1) — hindari potret/lanskap agar tidak terpotong |

> Foto potret (seperti 960×1088 px) tetap bisa dipakai karena `object-cover` akan memotong bagian tepinya, tetapi hasil terbaik didapat dari foto persegi.

Letakkan file foto di folder `public/staff/` dan isi `photoUrl` di `src/config/profile.ts` dengan path-nya, contoh: `/staff/kiki.jpg`.

## Konfigurasi Data

Data kontak, layanan, profil, dan informasi dikelola di folder `src/config/`:

| File | Isi |
| --- | --- |
| `site.ts` | Identitas & kontak resmi KUA |
| `services.ts` | Daftar layanan |
| `profile.ts` | Profil, staf, kegiatan |
| `information.ts` | Topik informasi |

> **Catatan:** Field yang masih kosong (mis. alamat, telepon, email) sengaja dibiarkan kosong dan hanya akan diisi setelah data resmi terverifikasi.

## Lisensi

Hak cipta © 2026 KUA Kecamatan Ngoro. Seluruh konten dan aset adalah milik KUA Kecamatan Ngoro.