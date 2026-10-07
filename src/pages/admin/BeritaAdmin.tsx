import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Berita } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';
import { useImageUpload } from './useImageUpload';
import { showToast } from './toast';
import { Image as ImageIcon } from 'lucide-react';

type Mode = 'list' | 'form';

const EMPTY_FORM: Omit<Berita, 'id'> = {
  title: '', slug: '', excerpt: '', content: '',
  featured_image: '', category: 'Berita', author: 'Tim Humas KUA Ngoro',
  published_at: new Date().toISOString().slice(0, 10), status: 'draft',
};

export default function BeritaAdmin() {
  const [mode, setMode]           = useState<Mode>('list');
  const [list, setList]           = useState<Berita[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [editing, setEditing]     = useState<Berita | null>(null);
  const [form, setForm]           = useState<Omit<Berita, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Berita | null>(null);
  const { uploading, upload }     = useImageUpload();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('berita')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) setError(error.message);
    else setList((data ?? []) as Berita[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setMode('form');
  }

  function openEdit(item: Berita) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setMode('form');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    const payload = { ...form };
    const ok = await run(
      editing
        ? supabase!.from('berita').update(payload).eq('id', editing.id)
        : supabase!.from('berita').insert(payload),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list');
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('berita').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null);
    load();
  }

  async function toggleStatus(item: Berita) {
    if (!(await run(supabase!.from('berita')
      .update({ status: item.status === 'published' ? 'draft' : 'published' })
      .eq('id', item.id)))) return;
    load();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      setForm((f) => ({ ...f, featured_image: url }));
    } catch (err) {
      showToast('error', `Gagal mengunggah gambar: ${(err as Error).message}`);
    }
  }

  if (mode === 'form') {
    return (
      <FormCard title={editing ? 'Edit Berita' : 'Tambah Berita'}>
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Judul" required>
            <input className={inputCls} required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value,
                slug: f.slug || e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))} />
          </Field>
          <Field label="Slug (URL)" required>
            <input className={inputCls} required value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori">
              <select className={inputCls} value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {['Berita', 'Pengumuman', 'Artikel'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Berita['status'] }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>
          <Field label="Penulis">
            <input className={inputCls} value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
          </Field>
          <Field label="Tanggal Terbit">
            <input type="date" required className={inputCls} value={form.published_at}
              onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
          </Field>
          <Field label="Ringkasan (Excerpt)" required>
            <textarea className={textareaCls} required value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </Field>
          <Field label="Isi Artikel" required>
            <textarea className={`${textareaCls} min-h-[180px]`} required value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </Field>
          <Field label="Foto Utama">
            <div className="space-y-2">
              {form.featured_image && (
                <img src={form.featured_image} alt="preview" className="h-32 rounded-xl object-cover border border-stone-200" />
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-stone-300 cursor-pointer text-sm text-stone-500 hover:border-[#0f5132] hover:text-[#0f5132] transition">
                <ImageIcon size={16} />
                {uploading ? 'Mengunggah...' : 'Pilih gambar'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <input className={inputCls} placeholder="atau tempel URL gambar" value={form.featured_image}
                onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))} />
            </div>
          </Field>
          <FormActions loading={saving || uploading} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </FormCard>
    );
  }

  return (
    <div className="max-w-5xl">
      <PageHeader title="Berita" description="Berita dan artikel yang tampil di halaman Informasi." addLabel="Tulis Berita" onAdd={openAdd} />
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="berita" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Judul</Th>
              <Th>Kategori</Th>
              <Th>Tanggal</Th>
              <Th>Status</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-3 min-w-0">
                    {item.featured_image ? (
                      <img src={item.featured_image} alt="" className="w-12 h-9 rounded-md object-cover shrink-0 bg-slate-100" />
                    ) : (
                      <div className="w-12 h-9 rounded-md bg-slate-100 shrink-0" />
                    )}
                    <span className="font-medium text-slate-900 truncate">{item.title}</span>
                  </div>
                </Td>
                <Td className="text-slate-500">{item.category}</Td>
                <Td className="text-slate-500 whitespace-nowrap">{item.published_at}</Td>
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
      <ConfirmDelete
        open={!!deleteTarget}
        label={deleteTarget?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
