import { fetchCmsData, queryWithFallback } from './client';
import type { Pengumuman, CmsResponse } from './types';
import { newsData } from '../../data/news';

// Fallback mapper for announcements from local data
const fallbackPengumumanList: Pengumuman[] = newsData
  .filter((item) => item.category === 'Pengumuman')
  .map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content || item.excerpt,
    published_at: item.date,
    priority: item.featured ? 'important' : 'normal',
    status: 'published',
  }));

/**
  * Fetch published & active announcements from CMS with fallback
  * Filters out expired announcements (expires_at < current date)
  */
export async function getPengumuman(): Promise<CmsResponse<Pengumuman[]>> {
  const query = `*[_type == "pengumuman" && status == "published" && (!defined(expires_at) || expires_at >= now())] | order(published_at desc) {
    "id": _id,
    title,
    content,
    published_at,
    expires_at,
    priority,
    status
  }`;

  const response = await queryWithFallback(
    () => fetchCmsData<Pengumuman[]>(query),
    fallbackPengumumanList
  );

  // Filter kedaluwarsa di klien, berlaku juga untuk data fallback lokal
  if (response.data) {
    const now = new Date().toISOString();
    response.data = response.data.filter((item) => {
      if (!item.expires_at) return true;
      return item.expires_at >= now;
    });
  }

  return response;
}
