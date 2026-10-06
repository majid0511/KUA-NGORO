import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Users, Eye, Activity, UserPlus, AlertCircle, BarChart3, Monitor, Smartphone, Tablet, Share2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Totals {
  users: number;
  views: number;
  sessions: number;
  newUsers: number;
}

interface DailyPoint {
  date: string;
  rawDate: string;
  users: number;
  views: number;
  newUsers: number;
}

interface TopPage {
  path: string;
  views: number;
  users: number;
}

interface TrafficSource {
  channel: string;
  sessions: number;
}

interface DeviceStat {
  category: string;
  users: number;
}

interface AnalyticsApiResponse {
  success?: boolean;
  configured: boolean;
  message?: string;
  error?: string;
  periodDays?: number;
  totals?: Totals;
  dailyData?: DailyPoint[];
  topPages?: TopPage[];
  trafficSources?: TrafficSource[];
  devices?: DeviceStat[];
}

// Pemetaan path ke label ramah pengguna
const PATH_LABELS: Record<string, string> = {
  '/': 'Beranda',
  '/profil': 'Profil',
  '/layanan': 'Layanan',
  '/layanan/pernikahan': 'Layanan Pernikahan',
  '/informasi': 'Informasi & Berita',
  '/kegiatan': 'Kegiatan & Galeri',
  '/kontak': 'Kontak',
};

function formatPathLabel(path: string): string {
  if (PATH_LABELS[path]) return PATH_LABELS[path];
  if (path.startsWith('/news/')) return `Detail Berita: ${path.replace('/news/', '')}`;
  return path;
}

