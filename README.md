# KUA Kecamatan Ngoro — Website Resmi

> **Portal Informasi Publik & Layanan Digital Keagamaan**  
> Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur.  
> *Internship Project • 2026*

---

## 📌 Tentang Project

**KUA Ngoro Website** adalah portal web resmi Kantor Urusan Agama Kecamatan Ngoro yang dirancang sebagai pusat informasi publik dan layanan digital keagamaan bagi seluruh warga di 13 desa se-Kecamatan Ngoro, Kabupaten Jombang.

Konsep desain: **Modern Islamic Governmental Minimalism** — profesional, tenang, accessible, dan mobile-first.

Fitur utama:
- Informasi profil, visi-misi, dan struktur organisasi KUA
- Direktori layanan (Pencatatan Nikah, SIMKAH, Wakaf, Zakat, Hisab Rukyat, dan lainnya)
- Portal Calon Pengantin (alur nikah, checklist berkas, panduan SIMKAH)
- Pusat berita & pengumuman resmi yang dapat dikelola melalui Headless CMS
- Galeri dokumentasi kegiatan
- Kontak resmi, WhatsApp, dan Google Maps embed

---

## 🌐 Headless CMS Integration

Website ini terintegrasi dengan **Headless CMS** berbasis cloud (**Sanity.io**) agar pengelola/admin KUA dapat memperbarui konten publik secara mandiri melalui dashboard admin — tanpa menyentuh source code.

### Arsitektur Data

```
ADMIN / PENGELOLA KUA
        ↓
 Sanity Studio (Dashboard CMS)
        ↓
 Sanity API (GROQ)
        ↓
 src/lib/cms/   ← Abstraction & Fallback Layer
        ↓
 React + Vite Frontend
```

### Mengapa Sanity.io?
| Keunggulan | Keterangan |
|---|---|
| **Free Tier** | 100k API req/hari — ideal untuk website instansi publik |
| **Dashboard Non-Developer** | Admin KUA dapat edit berita, pengumuman & upload foto tanpa coding |
| **Fallback Otomatis** | Jika CMS belum dikonfigurasi atau API gagal, website tetap tampil menggunakan data lokal di `src/data/` |
| **GROQ Query** | Bahasa query yang ekspresif dan efisien untuk filter & sorting konten |

---

## 📋 Content Models (6 Koleksi)

| # | Koleksi | Field Utama |
|---|---|---|
| 1 | **Berita** | `title`, `slug`, `excerpt`, `content`, `featured_image`, `category`, `author`, `published_at`, `status` |
| 2 | **Pengumuman** | `title`, `content`, `published_at`, `expires_at`, `priority`, `status` |
| 3 | **Layanan** | `title`, `slug`, `description`, `requirements`, `procedure`, `estimated_time`, `icon`, `status`, `order` |
| 4 | **Profil** | `office_name`, `description`, `history`, `vision`, `mission`, `address`, `phone`, `email`, `office_hours` |
| 5 | **Staf** | `name`, `position`, `photo`, `bio`, `order`, `active` |
| 6 | **Galeri** | `title`, `image`, `description`, `category`, `published_at` |

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| CMS Client | `@sanity/client` + `@sanity/image-url` |
| Animasi | Framer Motion |
| Scroll | Lenis |
| Icons | Lucide React |
| Linter | OxLint |

---

## 📁 Struktur Project

