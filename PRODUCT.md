# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Masyarakat Kecamatan Ngoro & Calon Pengantin (Catin):** Warga yang membutuhkan kepastian informasi prosedur pernikahan, checklist persyaratan administrasi (SIMKAH, dokumen N1-N4, dispensasi, wali nikah), jadwal jam layanan kantor, konsultasi keluarga, serta informasi zakat, wakaf, dan pengumuman keagamaan resmi. Mayoritas mengakses via perangkat ponsel pintar (mobile-first).
- **Staf & Pengelola KUA Kecamatan Ngoro:** Petugas internal kantor yang mengelola dan memperbarui data publikasi (berita, pengumuman darurat/layanan, direktori staf, galeri dokumentasi, status layanan) secara mandiri melalui panel dashboard internal di `/admin`.

## Product Purpose

Menyediakan portal informasi publik dan gerbang layanan digital keagamaan bagi KUA Kecamatan Ngoro yang informatif, transparan, dan mudah diakses oleh masyarakat umum. Pada fase ini, produk juga berfungsi sebagai pembuktian portofolio magang institusional (IAI At-Tahdzib Jombang 2026) dengan standar arsitektur modern (Headless CMS + fallback mandiri) yang siap dipresentasikan dan siap diadopsi operasional kantor.

## Positioning

Portal layanan publik keagamaan tingkat kecamatan yang mengusung prinsip *Modern Islamic Governmental Minimalism*. Berbeda dari web pemerintahan konvensional yang kaku atau bergantung penuh pada server internal, portal ini mengadopsi arsitektur headless CMS (Supabase) dengan lapisan abstraksi data dan sistem fallback lokal (`src/data/`), menjamin informasi esensial bagi warga tetap dapat diakses 100% tanpa risiko halaman blank ketika CMS belum terkonfigurasi atau jaringan terganggu.

## Operating Context

- **Situasi Warga:** Warga seringkali mengakses website saat membutuhkan kepastian berkas persyaratan sebelum datang langsung ke kantor KUA atau saat memeriksa jam operasional (didukung indikator dinamis buka/tutup pelayanan WIB).
- **Lingkungan Perangkat:** Akses dominan melalui peramban mobile/smartphone di berbagai kondisi bandwidth seluler.
- **Ekosistem Regulasi:** Menyelaraskan informasi dengan regulasi Kementerian Agama RI, aplikasi SIMKAH Kemenag, dan operasional Kantor Kemenag Kabupaten Jombang.

## Capabilities and Constraints

- **Modul Informasi Publik:** Beranda (dengan live status pelayanan), Profil Kantor & Visi-Misi, Struktur Organisasi & Direktori Staf, Direktori Layanan Keagamaan, Portal Edukasi Calon Pengantin (alur 6 langkah, checklist dokumen, panduan SIMKAH), Pusat Berita & Pengumuman, Galeri Dokumentasi Kegiatan, serta Kontak & Lokasi interaktif (Google Maps & WhatsApp).
- **Panel Pengelola (/admin):** Proteksi akses via Supabase Auth dan verifikasi tabel `admins`, manajemen CRUD Berita, Pengumuman, Layanan, Staf, Galeri, dan Profil Singleton, serta manajemen upload media ke Supabase Storage.
- **Lapisan Ketahanan Data (Resilience Layer):** CMS Abstraction layer di `src/lib/cms/` yang otomatis beralih ke fallback data lokal jika koneksi Supabase tidak tersedia, sehingga web selalu siap demo dalam kondisi apapun.
- **Batasan Legal & Atribusi:** Dibuat dalam konteks proyek magang mahasiswa IAI At-Tahdzib Jombang (2026); informasi operasional dan tautan eksternal dijaga agar tetap faktual dan dapat diverifikasi oleh pihak berwenang.

## Brand Commitments

- **Identitas Lembaga:** Kantor Urusan Agama (KUA) Kecamatan Ngoro, Kabupaten Jombang, Jawa Timur.
- **Konsep Desain:** Modern Islamic Governmental Minimalism — berwibawa, rapi, tenang, dan bersahabat.
- **Palet Warna Institusi:** Hijau Kemenag/institusi resmi (`#0f5132`, `#073822`, `#e8f5e9`), latar belakang netral hangat bersih (`#fbfbf9`, `#ffffff`), dan aksen fungsional emas/amber (`#b45309`).
- **Nada Suara (Voice):** Santun, jelas, mengayomi, bebas dari jargon birokrasi rumit, dan berorientasi melayani kebutuhan warga.

## Evidence on Hand

- Dataset lokal lengkap untuk fallback siap guna di `src/data/` (berita, layanan, profil kantor, staf, galeri kegiatan, pengumuman).
- Skema database relasional & RLS di `supabase/migrations/supabase-setup.sql`.
- Aset visual statis (foto gedung, kegiatan, staf) di `src/assets/` dan `public/staff/`.
- Dokumentasi arsitektur dan panduan penerapan di `README.md`.

## Product Principles

1. **Aksesibilitas Tanpa Kegagalan (Zero-Blank Information):** Informasi pelayanan masyarakat tidak boleh gagal tampil; arsitektur fallback memastikan keandalan 100% bagi warga yang membutuhkan info mendesak.
2. **Kejelasan Berorientasi Warga (Citizen-Centric Clarity):** Persyaratan administrasi dan birokrasi disajikan terstruktur, ringkas, dan visual (step-by-step checklist) agar mudah dipahami calon pengantin dan masyarakat awam.
3. **Wibawa Bersahaja (Quiet Dignity):** Desain mencerminkan institusi keagamaan negara yang modern dan tertata tanpa ornamentasi berlebih atau elemen visual yang mengganggu konsentrasi membaca.
4. **Kemandirian Pengelolaan Konten:** Konten publik dinamis dapat dikelola oleh aparatur kantor tanpa menyentuh kode program, menjaga relevansi informasi jangka panjang.

## Accessibility & Inclusion

- Standar keterbacaan dan kontras warna WCAG AA pada seluruh kombinasi teks dan latar belakang.
- Navigasi responsif mobile yang ergonomis (termasuk mobile bottom quick bar).
- Respek terhadap pengaturan sistem pengguna (`prefers-reduced-motion: reduce`).
- Struktur hierarki heading semantik yang ramah pembaca layar (screen reader).
