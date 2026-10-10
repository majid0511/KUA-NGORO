// UNGGAH GAMBAR ke Supabase Storage (bucket "media"), dipakai form Berita, Staf, dan Galeri.
// Batas ukuran (2 MB) dan jenis file (hanya gambar) dijaga oleh pengaturan bucket di database, bukan di kode ini.
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Mengunggah satu file ke bucket "media" di Supabase Storage.
 * Mengembalikan alamat publik file tersebut, atau melempar error jika gagal
 * (mis. file lebih dari 2 MB, bukan gambar, atau bukan admin).
 */
export async function uploadMedia(file: File): Promise<string> {
  // Ambil ekstensi file asli (jpg, png, webp, dst.); jika tidak ada, anggap jpg
  const ext  = file.name.split('.').pop() ?? 'jpg';
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

/**
 * Hook untuk mengelola status unggah gambar di form.
 * Pemakaian: const { uploading, upload } = useImageUpload();
 *  - uploading : true selama file sedang diunggah (untuk menonaktifkan tombol / menampilkan "Mengunggah...")
 *  - upload(file) : mengunggah file dan mengembalikan alamat publiknya; error diteruskan ke pemanggil
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    setUploading(true);
    try {
      return await uploadMedia(file);
    } finally {
      setUploading(false);
    }
  }

  return { uploading, upload };
}
