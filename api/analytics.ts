// FUNGSI SERVER (Vercel Serverless) UNTUK STATISTIK PENGUNJUNG: alamat /api/analytics.
// Berjalan di server, BUKAN di browser, sehingga token Vercel tidak pernah terkirim ke pengunjung.
//
// Sumber data: Vercel Web Analytics API (https://api.vercel.com/v1/query/web-analytics/...), angkanya sama dengan
// tab Analytics di dashboard Vercel. Tidak memakai cookie dan tidak butuh kunci Google.
//
// Alur satu permintaan:
//   1. Pastikan peminta adalah admin yang login (verifyAdminUser) -> jika tidak, jawab 401.
//   2. Baca token & ID project dari environment variable Vercel (jika belum lengkap, jawab "belum dikonfigurasi").
//   3. Minta 4 laporan sekaligus ke Vercel: tren harian, halaman terpopuler, sumber lalu lintas, perangkat.
//   4. Rapikan hasilnya menjadi JSON sederhana untuk komponen AnalyticsSection.
//
// Environment variable yang dibutuhkan (di Vercel -> Project -> Settings -> Environment Variables):
//   WEB_ANALYTICS_TOKEN       : token akses Vercel (Account Settings -> Tokens)
//   WEB_ANALYTICS_PROJECT_ID  : ID project (prj_...)
//   WEB_ANALYTICS_TEAM_ID     : ID team (team_...) -- HANYA jika project milik team; kosongkan untuk akun pribadi
//   VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY : untuk memeriksa login admin

import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';

/**
 * Bentuk objek permintaan (sebagian saja) yang dipakai fungsi ini
 */
interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
}

/**
 * Bentuk objek jawaban (sebagian saja): status() mengatur kode HTTP, json() mengirim isi JSON
 */
interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
}


/**
 * Verifikasi apakah request berasal dari Admin yang terautentikasi via Supabase Auth.
 */
async function verifyAdminUser(req: VercelRequest): Promise<boolean> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase belum dikonfigurasi di server -> tolak, bukan izinkan.
    // Endpoint admin-only tidak boleh fail-open saat verifikasi tidak bisa dijalankan.
    console.error('verifyAdminUser: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tidak terbaca di server');
    return false;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return false;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return false;
  }

  try {
    // Lampirkan token admin sebagai Authorization header, supaya query
    // di bawah berjalan sebagai user itu sendiri (role "authenticated",
    // auth.uid() terisi) -- bukan sebagai anon, yang memang diblokir RLS
    // dari membaca tabel admins ("admins_manage" policy pakai is_admin()).
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return false;
    }

    // Pastikan user terdaftar di tabel "admins" (login saja belum cukup); ada = admin, tidak ada = bukan admin
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    return !!adminRecord;
  } catch (err) {
    console.error('Admin verification error:', err);
    return false;
  }
}


/** Alamat dasar endpoint "aggregate" Web Analytics (data kunjungan otomatis: pageviews & visitors). */
const VISITS_AGGREGATE_URL = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate';

/** Error dari Vercel API, membawa kode status HTTP agar bisa diterjemahkan ke pesan yang mudah dipahami admin. */
class VercelApiError extends Error {
  status: number;
  constructor(status: number, detail: string) {
    super(`Vercel API ${status}: ${detail}`);
    this.status = status;
  }
}

/** Satu baris hasil dari Vercel: kolom dimensi (mis. country) + angka pageviews & visitors. */
type VercelRow = Record<string, unknown>;

/**
 * Memanggil endpoint aggregate Vercel dengan parameter tertentu dan mengembalikan daftar barisnya.
 * Token dikirim lewat header Authorization (tidak pernah di alamat URL).
 */
