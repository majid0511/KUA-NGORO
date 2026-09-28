import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Pengumuman } from '../../../lib/cms/types';
import {
  AdminListPage, AdminLoading, AdminEmpty, AdminError,
  ConfirmDelete, EditBtn, DeleteBtn, ToggleBtn,
  Field, inputCls, textareaCls, FormActions,
} from '../AdminUI';

type Mode = 'list' | 'form';

const EMPTY_FORM: Omit<Pengumuman, 'id'> = {
  title: '', content: '',
  published_at: new Date().toISOString().slice(0, 10),
  expires_at: undefined, priority: 'normal', status: 'draft',
};

export default function PengumumanAdmin() {
  const [mode, setMode]         = useState<Mode>('list');
  const [list, setList]         = useState<Pengumuman[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [editing, setEditing]   = useState<Pengumuman | null>(null);
  const [form, setForm]         = useState<Omit<Pengumuman, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Pengumuman | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('pengumuman').select('*').order('published_at', { ascending: false });
    if (error) setError(error.message);
    else setList((data ?? []) as Pengumuman[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM }); setMode('form'); }
  function openEdit(item: Pengumuman) {
    setEditing(item); const { id: _, ...rest } = item; setForm(rest); setMode('form');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form, expires_at: form.expires_at || null };
    if (editing) await supabase!.from('pengumuman').update(payload).eq('id', editing.id);
    else await supabase!.from('pengumuman').insert(payload);
    setSaving(false); setMode('list'); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase!.from('pengumuman').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null); load();
  }

  async function toggleStatus(item: Pengumuman) {
    await supabase!.from('pengumuman')
      .update({ status: item.status === 'published' ? 'draft' : 'published' })
      .eq('id', item.id);
    load();
  }

  if (mode === 'form') {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900">{editing ? 'Edit' : 'Tambah'} Pengumuman</h2>
        <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <Field label="Judul" required>
            <input className={inputCls} required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Isi Pengumuman" required>
            <textarea className={textareaCls} required value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
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
              <input type="date" className={inputCls} value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
            </Field>
            <Field label="Berlaku Hingga (opsional)">
              <input type="date" className={inputCls} value={form.expires_at ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value || undefined }))} />
            </Field>
          </div>
          <FormActions loading={saving} onCancel={() => setMode('list')} submitLabel={editing ? 'Perbarui' : 'Simpan'} />
        </form>
      </div>
    );
  }

  return (
    <AdminListPage title="Pengumuman" addLabel="Buat Pengumuman" onAdd={openAdd}>
      {loading ? <AdminLoading /> : error ? <AdminError message={error} /> : list.length === 0 ? (
        <AdminEmpty label="pengumuman" />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
          {list.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-stone-900 truncate">{item.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {item.priority === 'important' && <span className="text-amber-600 font-bold mr-1">⚠ Penting ·</span>}
                  {item.published_at}{item.expires_at ? ` – ${item.expires_at}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ToggleBtn active={item.status === 'published'} onClick={() => toggleStatus(item)} trueLabel="Published" falseLabel="Draft" />
                <EditBtn onClick={() => openEdit(item)} />
                <DeleteBtn onClick={() => setDeleteTarget(item)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete open={!!deleteTarget} label={deleteTarget?.title ?? ''}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminListPage>
  );
}
