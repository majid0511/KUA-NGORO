import React from 'react';
import { Loader2, Inbox, AlertCircle, Trash2, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

// ── Mutation helper: tampilkan error Supabase (mis. RLS/duplikat slug) ──

export async function run(
  op: PromiseLike<{ error: { message: string } | null }>,
): Promise<boolean> {
  const { error } = await op;
  if (error) {
    alert(`Gagal menyimpan perubahan: ${error.message}`);
    return false;
  }
  return true;
}

// ── Loading / Empty / Error states ───────────────────────────

export function AdminLoading({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-stone-500">
      <Loader2 className="w-7 h-7 animate-spin text-[#0f5132]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function AdminEmpty({ label }: { label: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-stone-400">
      <Inbox className="w-10 h-10" />
      <p className="text-sm font-medium">Belum ada {label}.</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-red-600 bg-red-50 border border-red-200 rounded-2xl">
      <AlertCircle className="w-8 h-8" />
      <p className="text-sm font-semibold max-w-sm text-center">{message}</p>
    </div>
  );
}

// ── Confirm delete dialog ─────────────────────────────────────

interface ConfirmDeleteProps {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDelete({ open, label, onConfirm, onCancel }: ConfirmDeleteProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-stone-900">Hapus data ini?</p>
            <p className="text-sm text-stone-500 mt-1">
              &ldquo;{label}&rdquo; akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared action buttons ─────────────────────────────────────

export function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Edit"
      className="p-1.5 rounded-lg text-stone-500 hover:text-[#0f5132] hover:bg-emerald-50 transition"
    >
      <Pencil size={15} />
    </button>
  );
}

export function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Hapus"
      className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
    >
      <Trash2 size={15} />
    </button>
  );
}

export function ToggleBtn({
  active,
  onClick,
  trueLabel = 'Aktif',
  falseLabel = 'Nonaktif',
}: {
  active: boolean;
  onClick: () => void;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition ${
        active
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
    >
      {active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
      {active ? trueLabel : falseLabel}
    </button>
  );
}

// ── Page-level list wrapper ───────────────────────────────────

export function AdminListPage({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-stone-900">{title}</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f5132] text-white text-sm font-bold rounded-lg hover:bg-[#073822] transition"
        >
          + {addLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

// ── Form field helpers ────────────────────────────────────────

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
      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]/40 focus:border-[#0f5132] transition bg-white';

export const textareaCls = `${inputCls} resize-y min-h-[100px]`;

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
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 transition"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5132] text-white text-sm font-bold rounded-lg hover:bg-[#073822] transition disabled:opacity-60"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
    </div>
  );
}
