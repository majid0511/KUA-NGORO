# KUA Kecamatan Ngoro

> **Portal Informasi Publik & Layanan Digital Keagamaan**
> Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur.
>
> **Internship Project • 2026**

---

## 📖 Tentang Project

**KUA Ngoro Website** adalah sebuah portal informasi publik dan layanan digital keagamaan yang dikembangkan sebagai bagian dari **project magang** di KUA Kecamatan Ngoro, Kabupaten Jombang.

Website ini dirancang sebagai pusat informasi yang membantu masyarakat memperoleh informasi mengenai profil KUA, layanan keagamaan, informasi pernikahan, berita, pengumuman, kegiatan, serta kontak dan lokasi kantor.

Konsep desain yang digunakan:

**Modern Islamic Governmental Minimalism**

Dengan pendekatan:

* Profesional
* Tenang dan terpercaya
* Mudah dipahami masyarakat umum
* Accessible
* Mobile-first
* Fokus pada informasi dan layanan publik

> **Project Status:** Internship Project
> **Year:** 2026
> **Institution:** IAI At-Tahdzib Jombang
> **Location:** KUA Kecamatan Ngoro, Kabupaten Jombang

---

## 🎯 Tujuan

Project ini dikembangkan dengan beberapa tujuan utama:

1. Membuat pusat informasi digital untuk KUA Kecamatan Ngoro.
2. Mempermudah masyarakat dalam menemukan informasi layanan KUA.
3. Menyediakan informasi pernikahan dan panduan calon pengantin secara lebih terstruktur.
4. Menyediakan media publikasi berita, pengumuman, dan kegiatan.
5. Membangun fondasi website yang dapat dikembangkan dan dikelola secara berkelanjutan.
6. Memisahkan antara sistem pengelolaan konten dan tampilan website melalui pendekatan **Headless CMS**.

---

## ✨ Fitur Utama

### 🏛️ Profil KUA

Menyediakan informasi mengenai:

* Profil kantor
* Sejarah
* Visi dan misi
* Struktur organisasi
* Direktori staf

### 📋 Direktori Layanan

Informasi mengenai layanan KUA, termasuk:

* Pencatatan pernikahan
* SIMKAH
* Wakaf
* Zakat
* Hisab dan Rukyat
* Layanan keagamaan lainnya

Setiap layanan dapat memiliki informasi:

* Deskripsi
* Persyaratan
* Prosedur
* Estimasi waktu
* Status layanan

### 💍 Portal Calon Pengantin

Menyediakan informasi praktis bagi calon pengantin, seperti:

* Alur pernikahan
* Persiapan administrasi
* Checklist dokumen
* Panduan SIMKAH
* Tahapan pelayanan

### 📰 Pusat Informasi

Pusat publikasi untuk:

* Berita
* Pengumuman
* Informasi terbaru
* Dokumentasi kegiatan

Konten berita dan pengumuman dirancang agar dapat dikelola melalui Headless CMS.

### 🖼️ Galeri Kegiatan

Menampilkan dokumentasi kegiatan KUA dalam bentuk galeri visual.

### 📍 Kontak & Lokasi

Menyediakan:

* Informasi kontak
* WhatsApp
* Alamat kantor
* Google Maps
* Informasi jam pelayanan

---

# 🧠 Headless CMS

Website dirancang dengan arsitektur **Headless CMS** menggunakan **Sanity.io** sebagai sistem pengelolaan konten.

Pendekatan ini memisahkan antara:

**Content Management**
dan
**Frontend Presentation**

Sehingga pengelola dapat memperbarui konten tanpa harus mengubah source code frontend.

### Arsitektur

```text
┌──────────────────────────┐
│     ADMIN / PENGELOLA    │
│           KUA            │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      SANITY STUDIO       │
│      CMS Dashboard       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       SANITY API         │
│      GROQ Queries        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      src/lib/cms/        │
│  CMS Abstraction Layer   │
│    + Fallback System     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     React + Vite         │
│       Frontend           │
└──────────────────────────┘
```

---

## Kenapa Headless CMS?

### 👨‍💼 Untuk Pengelola

Pengelola dapat mengubah konten melalui dashboard CMS tanpa harus memahami React, TypeScript, atau source code.

Contohnya:

```text
Admin membuka Sanity Studio
        ↓
Membuat berita baru
        ↓
Upload gambar
        ↓
Publish
        ↓
Website mengambil data melalui API
        ↓
Berita tampil di website
```

### 👨‍💻 Untuk Developer

Frontend tetap memiliki struktur kode yang terorganisasi karena komunikasi dengan CMS dipusatkan pada:

```text
src/lib/cms/
```

