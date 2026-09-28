import { fetchCmsData, queryWithFallback } from './client';
import type { Staf, CmsResponse } from './types';
import { profileData } from '../../data/profile';

// Fallback mapper from local staff array
const fallbackStafList: Staf[] = profileData.staff.map((s, idx) => ({
  id: s.id,
  name: s.name,
  position: s.position,
  photo: s.photoUrl,
  bio: s.description,
  order: idx + 1,
  active: true,
}));

/**
  * Fetch active staff members from CMS with fallback, ordered by `order asc`
  */
export async function getStaf(): Promise<CmsResponse<Staf[]>> {
  const query = `*[_type == "staf" && active == true] | order(order asc) {
    "id": _id,
    name,
    position,
    "photo": photo.asset->url,
    bio,
    order,
    active
  }`;

  return queryWithFallback(
    () => fetchCmsData<Staf[]>(query),
    fallbackStafList
  );
}
