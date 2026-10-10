// WADAH NOTIFIKASI: menampilkan semua toast aktif di pojok kanan atas layar admin. Dipasang sekali di AdminLayout.
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { subscribeToasts, type ToastItem } from './toast';

/**
 * Berlangganan daftar notifikasi dari toast.ts; tidak menampilkan apa-apa jika daftar kosong.
 */
export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  // Mulai berlangganan saat tampil; fungsi yang dikembalikan otomatis berhenti berlangganan saat ditutup
  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`toast-enter pointer-events-auto flex items-start gap-2.5 rounded-lg shadow-lg px-4 py-3 text-sm font-medium text-white ${
            t.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          ) : (
            <XCircle size={18} className="shrink-0 mt-0.5" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