Dengan demikian komponen UI tidak perlu mengetahui detail implementasi API CMS.

---

# 📋 Content Models

Website menggunakan enam jenis konten utama.

| # | Koleksi        | Field Utama                                                                                               |
| - | -------------- | --------------------------------------------------------------------------------------------------------- |
| 1 | **Berita**     | `title`, `slug`, `excerpt`, `content`, `featured_image`, `category`, `author`, `published_at`, `status`   |
| 2 | **Pengumuman** | `title`, `content`, `published_at`, `expires_at`, `priority`, `status`                                    |
| 3 | **Layanan**    | `title`, `slug`, `description`, `requirements`, `procedure`, `estimated_time`, `icon`, `status`, `order`  |
| 4 | **Profil**     | `office_name`, `description`, `history`, `vision`, `mission`, `address`, `phone`, `email`, `office_hours` |
| 5 | **Staf**       | `name`, `position`, `photo`, `bio`, `order`, `active`                                                     |
| 6 | **Galeri**     | `title`, `image`, `description`, `category`, `published_at`                                               |

### Status Konten

Konten yang membutuhkan publikasi menggunakan status:

```text
Draft
  ↓
Review
  ↓
Published
```

Konten yang belum dipublikasikan tidak ditampilkan kepada pengunjung.

---

# 🛠️ Tech Stack

| Kategori      | Teknologi           |
| ------------- | ------------------- |
| Framework     | React 19            |
| Language      | TypeScript          |
| Build Tool    | Vite                |
| Styling       | Tailwind CSS v4     |
| Routing       | React Router        |
| CMS Client    | `@sanity/client`    |
| Animation     | Framer Motion       |
| Smooth Scroll | Lenis               |
| Icons         | Lucide React        |
| Linter        | OxLint              |

---

# 📁 Project Structure

```text
kua-ngoro-website/
│
├── public/
│   └── # Static assets
│
├── src/
│   │
│   ├── assets/
│   │   └── # Branding & media
│   │
│   ├── components/
│   │   │
│   │   ├── cards/
│   │   │   ├── NewsCard
│   │   │   ├── ServiceCard
│   │   │   ├── ActivityCard
│   │   │   ├── StaffCard
│   │   │   └── OfficialLinkCard
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar
│   │   │   ├── Footer
│   │   │   └── MobileStickyBar
│   │   │
│   │   ├── navigation/
│   │   │   ├── NavLinks
│   │   │   └── MobileDrawer
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroSection
│   │   │   ├── QuickAccessSection
│   │   │   ├── AboutSection
│   │   │   ├── ServicesSection
│   │   │   ├── MarriageTimelineSection
│   │   │   ├── NewsSection
│   │   │   ├── ActivitiesSection
│   │   │   ├── OfficialLinksSection
│   │   │   ├── LocationSection
│   │   │   └── ContactCtaSection
│   │   │
│   │   └── ui/
│   │       ├── Button
│   │       ├── SectionHeading
│   │       ├── Modal
│   │       ├── Accordion
│   │       ├── Badge
│   │       ├── SearchInput
│   │       └── CmsState
│   │
│   ├── data/
│   │   └── # Local fallback data
│   │
│   ├── hooks/
│   │   └── useScrollPosition
│   │
│   ├── lib/
│   │   └── cms/
│   │       ├── types.ts
│   │       ├── client.ts
│   │       ├── berita.ts
│   │       ├── pengumuman.ts
│   │       ├── layanan.ts
│   │       ├── profil.ts
│   │       ├── staf.ts
│   │       ├── galeri.ts
│   │       └── index.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   ├── Services.tsx
│   │   ├── Marriage.tsx
│   │   ├── Information.tsx
│   │   ├── NewsDetail.tsx
│   │   ├── Activities.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   │
│   ├── utils/
│   │   └── cn()
│   │
│   ├── App.tsx
│   └── index.css
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 🔌 CMS Abstraction Layer

Komunikasi antara frontend dan Sanity dipusatkan pada:

```text
src/lib/cms/
```

Contoh API internal:

```ts
getBerita()
getBeritaBySlug()
getPengumuman()
getLayanan()
getLayananBySlug()
getProfil()
getStaf()
getGaleri()
```

Komponen frontend hanya berinteraksi dengan fungsi tersebut.

Contoh:

```text
Page
 ↓
CMS Function
 ↓
CMS Client
 ↓
Sanity API
 ↓
