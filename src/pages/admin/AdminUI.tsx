import React from 'react';
import { Loader2, Inbox, AlertCircle, Trash2, Pencil, Plus } from 'lucide-react';
import { showToast } from './toast';

// ── Mutation helper: tampilkan error Supabase (mis. RLS/duplikat slug) ──

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

// ── Page header: judul + deskripsi + tombol tambah ───────────

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

// ── Table primitives ──────────────────────────────────────────

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left font-semibold text-xs uppercase tracking-wide text-slate-500 bg-slate-50 px-4 py-3 border-b border-slate-200 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">{children}</tr>;
}

// ── Status pill ────────────────────────────────────────────────

const PILL_TONE = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
} as const;

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

// ── Row actions ────────────────────────────────────────────────

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

// ── Loading / Empty / Error states (dipakai di dalam Table atau mandiri) ──

export function AdminLoading({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-[#0f5132]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function AdminEmpty({ label }: { label: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
      <Inbox className="w-9 h-9" />
      <p className="text-sm font-medium">Belum ada {label}.</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-7 h-7" />
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

// ── Form card + field helpers ─────────────────────────────────

export function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 mb-6">{title}</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">{children}</div>
    </div>
  );
}

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

export const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/30 focus:border-[#0f5132] transition bg-white';

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
