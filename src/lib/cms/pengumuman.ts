import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Pengumuman, CmsResponse } from './types';
import { newsData } from '../../data/news';

// ── Fallback ──────────────────────────────────────────────────
const fallbackPengumumanList: Pengumuman[] = newsData
  .filter((item) => item.category === 'Pengumuman')
  .map((item) => ({
    id:           item.id,
    title:        item.title,
    content:      item.content || item.excerpt,
    published_at: item.date,
    expires_at:   undefined,
    priority:     (item.featured ? 'important' : 'normal') as 'normal' | 'important',
    status:       'published' as const,
  }));

// Client-side expiry filter (applied to both CMS and fallback data)
function filterExpired(list: Pengumuman[]): Pengumuman[] {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, zona waktu perangkat
  return list.filter((p) => !p.expires_at || p.expires_at >= today);
}

// ── Fetcher ───────────────────────────────────────────────────

/**
 * Returns published & non-expired pengumuman ordered by published_at desc.
 */
export async function getPengumuman(): Promise<CmsResponse<Pengumuman[]>> {
  const response = await queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('pengumuman')
      .select('id,title,content,published_at,expires_at,priority,status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Pengumuman[];
  }, fallbackPengumumanList);

  // Apply client-side expiry filter regardless of data source
  if (response.data) {
    response.data = filterExpired(response.data);
  }

  return response;
}