async function queryVisits(
  token: string,
  base: Record<string, string>,
  extra: Record<string, string>
): Promise<VercelRow[]> {
  const url = `${VISITS_AGGREGATE_URL}?${new URLSearchParams({ ...base, ...extra }).toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new VercelApiError(res.status, detail);
  }
  const json = (await res.json()) as { data?: unknown };
  return Array.isArray(json.data) ? (json.data as VercelRow[]) : [];
}

/** Mengubah nilai apa pun dari Vercel menjadi angka (nilai tidak valid dianggap 0). */
const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Format tanggal YYYY-MM-DD (UTC), sesuai yang diminta parameter since/until Vercel. */
const ymd = (d: Date): string => d.toISOString().slice(0, 10);

/**
 * Mengambil nilai dimensi dari satu baris. Vercel mengelompokkan sisa nilai yang melebihi "limit" menjadi "Others".
 * Nilai kosong (mis. pengunjung tanpa referrer) dianggap kunjungan langsung.
 */
function dimensionValue(row: VercelRow, key: string): string {
  const v = row[key];
  return v === null || v === undefined ? '' : String(v);
}

/** Urutkan baris dari pengunjung terbanyak ke tersedikit. */
const byVisitorsDesc = (a: VercelRow, b: VercelRow) => num(b.visitors) - num(a.visitors);

/** Terjemahkan kegagalan Vercel API menjadi pesan untuk admin (tanpa membocorkan detail teknis atau token). */
function describeVercelError(err: unknown): string {
  if (err instanceof VercelApiError) {
    if (err.status === 401 || err.status === 403) return 'Token Vercel ditolak atau tidak punya akses ke project ini.';
    if (err.status === 404) return 'Project tidak ditemukan. Periksa WEB_ANALYTICS_PROJECT_ID dan WEB_ANALYTICS_TEAM_ID.';
    if (err.status === 400) return 'Permintaan ditolak Vercel (mungkin periode melebihi batas paket). Coba periode yang lebih pendek.';
    if (err.status === 429) return 'Terlalu banyak permintaan ke Vercel. Coba lagi sebentar.';
  }
  return 'Analytics temporarily unavailable';
}

/**
 * Pintu masuk fungsi server: dipanggil Vercel setiap ada permintaan GET ke /api/analytics?days=7|30|90.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya menerima permintaan GET; metode lain ditolak (405)
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Langkah 1: pastikan peminta adalah admin yang login (jika tidak, hentikan di sini dengan kode 401)
  const isAuthorized = await verifyAdminUser(req);
  if (!isAuthorized) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak. Hanya admin terautentikasi yang dapat mengakses analytics.',
    });
  }

  // Langkah 2: ambil token & ID project dari environment variable server (tidak pernah terlihat oleh browser)
  const token = process.env.WEB_ANALYTICS_TOKEN;
  const projectId = process.env.WEB_ANALYTICS_PROJECT_ID;
  const teamId = process.env.WEB_ANALYTICS_TEAM_ID; // boleh kosong (akun pribadi)

  if (!token || !projectId) {
    return res.status(200).json({
      success: true,
      configured: false,
      message: 'Token Vercel / Project ID untuk Web Analytics belum dikonfigurasi di server.',
    });
  }

  // Periode laporan dalam hari dari alamat (?days=7|30|90); nilai tidak valid -> 7 hari, maksimal 90
  const daysParam = (req.query.days as string) || '7';
  const days = Math.min(Math.max(parseInt(daysParam, 10) || 7, 1), 90);

  // Rentang tanggal: dari "days" hari lalu sampai hari ini (UTC)
  const today = new Date();
  const since = ymd(new Date(today.getTime() - days * 24 * 60 * 60 * 1000));
  const until = ymd(today);

  // Parameter yang sama untuk keempat laporan
  const base: Record<string, string> = { projectId, since, until };
  if (teamId) base.teamId = teamId;

  try {
    // Langkah 3: minta empat laporan sekaligus (paralel) supaya cepat
    const [dailyRows, pageRows, sourceRows, deviceRows] = await Promise.all([
      queryVisits(token, base, { by: 'day' }),
      queryVisits(token, base, { by: 'requestPath', limit: '8' }),
      queryVisits(token, base, { by: 'referrerHostname', limit: '6' }),
      queryVisits(token, base, { by: 'deviceType', limit: '6' }),
    ]);

    // Langkah 4a: tren harian. Hari tanpa kunjungan mungkin tidak dikirim Vercel, jadi diisi 0 agar grafik utuh.
    const dailyByDate = new Map<string, { users: number; views: number }>();
    for (const row of dailyRows) {
      const key = dimensionValue(row, 'timestamp').slice(0, 10); // YYYY-MM-DD
      if (key) dailyByDate.set(key, { users: num(row.visitors), views: num(row.pageviews) });
    }

    let totalUsers = 0;
    let totalViews = 0;
    const dailyData: { date: string; rawDate: string; users: number; views: number }[] = [];
    for (let t = new Date(`${since}T00:00:00.000Z`).getTime(); t <= new Date(`${until}T00:00:00.000Z`).getTime(); t += 24 * 60 * 60 * 1000) {
      const key = ymd(new Date(t)); // YYYY-MM-DD
      const point = dailyByDate.get(key) ?? { users: 0, views: 0 };
      totalUsers += point.users;
      totalViews += point.views;
      dailyData.push({
        date: `${key.slice(8, 10)}/${key.slice(5, 7)}`, // label grafik "DD/MM"
        rawDate: key.replace(/-/g, ''), // YYYYMMDD
        users: point.users,
        views: point.views,
      });
    }

    // Langkah 4b: halaman terpopuler (baris "Others" dibuang karena bukan satu halaman)
    const topPages = pageRows
      .filter((row) => dimensionValue(row, 'requestPath') !== 'Others')
      .sort((a, b) => num(b.pageviews) - num(a.pageviews))
      .slice(0, 7)
      .map((row) => ({
        path: dimensionValue(row, 'requestPath') || '/',
        views: num(row.pageviews),
        users: num(row.visitors),
      }));

    // Langkah 4c: sumber lalu lintas berdasarkan situs perujuk (referrer); kosong = langsung
    const trafficSources = [...sourceRows].sort(byVisitorsDesc).map((row) => {
      const host = dimensionValue(row, 'referrerHostname');
      return {
        channel: host === 'Others' ? 'Lainnya' : host || 'Langsung',
        visitors: num(row.visitors),
      };
    });

    // Langkah 4d: jenis perangkat
    const devices = [...deviceRows].sort(byVisitorsDesc).map((row) => ({
      category: dimensionValue(row, 'deviceType').toLowerCase() || 'other',
      users: num(row.visitors),
    }));

    return res.status(200).json({
      success: true,
      configured: true,
      periodDays: days,
      totals: { users: totalUsers, views: totalViews },
      dailyData,
      topPages,
      trafficSources,
      devices,
    });
  } catch (error) {
    // Kesalahan dicatat di log server; browser hanya menerima pesan yang aman (tanpa token / detail teknis)
    console.error('Analytics API exception:', error);
    return res.status(200).json({
      success: false,
      configured: true,
      error: describeVercelError(error),
    });
  }
}
