# KUA Kecamatan Ngoro Website

> **Official Public Information & Digital Service Portal**  
> Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur.  
> *Developed during internship project — 2026*

---

## 📌 Project Overview

Portal web resmi **KUA Kecamatan Ngoro** dirancang sebagai pusat informasi publik dan layanan digital keagamaan untuk seluruh warga di 13 desa se-Kecamatan Ngoro, Kabupaten Jombang. Website ini memiliki konsep visual **Modern Islamic Governmental Minimalism** yang profesional, tenang, accessible, dan mudah digunakan masyarakat (terutama pengguna perangkat seluler/mobile-first).

### Main Objectives:
- Menyediakan informasi resmi profil, tugas, dan fungsi KUA Ngoro.
- Memfasilitasi pendaftaran nikah online via SIMKAH 4.0 dan panduan transparan biaya nikah (Rp 0 di KUA vs Rp 600.000 Bedol).
- Menyediakan direktori 6 layanan utama KUA (Pernikahan, Kemasjidan, Wakaf, Keluarga Sakinah, Bimbingan Keagamaan, Informasi Keagamaan).
- Publikasi pengumuman, berita, dan galeri dokumentasi kegiatan KUA Ngoro.
- Menghubungkan langsung masyarakat dengan saluran kontak resmi WhatsApp & lokasi Google Maps KUA.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router 7 (`react-router-dom`)
- **Styling**: Modern CSS & Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Smooth Scroll**: Lenis

---

## 📁 Project Structure

```text
src/
├── assets/                 # Custom static images & branding assets
├── components/
│   ├── cards/              # ServiceCard, NewsCard, ActivityCard, StaffCard, OfficialLinkCard
│   ├── layout/             # Navbar (Sticky header), Footer (Institutional), Page headers
│   ├── navigation/         # NavLinks, MobileDrawer
│   ├── sections/           # HeroSection, QuickAccessSection, AboutSection, ServicesSection,
│   │                       # MarriageTimelineSection, NewsSection, ActivitiesSection,
│   │                       # OfficialLinksSection, LocationSection, ContactCtaSection
│   └── ui/                 # Button, SectionHeading, Modal, Accordion, Badge, SearchInput
├── data/
│   ├── profile.ts          # Profil KUA, visi-misi, tugas fungsi, bagan organisasi, daftar staf
│   ├── services.ts         # 6 Layanan utama & sistem digital Kemenag
│   ├── news.ts             # Pengumuman, berita kegiatan, dan artikel edukasi
│   ├── activities.ts       # Dokumentasi foto & galeri kegiatan
│   ├── officialLinks.ts    # Tautan resmi Kemenag RI, Kanwil Jatim, Kemenag Jombang, SIMKAH, SIWAK
│   ├── marriage.ts         # Prosedur nikah, checklist berkas N1-N6, & transparansi biaya
│   └── faq.ts              # Tanya jawab publik (FAQ)
├── hooks/
│   └── useScrollPosition.ts # Hook pelacak posisi scroll untuk sticky navbar
├── pages/
│   ├── Home.tsx            # Beranda utama (12 section terintegrasi)
│   ├── Profile.tsx         # Profil lengkap, Visi Misi, Tugas, Organisasi, Pegawai
│   ├── Services.tsx        # Direktori layanan & modal persyaratan
│   ├── Marriage.tsx        # Portal Calon Pengantin, alur nikah, checklist berkas & SIMKAH
│   ├── Information.tsx     # Pusat informasi, pencarian pengumuman & berita
│   ├── Activities.tsx      # Galeri arsip kegiatan KUA Ngoro
│   ├── Contact.tsx         # Hub kontak resmi, formulir WhatsApp, & Google Maps
│   └── NotFound.tsx        # Halaman 404
├── utils/
│   └── cn.ts               # Helper penggabung class name
├── App.tsx                 # Root router & layout wrapper
├── main.tsx                # Entry point aplikasi
└── index.css               # Design system tokens & utility classes
```

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js version `>= 18.0.0`
- npm version `>= 9.0.0`

### Step-by-Step

1. **Clone & Extract Repository**:
   ```bash
   cd kua-ngoro-website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal di `http://localhost:5173`.

4. **Run Linter**:
   ```bash
   npm run lint
   ```

---

## 📦 Production Build & Deployment

1. **Build Project**:
   ```bash
   npm run build
   ```
   Hasil kompilasi produksi akan tersimpan di dalam folder `dist/`.

2. **Preview Production Build**:
   ```bash
   npm run preview
   ```

3. **Deployment**:
   Folder `dist/` siap didistribusikan ke web server static host seperti Vercel, Netlify, Cloudflare Pages, atau cPanel web hosting instansi Kemenag.

---

## 📝 Content Management & Data Update Guide

Seluruh data konten bersifat terpisah dari komponen UI (data-driven architecture) sehingga memudahkan pengembang berikutnya untuk memperbarui informasi tanpa perlu mengubah kode JSX:

- **Memperbarui Data Profil / Pegawai / Visi Misi**: Edit file [`src/data/profile.ts`](file:///c:/Users/attah/OneDrive/문서/HILMI%20NITIP/tes/kua-ngoro-website/src/data/profile.ts)
- **Memperbarui Layanan**: Edit file [`src/data/services.ts`](file:///c:/Users/attah/OneDrive/문서/HILMI%20NITIP/tes/kua-ngoro-website/src/data/services.ts)
- **Menambah Pengumuman / Berita**: Edit file [`src/data/news.ts`](file:///c:/Users/attah/OneDrive/문서/HILMI%20NITIP/tes/kua-ngoro-website/src/data/news.ts)
- **Menambah Foto Galeri Kegiatan**: Edit file [`src/data/activities.ts`](file:///c:/Users/attah/OneDrive/문서/HILMI%20NITIP/tes/kua-ngoro-website/src/data/activities.ts)
- **Memperbarui Persyaratan Nikah**: Edit file [`src/data/marriage.ts`](file:///c:/Users/attah/OneDrive/문서/HILMI%20NITIP/tes/kua-ngoro-website/src/data/marriage.ts)

*Catatan: Apabila terdapat data resmi KUA seperti foto pegawai atau nomor SK baru, ganti placeholder yang ditandai dengan comment `TODO: Replace with verified KUA data`.*

---

## 🔮 Future Development Roadmap

1. **Integrasi Headless CMS**: Menghubungkan file data dengan Strapi / Directus agar staf KUA dapat menambah berita tanpa menyentuh kode.
2. **Formulir Cek Berkas Realtime**: Integrasi API SIMKAH 4.0 untuk pelacakan status pemeriksaan nikah masyarakat.
3. **Peta Interaktif Lokasi Tanah Wakaf**: Visualisasi lokasi tanah wakaf bersertifikat di 13 desa se-Kecamatan Ngoro.

---

**KUA Kecamatan Ngoro Website**  
*Developed with excellence during internship project • 2026*