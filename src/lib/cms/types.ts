// Interfaces for the 6 Headless CMS Content Models

export interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  author: string;
  published_at: string;
  status: 'draft' | 'published';
}

export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  published_at: string;
  expires_at?: string;
  priority: 'normal' | 'important';
  status: 'draft' | 'published';
}

export interface Layanan {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  procedure: string[];
  estimated_time?: string;
  icon: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface Profil {
  office_name: string;
  description: string;
  history: string;
  vision: string;
  mission: string[];
  address: string;
  phone: string;
  email: string;
  office_hours: {
    workDays: string;
    fridayHours: string;
    weekend: string;
  };
  maintenance_mode: boolean;
}

export interface Staf {
  id: string;
  name: string;
  position: string;
  photo?: string;
  bio?: string;
  order: number;
  active: boolean;
}

export interface Galeri {
  id: string;
  title: string;
  image: string;
  description: string;
  category: 'Kegiatan' | 'Pelayanan' | 'Acara' | 'Lainnya' | string;
  published_at: string;
}

export interface CmsResponse<T> {
  data: T | null;
  fromFallback: boolean;
  error: string | null;
}
