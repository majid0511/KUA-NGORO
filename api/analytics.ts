import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  body: unknown;
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
}

/**
 * Buat JWT untuk Service Account Google OAuth2.
 */
function createServiceAccountJwt(clientEmail: string, privateKey: string): string {
  const cleanPrivateKey = privateKey.replace(/\\n/g, '\n');
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(claimSet)}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  const signature = signer.sign(cleanPrivateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

/**
 * Ambil Access Token dari Google OAuth2 server.
 */
async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwt = createServiceAccountJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Auth error (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya izinkan HTTP GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Jika environment variables belum dikonfigurasi di server:
  if (!propertyId || !clientEmail || !privateKey) {
    return res.status(200).json({
      configured: false,
      message: 'Environment variables Google Analytics belum dikonfigurasi di serverless function.',
    });
  }

  const daysParam = (req.query.days as string) || '30';
  const days = parseInt(daysParam, 10) || 30;

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);

    // Panggil GA Data API batchRunReports
    const reportUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`;

    const reportRes = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          // Report 1: Daily Trends & Totals
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'screenPageViews' },
              { name: 'sessions' },
              { name: 'engagementRate' },
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
          },
          // Report 2: Top Pages
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 7,
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          },
          // Report 3: Devices
          {
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'activeUsers' }],
          },
        ],
      }),
    });

    if (!reportRes.ok) {
      const errJson = await reportRes.json();
      return res.status(reportRes.status).json({
        configured: true,
        error: 'Gagal mengambil data dari Google Analytics Data API.',
        details: errJson,
      });
    }

    const rawData = await reportRes.json();
    const reports = rawData.reports || [];

    // Parse Report 1: Daily trends & Totals
    const dailyReport = reports[0] || {};
    const dailyRows = dailyReport.rows || [];

    let totalUsers = 0;
    let totalViews = 0;
    let totalSessions = 0;
    let engagementRateSum = 0;

    const dailyData = dailyRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => {
      const dateStr = row.dimensionValues[0]?.value || '';
      const users = parseInt(row.metricValues[0]?.value || '0', 10);
      const views = parseInt(row.metricValues[1]?.value || '0', 10);
      const sessions = parseInt(row.metricValues[2]?.value || '0', 10);
      const engRate = parseFloat(row.metricValues[3]?.value || '0');

      totalUsers += users;
      totalViews += views;
      totalSessions += sessions;
      engagementRateSum += engRate;

      // Format YYYYMMDD -> DD/MM
      const formattedDate = dateStr.length === 8
        ? `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}`
        : dateStr;

      return {
        date: formattedDate,
        rawDate: dateStr,
        users,
        views,
      };
    });

    const avgEngagementRate = dailyRows.length > 0 ? (engagementRateSum / dailyRows.length) * 100 : 0;

    // Parse Report 2: Top Pages
    const topPagesReport = reports[1] || {};
    const topPagesRows = topPagesReport.rows || [];
    const topPages = topPagesRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      path: row.dimensionValues[0]?.value || '/',
      views: parseInt(row.metricValues[0]?.value || '0', 10),
    }));

    // Parse Report 3: Devices
    const deviceReport = reports[2] || {};
    const deviceRows = deviceReport.rows || [];
    const devices = deviceRows.map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      category: row.dimensionValues[0]?.value || 'other',
      users: parseInt(row.metricValues[0]?.value || '0', 10),
    }));

    return res.status(200).json({
      configured: true,
      periodDays: days,
      totals: {
        users: totalUsers,
        views: totalViews,
        sessions: totalSessions,
        engagementRate: Math.round(avgEngagementRate),
      },
      dailyData,
      topPages,
      devices,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({
      configured: true,
      error: 'Terjadi kesalahan pada server saat memproses data analytics.',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
