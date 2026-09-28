import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Layanan, CmsResponse } from './types';
import { servicesData } from '../../data/services';

// ── Fallback ──────────────────────────────────────────────────
const fallbackLayananList: Layanan[] = servicesData.map((svc, idx) => ({
  id:             svc.id,
  title:          svc.title,
  slug:           svc.id,
  description:    svc.fullDesc || svc.shortDesc,
  requirements:   svc.requirements,
  procedure:      svc.procedure,
  estimated_time: '1 - 10 hari kerja',
  icon:           svc.icon,
  status:         'active' as const,
  order:          idx + 1,
}));

// ── Fetchers ──────────────────────────────────────────────────

/**
 * Returns all active layanan ordered by order asc.
 */
export async function getLayanan(): Promise<CmsResponse<Layanan[]>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('layanan')
      .select('id,title,slug,description,requirements,procedure,estimated_time,icon,status,order')
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as Layanan[];
  }, fallbackLayananList);
}

/**
 * Returns a single active layanan by slug or id.
 */
export async function getLayananBySlug(slug: string): Promise<CmsResponse<Layanan | null>> {
  const localMatch =
    fallbackLayananList.find((l) => l.slug === slug || l.id === slug) ?? null;

  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('layanan')
      .select('id,title,slug,description,requirements,procedure,estimated_time,icon,status,order')
      .eq('status', 'active')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data ?? null) as Layanan | null;
  }, localMatch);
}
