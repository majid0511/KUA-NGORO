import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Galeri, CmsResponse } from './types';
import { activitiesData } from '../../data/activities';

// ── Fallback ──────────────────────────────────────────────────
const fallbackGaleriList: Galeri[] = activitiesData.map((act) => ({
  id:           act.id,
  title:        act.title,
  image:        act.imageUrl,
  description:  act.description,
  category:     act.category,
  published_at: act.date,
}));

// ── Fetcher ───────────────────────────────────────────────────

/**
 * Returns all galeri items ordered by published_at desc.
 */
export async function getGaleri(): Promise<CmsResponse<Galeri[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('galeri')
      .select('id,title,image,description,category,published_at')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Galeri[];
  }, fallbackGaleriList);
}
