import type { CmsResponse } from './types';

// CMS Configuration environment variables
export const CMS_CONFIG = {
  projectId: import.meta.env.VITE_CMS_PROJECT_ID || '',
  dataset: import.meta.env.VITE_CMS_DATASET || 'production',
  apiUrl: import.meta.env.VITE_CMS_API_URL || '',
  apiVersion: '2023-08-01',
  token: import.meta.env.VITE_CMS_TOKEN || '',
};

/**
  * Check if Headless CMS credentials are configured in .env
  */
export function isCmsConfigured(): boolean {
  return Boolean(CMS_CONFIG.projectId || CMS_CONFIG.apiUrl);
}

/**
  * Centralized fetcher to fetch data from Headless CMS (Sanity / REST API)
  */
export async function fetchCmsData<T>(groqQuery: string, params?: Record<string, string>): Promise<T | null> {
  if (!isCmsConfigured()) {
    return null;
  }

  try {
    // Sanity GROQ API Endpoint
    if (CMS_CONFIG.projectId) {
      let url = `https://${CMS_CONFIG.projectId}.api.sanity.io/v${CMS_CONFIG.apiVersion}/data/query/${CMS_CONFIG.dataset}?query=${encodeURIComponent(groqQuery)}`;

      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          url += `&$${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(val))}`;
        });
      }

      const res = await fetch(url, {
        headers: CMS_CONFIG.token ? { Authorization: `Bearer ${CMS_CONFIG.token}` } : {},
      });

      if (!res.ok) {
        console.warn(`[CMS Warning] HTTP ${res.status}: Failed to fetch from Sanity API`);
        return null;
      }

      const json = await res.json();
      return json.result as T;
    }

    // Generic REST API Endpoint
    if (CMS_CONFIG.apiUrl) {
      const res = await fetch(`${CMS_CONFIG.apiUrl}?query=${encodeURIComponent(groqQuery)}`);
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data || json) as T;
    }

    return null;
  } catch (error) {
    console.warn('[CMS Warning] Network or API failure, switching to local fallback:', error);
    return null;
  }
}

/**
  * Wrapper to execute CMS query with fallback to local static data
  */
export async function queryWithFallback<T>(
  cmsFetcher: () => Promise<T | null>,
  fallbackData: T
): Promise<CmsResponse<T>> {
  try {
    const cmsData = await cmsFetcher();
    if (cmsData !== null && cmsData !== undefined && (Array.isArray(cmsData) ? cmsData.length > 0 : true)) {
      return {
        data: cmsData,
        fromFallback: false,
        error: null,
      };
    }
  } catch (err) {
    console.warn('[CMS Error] Fetch failed, using fallback data:', err);
  }

  return {
    data: fallbackData,
    fromFallback: true,
    error: isCmsConfigured() ? 'Gagal terhubung ke CMS, menampilkan data lokal.' : null,
  };
}
