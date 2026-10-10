// KELOLA PENGUMUMAN (alamat: /admin/pengumuman): daftar, tambah, ubah, hapus pengumuman resmi + alihkan Draft <-> Published.
// Pengumuman tampil di sidebar halaman Informasi hanya jika berstatus "published" dan belum melewati tanggal "Berlaku Hingga".
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Pengumuman } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';

// Tampilan halaman: daftar atau form tambah/edit
type Mode = 'list' | 'form';

// Isi awal form "Buat Pengumuman": kosong, prioritas normal, status Draft, tanggal hari ini
const EMPTY_FORM: Omit<Pengumuman, 'id'> = {
  title: '', content: '',
  published_at: new Date().toISOString().slice(0, 10),
  expires_at: undefined, priority: 'normal', status: 'draft',
};

/**
 * Halaman kelola pengumuman.
 */
export default function PengumumanAdmin() {
  // Tampilan aktif (daftar / form)
  const [mode, setMode]         = useState<Mode>('list');
  // Seluruh pengumuman dari database (termasuk draft & kedaluwarsa)
  const [list, setList]         = useState<Pengumuman[]>([]);
  // True selama daftar dimuat
  const [loading, setLoading]   = useState(true);
  // True saat form sedang disimpan (tombol dinonaktifkan)
  const [saving, setSaving]     = useState(false);
  // Pesan error saat memuat daftar (null = tidak ada)
  const [error, setError]       = useState<string | null>(null);
  // Data yang sedang diedit (null = mode tambah baru)
  const [editing, setEditing]   = useState<Pengumuman | null>(null);
  // Isi form yang sedang diketik
  const [form, setForm]         = useState<Omit<Pengumuman, 'id'>>(EMPTY_FORM);
  // Data yang menunggu konfirmasi hapus (null = dialog tertutup)
  const [deleteTarget, setDeleteTarget] = useState<Pengumuman | null>(null);

  // Ambil semua data dari tabel "pengumuman" di Supabase
  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('pengumuman').select('*').order('published_at', { ascending: false });
    if (error) setError(error.message);
    else setList((data ?? []) as Pengumuman[]);
    setLoading(false);
  }

  // Muat daftar saat halaman pertama dibuka
  useEffect(() => { load(); }, []);

  // Buka form kosong untuk pengumuman baru
  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM }); setMode('form'); }
  // Buka form berisi data pengumuman yang dipilih (id dibuang karena tidak ikut diubah)
  function openEdit(item: Pengumuman) {
    setEditing(item); const { id: _, ...rest } = item; setForm(rest); setMode('form');
  }

  /**
   * Simpan form: UPDATE jika sedang mengedit, INSERT jika baru. Judul wajib.
   * Kolom "Berlaku Hingga" yang dikosongkan disimpan sebagai null (= tidak pernah kedaluwarsa).
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form, expires_at: form.expires_at || null };
    const ok = await run(
      editing
        ? supabase!.from('pengumuman').update(payload).eq('id', editing.id)
        : supabase!.from('pengumuman').insert(payload),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  // Hapus data yang sudah dikonfirmasi, lalu muat ulang daftar
  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('pengumuman').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  // Balik status: published <-> draft (klik lencana status di tabel)
  async function toggleStatus(item: Pengumuman) {
    if (!(await run(supabase!.from('pengumuman')
      .update({ status: item.status === 'published' ? 'draft' : 'published' })
      .eq('id', item.id)))) return;
    load();
  }

  // TAMPILAN FORM tambah/edit
  if (mode === 'form') {
    return (
      <FormCard title={`${editing ? 'Edit' : 'Tambah'} Pengumuman`}>
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Judul" required>
            <input className={inputCls} required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Isi Pengumuman" required>
            <textarea className={textareaCls} required value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            {/* Prioritas "important" membuat pengumuman disorot di situs */}
            <Field label="Prioritas">
              <select className={inputCls} value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Pengumuman['priority'] }))}>
                <option value="normal">Normal</option>
                <option value="important">Penting</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Pengumuman['status'] }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal Terbit">
              <input type="date" required className={inputCls} value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
            </Field>
            {/* Setelah tanggal ini pengumuman otomatis tidak tampil lagi di situs publik */}
            <Field label="Berlaku Hingga (opsional)">
              <input type="date" className={inputCls} value={form.expires_at ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value || undefined }))} />
            </Field>
          </div>
          <FormActions loading={saving} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </FormCard>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* TAMPILAN DAFTAR: tabel semua pengumuman beserta prioritas, masa berlaku, dan status */}
      <PageHeader title="Pengumuman" description="Pengumuman resmi yang tampil di halaman Informasi." addLabel="Buat Pengumuman" onAdd={openAdd} />
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="pengumuman" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Judul</Th>
              <Th>Prioritas</Th>
              <Th>Berlaku</Th>
              <Th>Status</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <Tr key={item.id}>
                <Td><span className="font-medium text-slate-900">{item.title}</span></Td>
                <Td>
                  {item.priority === 'important'
                    ? <StatusPill tone="warning">Penting</StatusPill>
                    : <span className="text-slate-400 text-sm">Normal</span>}
                </Td>
                <Td className="text-slate-500 whitespace-nowrap">
                  {item.published_at}{item.expires_at ? ` – ${item.expires_at}` : ''}
                </Td>
                <Td>
                  <StatusPill tone={item.status === 'published' ? 'success' : 'neutral'} onClick={() => toggleStatus(item)}>
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </StatusPill>
                </Td>
                <Td>
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
      <ConfirmDelete open={!!deleteTarget} label={deleteTarget?.title ?? ''}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