```
kua-ngoro-website/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Branding & media
│   ├── components/
│   │   ├── cards/              # NewsCard, ServiceCard, ActivityCard, StaffCard, OfficialLinkCard
│   │   ├── layout/             # Navbar, Footer, MobileStickyBar
│   │   ├── navigation/         # NavLinks, MobileDrawer
│   │   ├── sections/           # HeroSection, QuickAccessSection, AboutSection,
│   │   │                       # ServicesSection, MarriageTimelineSection, NewsSection,
│   │   │                       # ActivitiesSection, OfficialLinksSection, LocationSection,
│   │   │                       # ContactCtaSection
│   │   └── ui/                 # Button, SectionHeading, Modal, Accordion, Badge,
│   │                           # SearchInput, CmsState (Loading / Empty / Error)
│   ├── data/                   # Local fallback data (profile, services, news, activities, marriage, faq)
│   ├── hooks/                  # useScrollPosition
│   ├── lib/
│   │   └── cms/                # Headless CMS Integration Layer
│   │       ├── types.ts        # TypeScript interfaces (6 content models)
│   │       ├── client.ts       # Fetcher + queryWithFallback engine
│   │       ├── berita.ts       # getBerita(), getBeritaBySlug()
│   │       ├── pengumuman.ts   # getPengumuman() (+ client-side expiry filter)
│   │       ├── layanan.ts      # getLayanan(), getLayananBySlug()
│   │       ├── profil.ts       # getProfil()
│   │       ├── staf.ts         # getStaf()
│   │       ├── galeri.ts       # getGaleri()
│   │       └── index.ts        # Re-export barrel
│   ├── pages/
│   │   ├── Home.tsx            # Beranda utama
│   │   ├── Profile.tsx         # Profil, Visi-Misi, Struktur Organisasi, Staf (CMS)
│   │   ├── Services.tsx        # Direktori layanan + modal persyaratan (CMS)
│   │   ├── Marriage.tsx        # Portal Calon Pengantin, alur nikah, SIMKAH
│   │   ├── Information.tsx     # Pusat berita & pengumuman (CMS)
│   │   ├── NewsDetail.tsx      # Detail berita /news/:slug (CMS)
│   │   ├── Activities.tsx      # Galeri kegiatan (CMS)
│   │   ├── Contact.tsx         # Kontak resmi, WhatsApp, peta
│   │   └── NotFound.tsx        # Halaman 404
│   ├── utils/                  # cn() helper
│   ├── App.tsx                 # Root router & layout
│   └── index.css               # Design system tokens & utilities
├── .env.example                # Template environment variables
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Environment Variables

Salin `.env.example` menjadi `.env`, lalu isi kredensial Sanity Anda:

```env
# Sanity.io Project ID & Dataset
VITE_CMS_PROJECT_ID=your_sanity_project_id
VITE_CMS_DATASET=production

# Optional: Generic REST API URL (alternatif non-Sanity)
VITE_CMS_API_URL=

# Optional: Read token (jika dataset bersifat private)
VITE_CMS_TOKEN=
```

> **Catatan:** Jika `.env` tidak dikonfigurasi, website tetap berjalan normal menggunakan data lokal di `src/data/`. Tidak ada halaman yang akan blank atau crash.

---

## 🚀 Cara Menjalankan

```bash
# 1. Clone repository
git clone https://github.com/majid0511/KUA-NGORO.git
cd KUA-NGORO

# 2. Install dependencies
npm install

# 3. (Opsional) Konfigurasi CMS
cp .env.example .env
# → Edit .env dengan kredensial Sanity Anda

# 4. Jalankan development server
npm run dev

# 5. Linting
npm run lint

# 6. Build untuk production
npm run build
```

---

## 🛡️ Sistem Fallback & Error Handling

Seluruh halaman yang terhubung CMS memiliki tiga lapisan proteksi:

| State | Perilaku |
|---|---|
| **CMS tidak dikonfigurasi** | Otomatis tampilkan data lokal dari `src/data/` |
| **API gagal / timeout** | Fallback ke data lokal, log peringatan di console |
| **Data kosong** | Tampilkan komponen `EmptyState` dengan pesan ramah pengguna |
| **Error fetch** | Tampilkan komponen `ErrorState` dengan pesan informatif |

Komponen UI state tersedia di `src/components/ui/CmsState.tsx`:
- `<LoadingState />` — skeleton/spinner saat data sedang dimuat
- `<EmptyState />` — tampilan saat tidak ada data tersedia
- `<ErrorState />` — tampilan saat terjadi kesalahan koneksi

---

## 🗺️ Halaman & Rute

| Rute | Halaman | CMS |
|---|---|---|
| `/` | Beranda | — |
| `/profil` | Profil KUA | ✅ Profil + Staf |
| `/layanan` | Direktori Layanan | ✅ Layanan |
| `/layanan/pernikahan` | Portal Calon Pengantin | — |
| `/informasi` | Berita & Pengumuman | ✅ Berita + Pengumuman |
| `/news/:slug` | Detail Berita | ✅ Berita |
| `/kegiatan` | Galeri Kegiatan | ✅ Galeri |
| `/kontak` | Kontak & Peta | — |

---

## 👨‍💻 Developer

**Mahasiswa Program Studi Hukum Keluarga (Syariah)**  
IAI At-Tahdzib Jombang

*Internship Project • 2026*

---

**KUA Kecamatan Ngoro** — Kabupaten Jombang, Jawa Timur  
Kementerian Agama Republik Indonesia