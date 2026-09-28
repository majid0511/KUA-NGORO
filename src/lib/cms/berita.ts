import { fetchCmsData, queryWithFallback } from './client';
import type { Berita, CmsResponse } from './types';
import { newsData } from '../../data/news';

// Fallback mapper from existing local newsData
const fallbackBeritaList: Berita[] = newsData.map((item) => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  excerpt: item.excerpt,
  content: item.content,
  featured_image: item.imageUrl,
  category: item.category,
  author: item.author || 'Tim Humas KUA Ngoro',
  published_at: item.date,
  status: 'published',
}));

/**
  * Fetch published news list from CMS with fallback
  */
export async function getBerita(): Promise<CmsResponse<Berita[]>> {
  const query = `*[_type == "berita" && status == "published"] | order(published_at desc) {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "featured_image": featured_image.asset->url,
    category,
    author,
    published_at,
    status
  }`;

  return queryWithFallback(
    () => fetchCmsData<Berita[]>(query),
    fallbackBeritaList
  );
}

/**
  * Fetch single published news item by slug from CMS with fallback
  */
export async function getBeritaBySlug(slug: string): Promise<CmsResponse<Berita | null>> {
  const query = `*[_type == "berita" && slug.current == $slug && status == "published"][0] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "featured_image": featured_image.asset->url,
    category,
    author,
    published_at,
    status
  }`;

  const localMatch = fallbackBeritaList.find((b) => b.slug === slug) || null;

  return queryWithFallback(
    () => fetchCmsData<Berita | null>(query, { slug }),
    localMatch
  );
}
