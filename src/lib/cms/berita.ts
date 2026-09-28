import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Berita, CmsResponse } from './types';
import { newsData } from '../../data/news';

// ── Fallback (local static data) ─────────────────────────────
const fallbackBeritaList: Berita[] = newsData.map((item) => ({
  id:             item.id,
  title:          item.title,
  slug:           item.slug,
  excerpt:        item.excerpt,
  content:        item.content,
  featured_image: item.imageUrl,
  category:       item.category,
  author:         item.author || 'Tim Humas KUA Ngoro',
  published_at:   item.date,
  status:         'published' as const,
}));

// ── Fetchers ──────────────────────────────────────────────────

/**
 * Returns all published berita ordered by published_at desc.
 * Empty result from Supabase → returns [], no fallback.
 */
export async function getBerita(): Promise<CmsResponse<Berita[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('berita')
      .select('id,title,slug,excerpt,content,featured_image,category,author,published_at,status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Berita[];
  }, fallbackBeritaList);
}

/**
 * Returns a single published berita by slug.
 * Not found → null, no fallback.
 */
export async function getBeritaBySlug(slug: string): Promise<CmsResponse<Berita | null>> {
  const localMatch = fallbackBeritaList.find((b) => b.slug === slug) ?? null;

  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('berita')
      .select('id,title,slug,excerpt,content,featured_image,category,author,published_at,status')
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data ?? null) as Berita | null;
  }, localMatch);
}
