import { fetchCmsData, queryWithFallback } from './client';
import type { Layanan, CmsResponse } from './types';
import { servicesData } from '../../data/services';

// Fallback mapper from local servicesData
const fallbackLayananList: Layanan[] = servicesData.map((svc, idx) => ({
  id: svc.id,
  title: svc.title,
  slug: svc.id,
  description: svc.fullDesc || svc.shortDesc,
  requirements: svc.requirements,
  procedure: svc.procedure,
  estimated_time: '1 - 10 hari kerja',
  icon: svc.icon,
  status: 'active',
  order: idx + 1,
}));

/**
  * Fetch active services from CMS with fallback, ordered by `order asc`
  */
export async function getLayanan(): Promise<CmsResponse<Layanan[]>> {
  const query = `*[_type == "layanan" && status == "active"] | order(order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    description,
    requirements,
    procedure,
    estimated_time,
    icon,
    status,
    order
  }`;

  return queryWithFallback(
    () => fetchCmsData<Layanan[]>(query),
    fallbackLayananList
  );
}

/**
  * Fetch single active service by slug from CMS with fallback
  */
export async function getLayananBySlug(slug: string): Promise<CmsResponse<Layanan | null>> {
  const query = `*[_type == "layanan" && slug.current == $slug && status == "active"][0] {
    "id": _id,
    title,
    "slug": slug.current,
    description,
    requirements,
    procedure,
    estimated_time,
    icon,
    status,
    order
  }`;

  const localMatch = fallbackLayananList.find((l) => l.slug === slug || l.id === slug) || null;

  return queryWithFallback(
    () => fetchCmsData<Layanan | null>(query, { slug }),
    localMatch
  );
}
