import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Layanan } from '../../lib/cms/types';
import {
  PageHeader, Table, Th, Td, Tr, StatusPill, RowActions,
  AdminLoading, AdminEmpty, AdminError, ConfirmDelete,
  FormCard, Field, inputCls, textareaCls, FormActions, run,
} from './AdminUI';

type Mode = 'list' | 'form';

// Harus sama dengan daftar yang dikenali ServiceCard.tsx — nama di luar ini
// akan tampil sebagai ikon generik di halaman publik.
const ICON_OPTIONS = [
  'HeartHandshake', 'Building2', 'Landmark', 'ShieldCheck', 'BookOpen', 'Users',
] as const;

const EMPTY_FORM: Omit<Layanan, 'id'> = {
  title: '', slug: '', description: '',
  requirements: [], procedure: [],
  estimated_time: '', icon: 'Landmark',
  status: 'active', order: 0,
};

export default function LayananAdmin() {
  const [mode, setMode]         = useState<Mode>('list');
  const [list, setList]         = useState<Layanan[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [editing, setEditing]   = useState<Layanan | null>(null);
  const [form, setForm]         = useState<Omit<Layanan, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Layanan | null>(null);

  // Textarea helpers for arrays
  const [reqText, setReqText] = useState('');
  const [procText, setProcText] = useState('');

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!
      .from('layanan').select('*').order('order', { ascending: true });
    if (error) setError(error.message);
    else setList((data ?? []) as Layanan[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: list.length + 1 });
    setReqText(''); setProcText('');
    setMode('form');
  }

  function openEdit(item: Layanan) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setReqText(item.requirements.join('\n'));
    setProcText(item.procedure.join('\n'));
    setMode('form');
  }

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

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!(await run(supabase!.from('layanan').delete().eq('id', deleteTarget.id)))) return;
    setDeleteTarget(null); load();
  }

  async function toggleStatus(item: Layanan) {
    if (!(await run(supabase!.from('layanan')
      .update({ status: item.status === 'active' ? 'inactive' : 'active' })
      .eq('id', item.id)))) return;
    load();
  }

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
            <Field label="Ikon">
              <select className={inputCls} value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}>
                {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </Field>
          </div>
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
