// KELOLA STAF/PEGAWAI (alamat: /admin/staf): daftar, tambah, ubah, hapus pegawai + alihkan Aktif <-> Nonaktif.
// Pegawai aktif tampil di halaman Profil; NIP bersifat opsional (tampil publik jika diisi).
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Staf } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';
import { useImageUpload } from './useImageUpload';
import { showToast } from './toast';
import { Image as ImageIcon, UserCircle } from 'lucide-react';

// Tampilan halaman: daftar atau form tambah/edit
type Mode = 'list' | 'form';

// Isi awal form "Tambah Pegawai": kosong, status aktif
const EMPTY_FORM: Omit<Staf, 'id'> = {
  name: '', position: '', nip: '', photo: '', bio: '', order: 0, active: true,
};

/**
 * Halaman kelola pegawai.
 */
export default function StafAdmin() {
  // Tampilan aktif (daftar / form)
  const [mode, setMode]         = useState<Mode>('list');
  // Seluruh pegawai dari database (termasuk yang nonaktif)
  const [list, setList]         = useState<Staf[]>([]);
  // True selama daftar dimuat
  const [loading, setLoading]   = useState(true);
  // True saat form sedang disimpan (tombol dinonaktifkan)
  const [saving, setSaving]     = useState(false);
  // Pesan error saat memuat daftar (null = tidak ada)
  const [error, setError]       = useState<string | null>(null);
  // Data yang sedang diedit (null = mode tambah baru)
  const [editing, setEditing]   = useState<Staf | null>(null);
  // Isi form yang sedang diketik
  const [form, setForm]         = useState<Omit<Staf, 'id'>>(EMPTY_FORM);
  // Data yang menunggu konfirmasi hapus (null = dialog tertutup)
  const [deleteTarget, setDeleteTarget] = useState<Staf | null>(null);
  // Fungsi & status unggah foto ke Supabase Storage
  const { uploading, upload }   = useImageUpload();

  // Ambil semua data dari tabel "staf" di Supabase
  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('staf').select('*').order('order', { ascending: true });
    if (error) setError(error.message);
    else setList((data ?? []) as Staf[]);
    setLoading(false);
  }

  // Muat daftar saat halaman pertama dibuka
  useEffect(() => { load(); }, []);

  // Buka form kosong; nomor urut otomatis diisi urutan berikutnya
  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: list.length + 1 });
    setMode('form');
  }

  // Buka form berisi data pegawai yang dipilih (id dibuang karena tidak ikut diubah)
  function openEdit(item: Staf) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setMode('form');
  }

  /**
   * Simpan form: UPDATE jika sedang mengedit, INSERT jika baru. Nama wajib.
   * NIP yang dikosongkan disimpan sebagai null.
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, nip: form.nip?.trim() || null };
    const ok = await run(
      editing
        ? supabase!.from('staf').update(payload).eq('id', editing.id)
        : supabase!.from('staf').insert(payload),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  // Hapus data yang sudah dikonfirmasi, lalu muat ulang daftar
  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('staf').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  // Balik status aktif <-> nonaktif (pegawai nonaktif tidak tampil di situs)
  async function toggleStatus(item: Staf) {
    if (!(await run(supabase!.from('staf')
      .update({ active: !item.active })
      .eq('id', item.id)))) return;
    load();
  }
  
  // Saat admin memilih foto: unggah ke Storage lalu simpan alamat publiknya ke form; gagal -> toast error
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      showToast('error', `Gagal mengunggah gambar: ${(err as Error).message}`);
    }
  }

  // TAMPILAN FORM tambah/edit
  if (mode === 'form') {
    return (
      <FormCard title={`${editing ? 'Edit' : 'Tambah'} Pegawai`}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Lengkap" required>
              <input className={inputCls} required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Jabatan" required>
              <input className={inputCls} required value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
            </Field>
          </div>
          {/* NIP: hanya angka, maksimal 18 digit; ditampilkan publik di halaman Profil jika diisi */}
          <Field label="NIP (opsional)">
            <input
              className={inputCls}
              inputMode="numeric"
              maxLength={18}
              placeholder="18 digit angka, kosongkan jika tidak ingin ditampilkan"
              value={form.nip ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, nip: e.target.value.replace(/\D/g, '') }))}
            />
            <p className="text-xs text-slate-400 mt-1">Ditampilkan publik di halaman Profil jika diisi.</p>
          </Field>
          <Field label="Deskripsi / Bio Singkat">
            <textarea className={textareaCls} value={form.bio ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Urutan Tampil">
              <input type="number" className={inputCls} value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </Field>
            <Field label="Status Aktif">
               <select className={inputCls} value={form.active ? 'true' : 'false'}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'true' }))}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </Field>
          </div>
          {/* Foto: unggah file atau tempel alamat gambar */}
          <Field label="Foto Pegawai">
            <div className="space-y-3">
              {form.photo ? (
                <img src={form.photo} alt="preview" className="h-32 w-24 rounded-lg object-cover border border-stone-200" />
              ) : (
                <div className="h-32 w-24 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200">
                  <UserCircle size={32} className="text-stone-300" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 cursor-pointer text-sm font-semibold hover:bg-stone-50 transition max-w-max">
                <ImageIcon size={16} className="text-stone-500" />
                {uploading ? 'Mengunggah...' : 'Pilih foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <input className={inputCls} placeholder="atau tempel URL foto" value={form.photo ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} />
            </div>
          </Field>
          <FormActions loading={saving || uploading} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </FormCard>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* TAMPILAN DAFTAR: tabel pegawai berurutan menurut nomor urut, dengan status aktif/nonaktif */}
      <PageHeader title="Staf & Pegawai" description="Daftar pegawai yang tampil di halaman Profil." addLabel="Tambah Pegawai" onAdd={openAdd} />
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="pegawai" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Nama</Th>
              <Th>Jabatan</Th>
              <Th className="w-16">Urutan</Th>
              <Th>Status</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <UserCircle size={18} className="text-slate-400" />
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{item.name}</span>
                  </div>
                </Td>
                <Td className="text-slate-500">{item.position}</Td>
                <Td className="text-slate-500">{item.order}</Td>
                <Td>
                  <StatusPill tone={item.active ? 'success' : 'neutral'} onClick={() => toggleStatus(item)}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
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
      <ConfirmDelete open={!!deleteTarget} label={deleteTarget?.name ?? ''}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
