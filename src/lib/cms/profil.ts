import { fetchCmsData, queryWithFallback } from './client';
import type { Profil, CmsResponse } from './types';
import { profileData } from '../../data/profile';

// Fallback mapper from local profileData
const fallbackProfil: Profil = {
  office_name: profileData.name,
  description: profileData.aboutFull,
  history: profileData.history,
  vision: profileData.vision,
  mission: profileData.missions,
  address: profileData.address,
  phone: profileData.phone,
  email: profileData.email,
  office_hours: profileData.officeHours,
};

/**
  * Fetch single Profil document from CMS with fallback
  */
export async function getProfil(): Promise<CmsResponse<Profil>> {
  const query = `*[_type == "profil"][0] {
    office_name,
    description,
    history,
    vision,
    mission,
    address,
    phone,
    email,
    office_hours
  }`;

  return queryWithFallback(
    async () => (await fetchCmsData<Profil | null>(query)) ?? fallbackProfil,
    fallbackProfil
  );
}
