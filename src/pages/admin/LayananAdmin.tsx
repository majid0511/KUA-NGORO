// KELOLA LAYANAN (alamat: /admin/layanan): daftar, tambah, ubah, hapus layanan KUA + alihkan Aktif <-> Nonaktif.
// Setiap layanan punya persyaratan & prosedur (diketik satu poin per baris) yang tampil di halaman Layanan.
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Layanan } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';

// Tampilan halaman: daftar atau form tambah/edit
type Mode = 'list' | 'form';

// Harus sama dengan daftar yang dikenali ServiceCard.tsx — nama di luar ini
// akan tampil sebagai ikon generik di halaman publik.
// Pilihan ikon layanan. Harus sama dengan daftar yang dikenali ServiceCard.tsx; nama lain akan tampil sebagai ikon generik.
const ICON_OPTIONS = [
  'HeartHandshake', 'Building2', 'Landmark', 'ShieldCheck', 'BookOpen', 'Users',
] as const;

// Isi awal form "Tambah Layanan": kosong, status aktif
const EMPTY_FORM: Omit<Layanan, 'id'> = {
  title: '', slug: '', description: '',
  requirements: [], procedure: [],
  estimated_time: '', icon: 'Landmark',
  status: 'active', order: 0,
};

/**
 * Halaman kelola layanan.
 */
export default function LayananAdmin() {
  // Tampilan aktif (daftar / form)
  const [mode, setMode]         = useState<Mode>('list');
  // Seluruh layanan dari database (termasuk yang nonaktif)
  const [list, setList]         = useState<Layanan[]>([]);
  // True selama daftar dimuat
  const [loading, setLoading]   = useState(true);
  // True saat form sedang disimpan (tombol dinonaktifkan)
  const [saving, setSaving]     = useState(false);
  // Pesan error saat memuat daftar (null = tidak ada)
  const [error, setError]       = useState<string | null>(null);
  // Data yang sedang diedit (null = mode tambah baru)
  const [editing, setEditing]   = useState<Layanan | null>(null);
  // Isi form yang sedang diketik
  const [form, setForm]         = useState<Omit<Layanan, 'id'>>(EMPTY_FORM);
  // Data yang menunggu konfirmasi hapus (null = dialog tertutup)
  const [deleteTarget, setDeleteTarget] = useState<Layanan | null>(null);

  // Textarea helpers for arrays
  // Isi kolom "Persyaratan" sebagai teks (satu persyaratan per baris); diubah jadi daftar saat disimpan
  const [reqText, setReqText] = useState('');
  // Isi kolom "Prosedur" sebagai teks (satu langkah per baris); diubah jadi daftar saat disimpan
  const [procText, setProcText] = useState('');

  // Ambil semua data dari tabel "layanan" di Supabase
  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('layanan').select('*').order('order', { ascending: true });
    if (error) setError(error.message);
    else setList((data ?? []) as Layanan[]);
    setLoading(false);
  }

  // Muat daftar saat halaman pertama dibuka
  useEffect(() => { load(); }, []);

  // Buka form kosong; nomor urutan otomatis diisi urutan berikutnya setelah layanan terakhir
  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: list.length + 1 });
    setReqText(''); setProcText('');
    setMode('form');
  }

  // Buka form berisi data layanan yang dipilih; daftar persyaratan/prosedur digabung kembali jadi teks per baris
  function openEdit(item: Layanan) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setReqText(item.requirements.join('\n'));
    setProcText(item.procedure.join('\n'));
    setMode('form');
  }

  /**
   * Simpan form: teks persyaratan & prosedur dipecah per baris, baris kosong dibuang, lalu disimpan sebagai daftar.
   * UPDATE jika sedang mengedit, INSERT jika baru. Nama layanan & slug wajib.
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      requirements: reqText.split('\n').map(s => s.trim()).filter(Boolean),
      procedure: procText.split('\n').map(s => s.trim()).filter(Boolean),
    };
    const ok = await run(
      editing
        ? supabase!.from('layanan').update(payload).eq('id', editing.id)
        : supabase!.from('layanan').insert(payload),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  // Hapus data yang sudah dikonfirmasi, lalu muat ulang daftar
  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('layanan').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  // Balik status: active <-> inactive (layanan nonaktif tidak tampil di situs publik)
  async function toggleStatus(item: Layanan) {
    if (!(await run(supabase!.from('layanan')
      .update({ status: item.status === 'active' ? 'inactive' : 'active' })
      .eq('id', item.id)))) return;
    load();
  }

  // TAMPILAN FORM tambah/edit
  if (mode === 'form') {
    return (
      <FormCard title={`${editing ? 'Edit' : 'Tambah'} Layanan`}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Layanan" required>
              <input className={inputCls} required value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value,
                  slug: f.slug || e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))} />
            </Field>
            {/* Slug = potongan alamat layanan, mis. "pendaftaran-nikah" */}
            <Field label="Slug (URL)" required>
              <input className={inputCls} required value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))} />
            </Field>
          </div>
          <Field label="Deskripsi Layanan" required>
            <textarea className={textareaCls} required value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimasi Waktu">
              <input className={inputCls} value={form.estimated_time ?? ''}
                placeholder="Cth: 1 - 10 hari kerja"
                onChange={(e) => setForm((f) => ({ ...f, estimated_time: e.target.value }))} />
            </Field>
            {/* Pilihan ikon dibatasi agar selalu cocok dengan ikon yang tersedia di situs */}
            <Field label="Ikon">
              <select className={inputCls} value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}>
                {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </Field>
          </div>
          {/* Satu persyaratan per baris */}
          <Field label="Persyaratan (satu per baris)">
            <textarea className={textareaCls} placeholder="- Fotokopi KTP..."
              value={reqText} onChange={(e) => setReqText(e.target.value)} />
          </Field>
          <Field label="Prosedur (satu per baris)">
            <textarea className={textareaCls} placeholder="- Datang ke KUA..."
              value={procText} onChange={(e) => setProcText(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Urutan Tampil">
              <input type="number" className={inputCls} value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Layanan['status'] }))}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </Field>
          </div>
          <FormActions loading={saving} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </FormCard>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* TAMPILAN DAFTAR: tabel layanan berurutan menurut nomor urut, dengan status aktif/nonaktif */}
      <PageHeader title="Layanan" description="Layanan yang tampil di Beranda dan halaman Layanan." addLabel="Tambah Layanan" onAdd={openAdd} />
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="layanan" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th className="w-14">Urutan</Th>
              <Th>Nama</Th>
              <Th>Status</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                    {item.order}
                  </span>
                </Td>
                <Td>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 truncate max-w-md">{item.description}</p>
                </Td>
                <Td>
                  <StatusPill tone={item.status === 'active' ? 'success' : 'neutral'} onClick={() => toggleStatus(item)}>
                    {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
