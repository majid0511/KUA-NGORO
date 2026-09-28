import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Staf } from '../../lib/cms/types';
import {
  AdminListPage, AdminLoading, AdminEmpty, AdminError,
  ConfirmDelete, EditBtn, DeleteBtn, ToggleBtn,
  Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';
import { useImageUpload } from './useImageUpload';
import { Image as ImageIcon, UserCircle } from 'lucide-react';

type Mode = 'list' | 'form';

const EMPTY_FORM: Omit<Staf, 'id'> = {
  name: '', position: '', photo: '', bio: '', order: 0, active: true,
};

export default function StafAdmin() {
  const [mode, setMode]         = useState<Mode>('list');
  const [list, setList]         = useState<Staf[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [editing, setEditing]   = useState<Staf | null>(null);
  const [form, setForm]         = useState<Omit<Staf, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Staf | null>(null);
  const { uploading, upload }   = useImageUpload();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('staf').select('*').order('order', { ascending: true });
    if (error) setError(error.message);
    else setList((data ?? []) as Staf[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: list.length + 1 });
    setMode('form');
  }

  function openEdit(item: Staf) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setMode('form');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const ok = await run(
      editing
        ? supabase!.from('staf').update(form).eq('id', editing.id)
        : supabase!.from('staf').insert(form),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('staf').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  async function toggleStatus(item: Staf) {
    if (!(await run(supabase!.from('staf')
      .update({ active: !item.active })
      .eq('id', item.id)))) return;
    load();
  }
  
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    setForm(f => ({ ...f, photo: url }));
  }

  if (mode === 'form') {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900">{editing ? 'Edit' : 'Tambah'} Pegawai</h2>
        <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
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
      </div>
    );
  }

  return (
    <AdminListPage title="Staf & Pegawai" addLabel="Tambah Pegawai" onAdd={openAdd}>
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="pegawai" />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
          {list.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              {item.photo ? (
                <img src={item.photo} alt={item.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-stone-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                  <UserCircle className="text-stone-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-stone-900 truncate">{item.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{item.position} · Urutan {item.order}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ToggleBtn active={item.active} onClick={() => toggleStatus(item)} />
                <EditBtn onClick={() => openEdit(item)} />
                <DeleteBtn onClick={() => setDeleteTarget(item)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete open={!!deleteTarget} label={deleteTarget?.name ?? ''}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminListPage>
  );
}
