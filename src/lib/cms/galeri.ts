import { fetchCmsData, queryWithFallback } from './client';
import type { Galeri, CmsResponse } from './types';
import { activitiesData } from '../../data/activities';

// Fallback mapper from local activitiesData
const fallbackGaleriList: Galeri[] = activitiesData.map((act) => ({
  id: act.id,
  title: act.title,
  image: act.imageUrl,
  description: act.description,
  category: act.category,
  published_at: act.date,
}));

/**
  * Fetch gallery items from CMS with fallback, ordered by `published_at desc`
  */
export async function getGaleri(): Promise<CmsResponse<Galeri[]>> {
  const query = `*[_type == "galeri"] | order(published_at desc) {
    "id": _id,
    title,
    "image": image.asset->url,
    description,
    category,
    published_at
  }`;

  return queryWithFallback(
    () => fetchCmsData<Galeri[]>(query),
    fallbackGaleriList
  );
}
