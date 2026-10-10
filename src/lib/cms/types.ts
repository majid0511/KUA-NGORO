// Bentuk (tipe) data untuk 6 jenis konten yang dikelola lewat panel admin.
// Nama field sama dengan nama kolom di tabel Supabase masing-masing.

/**
 * Berita / artikel (tabel "berita"). Hanya yang berstatus "published" tampil di situs publik.
 */
export interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  author: string;
  published_at: string;
  status: 'draft' | 'published';
}

/**
 * Pengumuman resmi (tabel "pengumuman"). Bisa punya tanggal kedaluwarsa (expires_at) dan prioritas "important" untuk disorot.
 */
export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  published_at: string;
  expires_at?: string;
  priority: 'normal' | 'important';
  status: 'draft' | 'published';
}

/**
 * Layanan KUA, mis. nikah, wakaf (tabel "layanan"). Berisi persyaratan & langkah prosedur; "order" menentukan urutan tampil.
 */
export interface Layanan {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  procedure: string[];
  estimated_time?: string;
  icon: string;
  status: 'active' | 'inactive';
  order: number;
}

/**
 * Profil kantor (tabel "profil" - hanya satu baris). Juga menyimpan sakelar maintenance_mode untuk menutup situs sementara.
 */
export interface Profil {
  office_name: string;
  description: string;
  history: string;
  vision: string;
  mission: string[];
  address: string;
  phone: string;
  email: string;
  office_hours: {
    workDays: string;
    fridayHours: string;
    weekend: string;
  };
  maintenance_mode: boolean;
}

/**
 * Pegawai KUA (tabel "staf"). NIP bersifat opsional; "active" = tampil di situs.
 */
export interface Staf {
  id: string;
  name: string;
  position: string;
  nip?: string | null;
  photo?: string;
  bio?: string;
  order: number;
  active: boolean;
}

/**
 * Foto dokumentasi kegiatan (tabel "galeri").
 */
export interface Galeri {
  id: string;
  title: string;
  image: string;
  description: string;
  category: 'Kegiatan' | 'Pelayanan' | 'Acara' | 'Lainnya' | string;
  published_at: string;
}

/**
 * Bungkus hasil pengambilan data:
 * - data         : isi data (null jika gagal total)
 * - fromFallback : true jika yang ditampilkan data cadangan lokal, bukan dari database
 * - error        : pesan kesalahan untuk ditampilkan (null jika tidak ada masalah)
 */
export interface CmsResponse<T> {
  data: T | null;
  fromFallback: boolean;
  error: string | null;
}
