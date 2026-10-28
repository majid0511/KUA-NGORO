// UNGGAH & HAPUS GAMBAR di Supabase Storage (bucket "media"), dipakai form Berita, Staf, dan Galeri.
// Batas ukuran (2 MB) dan jenis file (hanya gambar) dijaga oleh pengaturan bucket di database, bukan di kode ini.
//
// Pembersihan file otomatis (supaya gudang gambar tidak penuh oleh file yatim):
//  - data dihapus                       -> file gambarnya ikut dihapus
//  - gambar diganti saat menyimpan      -> file gambar lama dihapus
//  - unggah lalu batal / unggah ulang   -> file yang tidak jadi dipakai dihapus
// Penghapusan bersifat "upaya terbaik": jika gagal, hanya dicatat di konsol dan TIDAK menggagalkan simpan/hapus data.
// File yang alamatnya ditempel dari luar (bukan dari bucket kita) tidak pernah disentuh.
import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Ekstensi yang dipakai untuk tiap jenis gambar yang diizinkan bucket
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Menentukan ekstensi nama file yang aman. Urutan: (1) dari jenis file (MIME) yang diizinkan bucket -- paling bisa
 * dipercaya, (2) dari nama file asli (hanya huruf/angka), (3) "jpg". Nama tanpa titik (mis. "foto") tidak lagi
 * menjadi ekstensi.
 */
function extensionFor(file: File): string {
  const byMime = EXT_BY_MIME[file.type];
  if (byMime) return byMime;
  const dot = file.name.lastIndexOf('.');
  const byName = dot > -1 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  return byName || 'jpg';
}

// Memperkecil foto sebelum diunggah. Kalau gagal atau hasilnya tidak lebih kecil, pakai file asli.
async function shrinkImage(file: File, maxSide = 1600): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

/**
 * Mengunggah satu file ke bucket "media" di Supabase Storage.
 * Mengembalikan alamat publik file tersebut, atau melempar error jika gagal
 * (mis. file lebih dari 2 MB, bukan gambar, atau bukan admin).
 */
export async function uploadMedia(originalFile: File): Promise<string> {
  const file = await shrinkImage(originalFile);
  const ext = extensionFor(file);

  // Nama file unik (waktu + angka acak) agar tidak pernah menimpa file lain
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Kirim file ke bucket "media"; upsert: false = menolak jika nama sudah ada; cacheControl = browser boleh menyimpan 1 jam
  const { error } = await supabase!.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  // Minta alamat publik file (inilah yang disimpan di database dan dipakai untuk menampilkan gambar)
  const { data } = supabase!.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

// Bagian alamat publik yang memisahkan alamat project dari nama file di dalam bucket "media"
const MEDIA_MARKER = '/storage/v1/object/public/media/';

/**
 * Mengambil nama file di bucket "media" dari alamat publiknya.
 * Mengembalikan null jika alamat BUKAN milik bucket kita (mis. gambar dari situs lain) -> tidak boleh dihapus.
 */
export function mediaPathFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!base) return null;
  try {
    const u = new URL(url);
    // Asal (https://nama-project.supabase.co) harus PERSIS sama; "abc.supabase.co.situs-lain.com" ditolak
    if (u.origin !== new URL(base).origin) return null;
    if (!u.pathname.startsWith(MEDIA_MARKER)) return null;
    // pathname sudah tanpa "?query"; decode %20 dst. Alamat rusak (mis. "%" tidak valid) -> dianggap bukan milik kita
    const path = decodeURIComponent(u.pathname.slice(MEDIA_MARKER.length));
    return path || null;
  } catch {
    return null;
  }
}

/**
 * Cek apakah alamat gambar ini masih dipakai oleh data lain (berita, staf, atau galeri).
 * Jika pengecekan gagal, dianggap MASIH dipakai (lebih aman: file tidak dihapus).
 */
async function isUrlStillUsed(url: string): Promise<boolean> {
  const results = await Promise.all([
    supabase!.from('berita').select('id', { count: 'exact', head: true }).eq('featured_image', url),
    supabase!.from('staf').select('id', { count: 'exact', head: true }).eq('photo', url),
    supabase!.from('galeri').select('id', { count: 'exact', head: true }).eq('image', url),
  ]);
  return results.some((r) => r.error || (r.count ?? 0) > 0);
}

/**
 * Menghapus file gambar dari bucket "media" JIKA milik bucket kita DAN tidak lagi dipakai data mana pun.
 * Dipanggil SETELAH data di database berhasil dihapus/diubah. Tidak pernah melempar error.
 */
export async function deleteMediaIfUnused(url?: string | null): Promise<void> {
  const path = mediaPathFromUrl(url);
  if (!path || !supabase) return;
  try {
    if (await isUrlStillUsed(url as string)) return;
    const { error } = await supabase.storage.from('media').remove([path]);
    if (error) console.warn('[Media] Gagal menghapus file lama:', error.message);
  } catch (err) {
    console.warn('[Media] Gagal menghapus file lama:', err);
  }
}

/**
 * Hook untuk mengelola status unggah gambar di form.
 * Pemakaian: const { uploading, upload, discardUnsaved } = useImageUpload();
 *  - uploading : true selama file sedang diunggah (untuk menonaktifkan tombol / menampilkan "Mengunggah...")
 *  - upload(file) : mengunggah file dan mengembalikan alamat publiknya; error diteruskan ke pemanggil
 *  - discardUnsaved(keepUrl) : menghapus file yang diunggah di form ini tetapi tidak jadi dipakai.
 *      Panggil dengan alamat gambar final setelah SIMPAN berhasil (file itu dipertahankan),
 *      atau tanpa argumen saat form DIBATALKAN (semua unggahan sesi ini dibuang).
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  // Alamat semua file yang diunggah di sesi form ini (belum tentu jadi disimpan)
  const pending = useRef<string[]>([]);

  async function upload(file: File): Promise<string> {
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      pending.current.push(url);
      return url;
    } finally {
      setUploading(false);
    }
  }

  async function discardUnsaved(keepUrl?: string | null): Promise<void> {
    const toDelete = pending.current.filter((u) => u !== keepUrl);
    pending.current = [];
    await Promise.all(toDelete.map((u) => deleteMediaIfUnused(u)));
  }

  return { uploading, upload, discardUnsaved };
}
