// Jenis notifikasi: success (hijau) atau error (merah)
// NOTIFIKASI (TOAST) ADMIN: pesan kecil sukses/gagal yang muncul sebentar di pojok layar (menggantikan alert() bawaan browser).
// Dibuat tanpa library tambahan: daftar pesan disimpan di variabel modul, dan komponen ToastContainer "berlangganan" untuk menampilkannya.
export type ToastType = 'success' | 'error';
/**
 * Satu notifikasi: id unik, jenis, dan isi pesan
 */
export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

// Status bersama (di luar React) agar fungsi biasa seperti run() bisa memicu toast tanpa hook.
// items = notifikasi yang sedang tampil, listeners = komponen yang ingin diberi tahu, nextId = penghitung id.
let items: ToastItem[] = [];
let listeners: ((items: ToastItem[]) => void)[] = [];
let nextId = 1;

/**
 * Beritahu semua pendengar (ToastContainer) bahwa daftar notifikasi berubah
 */
function emit() {
  listeners.forEach((listener) => listener(items));
}

/**
 * Mendaftarkan fungsi pendengar yang dipanggil setiap daftar notifikasi berubah.
 * Mengembalikan fungsi untuk berhenti berlangganan (dipakai saat komponen ditutup).
 */
export function subscribeToasts(listener: (items: ToastItem[]) => void): () => void {
  listeners.push(listener);
  listener(items);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/**
 * Menampilkan notifikasi baru, lalu otomatis menghapusnya setelah 4 detik.
 * Bisa dipanggil dari mana saja (termasuk fungsi biasa seperti run() di AdminUI), bukan hanya dari komponen.
 */
export function showToast(type: ToastType, message: string) {
  const id = nextId++;
  items = [...items, { id, type, message }];
  emit();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 4000);
}
