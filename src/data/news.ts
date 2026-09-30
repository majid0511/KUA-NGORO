export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Pengumuman' | 'Berita' | 'Artikel';
  date: string;
  author: string;
  imageUrl: string;
  featured?: boolean;
}

export const newsData: NewsItem[] = [
  
];