export default function AnalyticsSection() {
  const [days, setDays] = useState<7 | 30 | 90>(7); // Default 7 hari
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AnalyticsApiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (selectedDays: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Ambil Supabase Auth Session Token
      let authHeader = '';
      if (supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.access_token) {
          authHeader = `Bearer ${sessionData.session.access_token}`;
        }
      }

      const res = await fetch(`/api/analytics?days=${selectedDays}`, {
        headers: authHeader ? { Authorization: authHeader } : {},
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Sesi admin berakhir. Silakan login kembali.');
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json: AnalyticsApiResponse = await res.json();
      if (json.error) {
        setErrorMsg(json.error);
      } else {
        setData(json);
      }
    } catch (err) {
      console.warn('Analytics fetch error:', err);
      setErrorMsg('Analytics tidak dapat dimuat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(days);
  }, [days, fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics(days);
  };

  const isUnconfigured = data && !data.configured;
  const totals = data?.totals;
  const dailyData = data?.dailyData || [];
  const topPages = data?.topPages || [];
  const trafficSources = data?.trafficSources || [];
  const devices = data?.devices || [];
  const isEmptyData = totals && totals.users === 0 && totals.views === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#0f5132]" />
            <h2 className="text-base font-bold text-slate-900">Analytics Website</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Statistik kunjungan masyarakat ke portal KUA Ngoro (GA4).</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Day Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-2.5 py-1 rounded-md transition ${
                  days === d
                    ? 'bg-white text-[#0f5132] shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {d} Hari
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition"
            title="Perbarui data analytics"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-[#0f5132]' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-[#0f5132]" />
          <p className="text-xs font-medium">Memuat data Google Analytics 4...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && errorMsg && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMsg}</p>
            <p className="mt-1 text-amber-700">
              Pastikan kredensial Google OAuth 2.0 di server telah dikonfigurasi dengan benar.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded transition shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Unconfigured state */}
      {!loading && isUnconfigured && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <AlertCircle size={16} className="text-blue-600" />
            <span>Google Analytics 4 OAuth 2.0 Belum Dikonfigurasi</span>
          </div>
          <p>
            Data analytics tidak dapat ditampilkan karena kredensial Google OAuth 2.0 belum diisi di environment server (Vercel).
          </p>
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 space-y-1">
            <p className="font-sans font-semibold text-slate-800">Environment variables yang diperlukan di Vercel:</p>
            <p>• GA_PROPERTY_ID=557572449</p>
            <p>• GOOGLE_CLIENT_ID=Client ID OAuth 2.0 GCP</p>
            <p>• GOOGLE_CLIENT_SECRET=Client Secret OAuth 2.0 GCP</p>
            <p>• GOOGLE_REFRESH_TOKEN=Refresh Token OAuth 2.0 GA4</p>
          </div>
        </div>
      )}

      {/* Main analytics view */}
      {(!isUnconfigured || totals) && (
        <>
          {/* Empty state */}
          {isEmptyData && !loading && (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <BarChart3 size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-800">Belum ada data analytics</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Data pengunjung akan muncul setelah website mulai menerima kunjungan publik pada periode {days} hari terakhir.
              </p>
            </div>
          )}

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
                <Users size={16} className="text-[#0f5132]" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? '–' : totals?.users.toLocaleString('id-ID') ?? 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Pengguna aktif ({days} hari)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Sessions</span>
                <Activity size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? '–' : totals?.sessions.toLocaleString('id-ID') ?? 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Total sesi kunjungan</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Page Views</span>
                <Eye size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? '–' : totals?.views.toLocaleString('id-ID') ?? 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Total tampilan halaman</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">New Users</span>
                <UserPlus size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? '–' : totals?.newUsers.toLocaleString('id-ID') ?? 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Pengunjung baru</p>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Grafik Kunjungan ({days} Hari Terakhir)
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f5132]" /> Active Users
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Page Views
                </span>
              </div>
            </div>

            <SvgTrendChart dailyData={dailyData} loading={loading} />
          </div>

          {/* Bottom Grid: Popular Pages, Traffic Sources & Devices */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Popular Pages (2 Cols) */}
            <div className="lg:col-span-2 p-4 bg-white border border-slate-200 rounded-xl">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                Halaman Terpopuler
              </h3>

              {topPages.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada data statistik halaman.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                        <th className="py-2 px-1">Halaman</th>
                        <th className="py-2 px-1 text-right">Views</th>
                        <th className="py-2 px-1 text-right">Users</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topPages.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-1 font-medium text-slate-800 truncate max-w-[220px]">
                            {formatPathLabel(item.path)}
                            <span className="block text-[10px] text-slate-400 font-mono truncate">{item.path}</span>
                          </td>
                          <td className="py-2.5 px-1 text-right font-bold text-slate-900">
                            {item.views.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-1 text-right text-slate-600 font-medium">
                            {item.users.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Traffic & Device Breakdown (1 Col) */}
            <div className="space-y-5">
              {/* Traffic Sources */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Share2 size={14} className="text-slate-500" />
                  Sumber Traffic
                </h3>
                <TrafficBreakdown trafficSources={trafficSources} />
              </div>

              {/* Devices */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Perangkat Pengunjung
                </h3>
                <DeviceBreakdown devices={devices} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Lightweight SVG Chart Component
 */
function SvgTrendChart({ dailyData, loading }: { dailyData: DailyPoint[]; loading: boolean }) {
  if (loading || dailyData.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-slate-400">
        {loading ? 'Memuat grafik...' : 'Data grafik belum tersedia'}
      </div>
    );
  }

  const width = 600;
  const height = 160;
  const padding = 20;

  const maxUsers = Math.max(...dailyData.map((d) => d.users), 5);
  const maxViews = Math.max(...dailyData.map((d) => d.views), 5);
  const maxVal = Math.max(maxUsers, maxViews);

  const getX = (index: number) => {
    if (dailyData.length <= 1) return width / 2;
    return padding + (index / (dailyData.length - 1)) * (width - padding * 2);
  };

  const getY = (val: number) => {
    return height - padding - (val / maxVal) * (height - padding * 2);
  };

  const userPoints = dailyData.map((d, i) => `${getX(i)},${getY(d.users)}`).join(' ');
  const viewPoints = dailyData.map((d, i) => `${getX(i)},${getY(d.views)}`).join(' ');

  const step = Math.max(1, Math.floor(dailyData.length / 6));

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 0.5, 1].map((ratio, i) => {
          const y = height - padding - ratio * (height - padding * 2);
          const val = Math.round(ratio * maxVal);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={padding} y={y - 3} fill="#94a3b8" fontSize="9" textAnchor="start">
                {val}
              </text>
            </g>
          );
        })}

        <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={viewPoints} opacity={0.75} />
        <polyline fill="none" stroke="#0f5132" strokeWidth="2.5" points={userPoints} />

        {dailyData.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.users)} r="3" fill="#0f5132" />
          </g>
        ))}

        {dailyData.map((d, i) => {
          if (i % step !== 0 && i !== dailyData.length - 1) return null;
          return (
            <text
              key={i}
              x={getX(i)}
              y={height - 2}
              fill="#64748b"
              fontSize="9"
              textAnchor="middle"
            >
              {d.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Breakdown Traffic Sources Component
 */
function TrafficBreakdown({ trafficSources }: { trafficSources: TrafficSource[] }) {
  const total = trafficSources.reduce((acc, curr) => acc + curr.sessions, 0);

  if (trafficSources.length === 0 || total === 0) {
    return <p className="text-xs text-slate-400 py-2">Data sumber traffic belum tersedia.</p>;
  }

  return (
    <div className="space-y-2.5">
      {trafficSources.map((item, i) => {
        const percent = Math.round((item.sessions / total) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="truncate max-w-[140px]">{item.channel}</span>
              <span className="font-bold text-slate-900">{percent}% ({item.sessions})</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Breakdown Device Component
 */
function DeviceBreakdown({ devices }: { devices: DeviceStat[] }) {
  const total = devices.reduce((acc, curr) => acc + curr.users, 0);

  if (devices.length === 0 || total === 0) {
    return <p className="text-xs text-slate-400 py-2">Data perangkat belum tersedia.</p>;
  }

  const getIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mobile':
        return 'HP / Mobile';
      case 'desktop':
        return 'Komputer / Desktop';
      case 'tablet':
        return 'Tablet';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-2.5">
      {devices.map((d, i) => {
        const Icon = getIcon(d.category);
        const percent = Math.round((d.users / total) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Icon size={14} className="text-slate-500" />
                {getLabel(d.category)}
              </span>
              <span className="font-bold text-slate-900">{percent}% ({d.users})</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0f5132] rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
