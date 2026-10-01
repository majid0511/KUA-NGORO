import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Pengumuman } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';

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
    const ok = await run(
      editing
        ? supabase!.from('pengumuman').update(payload).eq('id', editing.id)
        : supabase!.from('pengumuman').insert(payload),
    );
    setSaving(false);
    if (!ok) return;
    setMode('list'); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('pengumuman').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  async function toggleStatus(item: Pengumuman) {
    if (!(await run(supabase!.from('pengumuman')
      .update({ status: item.status === 'published' ? 'draft' : 'published' })
      .eq('id', item.id)))) return;
    load();
  }

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
