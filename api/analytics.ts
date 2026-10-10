// FUNGSI SERVER (Vercel Serverless) UNTUK STATISTIK PENGUNJUNG: alamat /api/analytics.
// Berjalan di server, BUKAN di browser, sehingga kredensial Google (client secret & refresh token) tidak pernah terkirim ke pengunjung.
//
// Alur satu permintaan:
//   1. Pastikan peminta adalah admin yang login (verifyAdminUser) -> jika tidak, jawab 401.
//   2. Baca kredensial Google dari environment variable Vercel (jika belum lengkap, jawab "belum dikonfigurasi").
//   3. Tukar refresh token menjadi access token Google (getAccessTokenFromRefreshToken).
//   4. Minta 4 laporan sekaligus ke Google Analytics Data API: tren harian, halaman terpopuler, sumber lalu lintas, perangkat.
//   5. Rapikan hasilnya menjadi JSON sederhana untuk komponen AnalyticsSection.
// Environment variable yang dibutuhkan: GA_PROPERTY_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN,
// serta VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY (untuk memeriksa login admin).
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
 * Tukarkan GOOGLE_REFRESH_TOKEN menjadi Google OAuth 2.0 access_token.
 */
async function getAccessTokenFromRefreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Google OAuth Token Refresh Error:', errorBody);
    throw new Error('OAuth token refresh failed');
  }

  const data = (await res.json()) as { access_token: string };
  if (!data.access_token) {
    throw new Error('No access_token returned from Google OAuth');
  }

  return data.access_token;
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

  // Langkah 2: ambil kredensial Google dari environment variable server (tidak pernah terlihat oleh browser)
  const propertyId = process.env.GA_PROPERTY_ID;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  // Jika env variables belum lengkap:
  if (!propertyId || !clientId || !clientSecret || !refreshToken) {
    return res.status(200).json({
      success: true,
      configured: false,
      message: 'Kredensial Google OAuth 2.0 / Property ID belum dikonfigurasi di server.',
    });
  }

  // Periode laporan dalam hari dari alamat (?days=7|30|90); bila tidak valid dipakai 7 hari
  const daysParam = (req.query.days as string) || '7';
  const days = parseInt(daysParam, 10) || 7;

  try {
    // Langkah 3: tukar refresh token menjadi access token sementara dari Google
    const accessToken = await getAccessTokenFromRefreshToken(clientId, clientSecret, refreshToken);

    // Langkah 4: minta empat laporan sekaligus ke Google Analytics Data API
    // Alamat endpoint batchRunReports milik properti GA kita (GA_PROPERTY_ID)
    const reportUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`;

    const reportRes = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          // Report 1: Overview & Daily Trend
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'screenPageViews' },
              { name: 'sessions' },
              { name: 'newUsers' },
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
          },
          // Report 2: Popular Pages
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [
              { name: 'screenPageViews' },
              { name: 'activeUsers' },
            ],
            limit: 7,
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          },
          // Report 3: Traffic Sources
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            limit: 6,
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          },
          // Report 4: Devices
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'activeUsers' }],
          },
        ],
      }),
    });

    if (!reportRes.ok) {
      console.error('GA Data API Error Status:', reportRes.status);
      return res.status(200).json({
        success: false,
        configured: true,
        error: 'Analytics temporarily unavailable',
      });
    }

    // Jawaban mentah Google berisi daftar laporan sesuai urutan permintaan
    const rawData = await reportRes.json();
    const reports = rawData.reports || [];

    // Langkah 5a: olah laporan 1 -> data tren per hari + total keseluruhan
    const dailyReport = reports[0] || {};
    const dailyRows = dailyReport.rows || [];

    let totalUsers = 0;
    let totalViews = 0;
    let totalSessions = 0;
    let totalNewUsers = 0;

    const dailyData = dailyRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => {
      const dateStr = row.dimensionValues[0]?.value || '';
      const users = parseInt(row.metricValues[0]?.value || '0', 10);
      const views = parseInt(row.metricValues[1]?.value || '0', 10);
      const sessions = parseInt(row.metricValues[2]?.value || '0', 10);
      const newUsers = parseInt(row.metricValues[3]?.value || '0', 10);

      totalUsers += users;
      totalViews += views;
      totalSessions += sessions;
      totalNewUsers += newUsers;

      // Ubah tanggal Google (YYYYMMDD) menjadi "DD/MM" untuk label grafik
      const formattedDate = dateStr.length === 8
        ? `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}`
        : dateStr;

      return {
        date: formattedDate,
        rawDate: dateStr,
        users,
        views,
        newUsers,
      };
    });

    // Langkah 5b: olah laporan 2 -> halaman terpopuler
    const topPagesReport = reports[1] || {};
    const topPagesRows = topPagesReport.rows || [];
    const topPages = topPagesRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      path: row.dimensionValues[0]?.value || '/',
      views: parseInt(row.metricValues[0]?.value || '0', 10),
      users: parseInt(row.metricValues[1]?.value || '0', 10),
    }));

    // Langkah 5c: olah laporan 3 -> sumber lalu lintas
    const trafficReport = reports[2] || {};
    const trafficRows = trafficReport.rows || [];
    const trafficSources = trafficRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      channel: row.dimensionValues[0]?.value || 'Direct',
      sessions: parseInt(row.metricValues[0]?.value || '0', 10),
    }));

    // Langkah 5d: olah laporan 4 -> jenis perangkat
    const deviceReport = reports[3] || {};
    const deviceRows = deviceReport.rows || [];
    const devices = deviceRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      category: row.dimensionValues[0]?.value || 'other',
      users: parseInt(row.metricValues[0]?.value || '0', 10),
    }));

    return res.status(200).json({
      success: true,
      configured: true,
      periodDays: days,
      totals: {
        users: totalUsers,
        views: totalViews,
        sessions: totalSessions,
        newUsers: totalNewUsers,
      },
      dailyData,
      topPages,
      trafficSources,
      devices,
    });
  } catch (error) {
    // Kesalahan tak terduga: dicatat di log server; browser hanya menerima pesan umum (detail teknis tidak dibocorkan)
    console.error('Analytics API exception:', error);
    return res.status(200).json({
      success: false,
      configured: true,
      error: 'Analytics temporarily unavailable',
    });
  }
}