Data
```

Hal ini membuat implementasi CMS lebih mudah dipelihara dan memungkinkan sumber data diganti di masa depan tanpa harus mengubah seluruh komponen frontend.

---

# 🛡️ Fallback & Error Handling

Website dirancang agar tetap dapat digunakan ketika CMS belum tersedia atau mengalami gangguan.

| Kondisi                 | Perilaku                   |
| ----------------------- | -------------------------- |
| CMS tidak dikonfigurasi | Menggunakan data lokal     |
| API gagal / timeout     | Fallback ke data lokal     |
| CMS aktif, data kosong  | Menampilkan `EmptyState` (tidak fallback) |
| Fetch error             | Menampilkan `ErrorState`   |
| Gambar gagal dimuat     | Menggunakan fallback image |

### CMS State Components

Tersedia pada:

```text
src/components/ui/CmsState.tsx
```

Komponen:

```tsx
<LoadingState />
<EmptyState />
<ErrorState />
```

Tujuannya adalah mencegah pengalaman pengguna berubah menjadi halaman kosong ketika sumber data mengalami masalah.

---

# ⚙️ Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```env
# Sanity Project (publik, read-only)
VITE_CMS_PROJECT_ID=your_sanity_project_id
VITE_CMS_DATASET=production
```

> **Security Note**
>
> Environment variable dengan prefix `VITE_` tersedia pada frontend/browser setelah proses build. Jangan memasukkan **admin token, write token, atau secret credential** ke dalam variable tersebut.
>
> Website hanya membaca konten publik, jadi dataset Sanity harus bersifat **public** dan tidak memerlukan token.

Jika CMS tidak dikonfigurasi, website tetap dapat menggunakan data fallback lokal.

## Setup Sanity Studio

Schema konten ada di folder `studio/` (Berita, Pengumuman, Layanan, Profil, Staf, Galeri) dan sudah cocok dengan query di `src/lib/cms/`.

```bash
cd studio
npm install
npx sanity login
npx sanity init --env   # pilih "Create new project" atau project yang ada, dataset: production
```

1. Isi `SANITY_STUDIO_PROJECT_ID` di `studio/.env`, lalu `npm run dev` untuk membuka Studio lokal.
2. Di sanity.io/manage: **API → CORS origins**, tambahkan URL website (dan `http://localhost:5173` untuk dev). Tanpa ini browser akan memblokir request.
3. Pastikan dataset `production` bersifat public (**Datasets → Visibility**).
4. Salin Project ID ke `.env` di root (`VITE_CMS_PROJECT_ID`).
5. `npm run deploy` di folder `studio` untuk publish Studio ke `<nama>.sanity.studio`.

Hanya dokumen dengan status `published` (berita, pengumuman) atau `active` (layanan) yang tampil di website.

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/majid0511/KUA-NGORO.git
```

Masuk ke directory project:

```bash
cd KUA-NGORO
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Konfigurasi Environment

