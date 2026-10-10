// KOMPONEN BERSAMA PANEL ADMIN: potongan tampilan & fungsi yang dipakai ulang oleh semua halaman kelola
// (Berita, Pengumuman, Layanan, Profil, Staf, Galeri) agar tampilannya seragam.
import React from 'react';
import { Loader2, Inbox, AlertCircle, Trash2, Pencil, Plus } from 'lucide-react';
import { showToast } from './toast';

// ── Pembantu simpan/ubah/hapus: tampilkan notifikasi error Supabase (mis. ditolak RLS atau slug kembar) ──

/**
 * Menjalankan satu operasi tulis ke Supabase (simpan/ubah/hapus) dan menangani hasilnya.
 * - Jika gagal : tampilkan toast merah berisi pesan error, kembalikan false.
 * - Jika sukses: tampilkan toast hijau (hanya jika successMessage diberikan), kembalikan true.
 * Pemanggil cukup memeriksa true/false untuk menentukan langkah berikutnya.
 */
export async function run(
  op: PromiseLike<{ error: { message: string } | null }>,
  successMessage?: string,
): Promise<boolean> {
  const { error } = await op;
  if (error) {
    showToast('error', `Gagal menyimpan perubahan: ${error.message}`);
    return false;
  }
  if (successMessage) showToast('success', successMessage);
  return true;
}

// ── Kepala halaman: judul + deskripsi + tombol tambah ────────

/**
 * Kepala halaman: judul, deskripsi singkat, dan (opsional) tombol "tambah" di kanan.
 */
export function PageHeader({
  title,
  description,
  addLabel,
  onAdd,
}: {
  title: string;
  description?: string;
  addLabel?: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 shrink-0 px-3.5 py-2 bg-[#0f5132] text-white text-sm font-semibold rounded-lg hover:bg-[#073822] transition"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

// ── Komponen tabel (dipakai halaman daftar Berita, Pengumuman, Layanan, Staf) ──

/**
 * Pembungkus tabel: kartu putih berbingkai; bisa digeser mendatar jika sempit.
 */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

/**
 * Sel judul kolom tabel.
 */
export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left font-semibold text-xs uppercase tracking-wide text-slate-500 bg-slate-50 px-4 py-3 border-b border-slate-200 ${className}`}
    >
      {children}
    </th>
  );
}

/**
 * Sel isi tabel.
 */
export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

/**
 * Baris tabel; berubah warna halus saat disorot kursor.
 */
export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">{children}</tr>;
}

// ── Lencana status (Published/Draft/Aktif/dst.) ───────────────

// Warna lencana menurut nada: success (hijau), neutral (abu), warning (kuning)
const PILL_TONE = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
} as const;

/**
 * Lencana status. Jika diberi onClick, lencana menjadi tombol (dipakai untuk mengubah Draft <-> Published dengan sekali klik).
 */
export function StatusPill({
  tone,
  children,
  onClick,
}: {
  tone: keyof typeof PILL_TONE;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const classes = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${PILL_TONE[tone]}`;
  if (onClick) {
    return (
      <button onClick={onClick} className={`${classes} hover:opacity-80 transition cursor-pointer`}>
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}

// ── Tombol aksi di tiap baris (edit & hapus) ───────────────────

/**
 * Dua tombol kecil di akhir baris: ikon pensil (edit) dan tempat sampah (hapus).
 */
export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onEdit}
        title="Edit"
        className="p-1.5 rounded-md text-slate-400 hover:text-[#0f5132] hover:bg-emerald-50 transition"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={onDelete}
        title="Hapus"
        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ── Tampilan memuat / kosong / error ──────────────────────────

/**
 * Tampilan "sedang memuat data" (ikon berputar).
 */
export function AdminLoading({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-[#0f5132]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * Tampilan "belum ada data" untuk daftar yang kosong; label = nama jenis datanya.
 */
export function AdminEmpty({ label }: { label: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
      <Inbox className="w-9 h-9" />
      <p className="text-sm font-medium">Belum ada {label}.</p>
    </div>
  );
}

/**
 * Kotak merah berisi pesan kesalahan.
 */
export function AdminError({ message }: { message: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-7 h-7" />
      <p className="text-sm font-semibold max-w-sm text-center">{message}</p>
    </div>
  );
}

// ── Dialog konfirmasi hapus ───────────────────────────────────

/**
 * open = dialog tampil/tidak, label = nama data yang akan dihapus, onConfirm/onCancel = tombol Hapus/Batal.
 */
interface ConfirmDeleteProps {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog konfirmasi sebelum data dihapus permanen, agar tidak terhapus karena salah klik.
 */
export function ConfirmDelete({ open, label, onConfirm, onCancel }: ConfirmDeleteProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Hapus data ini?</p>
            <p className="text-sm text-slate-500 mt-1">
              &ldquo;{label}&rdquo; akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Kartu form + komponen kolom isian ─────────────────────────

/**
 * Pembungkus halaman form tambah/edit: judul + kartu putih berisi isian.
 */
export function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 mb-6">{title}</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">{children}</div>
    </div>
  );
}

/**
 * Satu kolom isian form: label di atas (dengan tanda * jika wajib) + kontrol isian (children).
 */
export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// Kelas gaya standar untuk kotak isian satu baris
export const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/30 focus:border-[#0f5132] transition bg-white';

// Kelas gaya standar untuk kotak isian banyak baris (turunan inputCls)
export const textareaCls = `${inputCls} resize-y min-h-[100px]`;

/**
 * Tombol di bawah form: "Batal" dan tombol simpan (menampilkan ikon berputar & nonaktif saat loading).
 */
export function FormActions({
  loading,
  onCancel,
  submitLabel = 'Simpan',
}: {
  loading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex gap-3 pt-3 border-t border-slate-100">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5132] text-white text-sm font-semibold rounded-lg hover:bg-[#073822] transition disabled:opacity-60"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
    </div>
  );
}
