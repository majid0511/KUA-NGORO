import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Profil } from '../../lib/cms/types';
import { PageHeader, AdminLoading, AdminError, Field, inputCls, textareaCls, run } from './AdminUI';
import { AlertTriangle } from 'lucide-react';

const EMPTY_PROFIL: Profil = {
  office_name: '', description: '', history: '', vision: '',
  mission: [], address: '', phone: '', email: '',
  office_hours: { workDays: '', fridayHours: '', weekend: '' },
  maintenance_mode: false,
};

export default function ProfilAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [profilId, setProfilId] = useState<string | null>(null);
  const [form, setForm]       = useState<Profil>(EMPTY_PROFIL);
  const [missionText, setMissionText] = useState('');
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase!.from('profil').select('*').maybeSingle();
    if (error) {
      setError(error.message);
    } else if (data) {
      setProfilId(data.id as string);
      setForm(data as Profil);
      setMissionText((data.mission as string[]).join('\n'));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      office_name:  form.office_name,
      description:  form.description,
      history:      form.history,
      vision:       form.vision,
      mission:      missionText.split('\n').map((s) => s.trim()).filter(Boolean),
      address:      form.address,
      phone:        form.phone,
      email:        form.email,
      office_hours: form.office_hours,
    };

    // Singleton: update baris yang ada; insert hanya jika belum ada sama sekali.
    if (profilId) {
      const ok = await run(supabase!.from('profil').update(payload).eq('id', profilId));
      setSaving(false);
      if (ok) alert('Profil berhasil disimpan');
      return;
    }
    const { data, error: insertError } = await supabase!
      .from('profil').insert(payload).select('id').single();
    setSaving(false);
    if (insertError) {
      alert(`Gagal menyimpan perubahan: ${insertError.message}`);
      return;
    }
    setProfilId(data.id as string);
    alert('Profil berhasil disimpan');
  }

  async function handleToggleMaintenance() {
    if (!profilId) {
      alert('Simpan profil terlebih dahulu sebelum mengaktifkan mode maintenance.');
      return;
    }
    const next = !form.maintenance_mode;
    setTogglingMaintenance(true);
    const ok = await run(supabase!.from('profil').update({ maintenance_mode: next }).eq('id', profilId));
    setTogglingMaintenance(false);
    if (ok) setForm((f) => ({ ...f, maintenance_mode: next }));
  }

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Profil KUA" description="Informasi institusi, kontak, dan jam pelayanan (satu data untuk seluruh situs)." />

      {/* Mode maintenance: sakelar terpisah, berefek langsung ke seluruh situs publik */}
      <div className={`rounded-xl border p-5 flex items-start gap-4 ${
        form.maintenance_mode ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
      }`}>
        <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${form.maintenance_mode ? 'text-amber-600' : 'text-slate-300'}`} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">Mode Maintenance</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Saat aktif, seluruh halaman publik menampilkan pesan &ldquo;Web dalam Maintenance&rdquo;.
            Panel admin ini tetap bisa diakses seperti biasa.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.maintenance_mode}
          disabled={togglingMaintenance}
          onClick={handleToggleMaintenance}
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-60 ${
            form.maintenance_mode ? 'bg-amber-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              form.maintenance_mode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informasi umum</h3>
          <Field label="Nama Kantor" required>
            <input className={inputCls} required value={form.office_name}
              onChange={(e) => setForm(f => ({ ...f, office_name: e.target.value }))} />
          </Field>
          <Field label="Deskripsi Singkat">
            <textarea className={textareaCls} value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Sejarah KUA">
            <textarea className={`${textareaCls} min-h-[150px]`} value={form.history}
              onChange={(e) => setForm(f => ({ ...f, history: e.target.value }))} />
          </Field>
        </div>

        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Visi & misi</h3>
          <Field label="Visi">
            <textarea className={textareaCls} value={form.vision}
              onChange={(e) => setForm(f => ({ ...f, vision: e.target.value }))} />
          </Field>
          <Field label="Misi (satu per baris)">
            <textarea className={`${textareaCls} min-h-[150px]`} value={missionText}
              onChange={(e) => setMissionText(e.target.value)} />
          </Field>
        </div>

        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kontak & alamat</h3>
          <Field label="Alamat Lengkap">
            <textarea className={textareaCls} value={form.address}
              onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telepon / WhatsApp">
              <input className={inputCls} value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </Field>
            <Field label="Email">
              <input type="email" className={inputCls} value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jam pelayanan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Senin - Kamis">
              <input className={inputCls} placeholder="07.30 - 16.00 WIB" value={form.office_hours.workDays}
                onChange={(e) => setForm(f => ({ ...f, office_hours: { ...f.office_hours, workDays: e.target.value } }))} />
            </Field>
            <Field label="Jumat">
              <input className={inputCls} placeholder="07.30 - 16.30 WIB" value={form.office_hours.fridayHours}
                onChange={(e) => setForm(f => ({ ...f, office_hours: { ...f.office_hours, fridayHours: e.target.value } }))} />
            </Field>
            <Field label="Sabtu - Minggu">
              <input className={inputCls} placeholder="Tutup" value={form.office_hours.weekend}
                onChange={(e) => setForm(f => ({ ...f, office_hours: { ...f.office_hours, weekend: e.target.value } }))} />
            </Field>
          </div>
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0f5132] text-white text-sm font-semibold rounded-lg hover:bg-[#073822] transition disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
