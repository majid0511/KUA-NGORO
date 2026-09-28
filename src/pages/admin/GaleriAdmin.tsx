import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Galeri } from '../../lib/cms/types';
import {
  AdminListPage, AdminLoading, AdminEmpty, AdminError,
  ConfirmDelete, EditBtn, DeleteBtn,
  Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';
import { useImageUpload } from './useImageUpload';
import { Image as ImageIcon } from 'lucide-react';

type Mode = 'list' | 'form';

const CATEGORIES = ['Kegiatan', 'Pelayanan', 'Acara', 'Lainnya'];

const EMPTY_FORM: Omit<Galeri, 'id'> = {
  title: '', image: '', description: '', category: 'Kegiatan',
  published_at: new Date().toISOString().slice(0, 10),
};

export default function GaleriAdmin() {
  const [mode, setMode]         = useState<Mode>('list');
  const [list, setList]         = useState<Galeri[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [editing, setEditing]   = useState<Galeri | null>(null);
  const [form, setForm]         = useState<Omit<Galeri, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Galeri | null>(null);
  const { uploading, upload }   = useImageUpload();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('galeri').select('*').order('published_at', { ascending: false });
    if (error) setError(error.message);
    else setList((data ?? []) as Galeri[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM }); setMode('form'); }
  function openEdit(item: Galeri) {
    setEditing(item);
    setForm({
      title: item.title, image: item.image, description: item.description,
      category: item.category, published_at: item.published_at,
    });
    setMode('form');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const ok = await run(
      editing
        ? supabase!.from('galeri').update(form).eq('id', editing.id)
        : supabase!.from('galeri').insert(form),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('galeri').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      alert(`Gagal mengunggah gambar: ${(err as Error).message}`);
    }
  }

  if (mode === 'form') {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900">{editing ? 'Edit' : 'Tambah'} Foto Galeri</h2>
        <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <Field label="Judul" required>
            <input className={inputCls} required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori">
              <select className={inputCls} value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Tanggal">
              <input type="date" required className={inputCls} value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
            </Field>
          </div>
          <Field label="Deskripsi">
            <textarea className={textareaCls} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Gambar" required>
            <div className="space-y-2">
              {form.image && (
                <img src={form.image} alt="preview" className="h-32 rounded-xl object-cover border border-stone-200" />
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-stone-300 cursor-pointer text-sm text-stone-500 hover:border-[#0f5132] hover:text-[#0f5132] transition">
                <ImageIcon size={16} />
                {uploading ? 'Mengunggah...' : 'Pilih gambar (maks. 2 MB)'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <input className={inputCls} placeholder="atau tempel URL gambar" value={form.image} required
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
            </div>
          </Field>
          <FormActions loading={saving || uploading} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </div>
    );
  }

  return (
    <AdminListPage title="Galeri Kegiatan" addLabel="Tambah Foto" onAdd={openAdd}>
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="foto galeri" />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
          {list.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              {item.image && (
                <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 bg-stone-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-stone-900 truncate">{item.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{item.category} · {item.published_at}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <EditBtn onClick={() => openEdit(item)} />
                <DeleteBtn onClick={() => setDeleteTarget(item)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete
        open={!!deleteTarget}
        label={deleteTarget?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminListPage>
  );
}