Salin `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

Kemudian masukkan konfigurasi Sanity jika CMS digunakan.

## 4. Jalankan Development Server

```bash
npm run dev
```

Website akan tersedia melalui development server Vite.

## 5. Jalankan Linter

```bash
npm run lint
```

## 6. Build Production

```bash
npm run build
```

---

# 🗺️ Routes

| Route                 | Halaman                | CMS                 |
| --------------------- | ---------------------- | ------------------- |
| `/`                   | Beranda                | —                   |
| `/profil`             | Profil KUA             | Profil + Staf       |
| `/layanan`            | Direktori Layanan      | Layanan             |
| `/layanan/pernikahan` | Portal Calon Pengantin | —                   |
| `/informasi`          | Berita & Pengumuman    | Berita + Pengumuman |
| `/news/:slug`         | Detail Berita          | Berita              |
| `/kegiatan`           | Galeri Kegiatan        | Galeri              |
| `/kontak`             | Kontak & Lokasi        | —                   |

---

# 📱 Responsive Design

Website dikembangkan dengan pendekatan **mobile-first** untuk memastikan informasi tetap mudah diakses melalui berbagai perangkat.

Target perangkat:

* 📱 Mobile
* 📲 Tablet
* 💻 Laptop
* 🖥️ Desktop

Elemen navigasi dan konten dirancang agar tetap nyaman digunakan pada layar berukuran kecil maupun besar.

---

# ♿ Accessibility

Beberapa prinsip accessibility yang diterapkan meliputi:

* Semantic HTML
* Struktur heading yang terorganisasi
* Kontras warna yang diperhatikan
* `alt` text untuk gambar
* Keyboard-friendly interaction
* Responsive typography
* Tombol dan link dengan area interaksi yang memadai
* State loading, empty, dan error yang informatif

---

# ⚡ Performance

Beberapa pendekatan yang digunakan:

* Vite production build
* Lazy loading gambar
* Responsive image handling
* CMS image optimization
* Component-based architecture
* Pemisahan data dan presentation layer
* Fallback data untuk mengurangi ketergantungan terhadap satu sumber data

---

# 🔗 Integrasi Informasi Resmi

Website dapat menyediakan akses menuju sumber informasi resmi terkait layanan KUA dan Kementerian Agama.

Link eksternal dapat diarahkan ke sumber resmi seperti:

* Kementerian Agama Republik Indonesia
* Kantor Wilayah Kementerian Agama Jawa Timur
* Sistem informasi terkait layanan pernikahan
* Sumber informasi pemerintah lainnya

Informasi dan link resmi harus diverifikasi sebelum dipublikasikan kepada masyarakat.

---

# 🧪 Testing Checklist

Sebelum deployment, beberapa bagian yang perlu diuji:

### Pages

* [ ] Beranda
* [ ] Profil
* [ ] Layanan
* [ ] Portal Pernikahan
* [ ] Informasi
* [ ] Detail Berita
* [ ] Kegiatan
* [ ] Kontak
* [ ] 404

### CMS

* [ ] CMS aktif
* [ ] CMS tidak dikonfigurasi
* [ ] API gagal
* [ ] API timeout
* [ ] Data kosong
* [ ] Data berita
* [ ] Data pengumuman
* [ ] Data layanan
* [ ] Data profil
* [ ] Data staf
* [ ] Data galeri
* [ ] Gambar CMS

### Responsive

* [ ] Mobile
* [ ] Tablet
* [ ] Desktop

### Routing

* [ ] Navigasi internal
* [ ] Direct URL
* [ ] Browser refresh
* [ ] Invalid route
* [ ] `/news/:slug`

### Build

```bash
npm run lint
npm run build
```

---

# ☁️ Deployment

Project dapat dideploy menggunakan platform hosting modern yang mendukung aplikasi Vite/React.

Contoh:

* Vercel
* Netlify
* Cloudflare Pages
* Static hosting lainnya

Untuk deployment menggunakan Vercel, pastikan konfigurasi environment variables telah ditambahkan pada project deployment.

---

# 🧩 Development Philosophy

Project ini tidak hanya berfokus pada tampilan website, tetapi juga pada bagaimana sebuah website informasi publik dapat dikembangkan menjadi sistem yang:

```text
Simple
   ↓
Maintainable
   ↓
Scalable
   ↓
Manageable
   ↓
Sustainable
```

Beberapa prinsip yang digunakan:

### Separation of Concerns

Data, UI, routing, dan CMS dipisahkan berdasarkan tanggung jawabnya.

### Progressive Enhancement

Website tetap memiliki data fallback ketika layanan eksternal belum tersedia.

### Content Independence

Konten publik tidak harus melekat langsung pada source code frontend.

### Maintainability

Struktur folder dan abstraction layer dibuat agar project dapat dikembangkan oleh developer berikutnya.

---

# 👨‍💻 Developer

Project ini dikembangkan sebagai bagian dari kegiatan magang mahasiswa:

**Mahasiswa Program Studi Hukum Keluarga (Syariah)**
**IAI At-Tahdzib Jombang**

> **Internship Project • 2026**

Kontribusi utama mencakup perancangan konsep, UI/UX, pengembangan frontend, struktur aplikasi, integrasi CMS, serta deployment dan dokumentasi project.

---

# 🏛️ Project Context

**KUA Kecamatan Ngoro**
Kabupaten Jombang, Jawa Timur

Project ini dibuat dalam konteks kegiatan magang dan pengembangan media informasi digital.

> **Catatan:** Status project sebagai *internship project* tidak dengan sendirinya berarti website ini merupakan situs resmi pemerintah atau telah menjadi sistem operasional resmi KUA. Informasi kelembagaan, kontak, layanan, dan tautan eksternal perlu diverifikasi oleh pihak terkait sebelum digunakan sebagai informasi publik resmi.

---

# 📄 License

Project ini dibuat untuk kebutuhan:

* Internship
* Portfolio
* Pembelajaran
* Pengembangan teknologi informasi
* Dokumentasi project

Penggunaan identitas, logo, data kelembagaan, maupun informasi resmi KUA harus memperhatikan izin dan ketentuan dari pihak terkait.

---

## 🌱 Legacy

> **Built as an internship project. Designed to remain useful beyond the internship.**

Project ini diharapkan tidak berhenti sebagai hasil tugas magang, tetapi menjadi fondasi yang dapat dikembangkan lebih lanjut apabila dibutuhkan.

**2026 • KUA Kecamatan Ngoro × IAI At-Tahdzib Jombang**
