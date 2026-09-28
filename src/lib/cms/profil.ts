import { supabase } from '../supabase';
import { queryWithFallback } from './client';
import type { Profil, CmsResponse } from './types';
import { profileData } from '../../data/profile';

// ── Fallback ──────────────────────────────────────────────────
const fallbackProfil: Profil = {
  office_name:  profileData.name,
  description:  profileData.aboutFull,
  history:      profileData.history,
  vision:       profileData.vision,
  mission:      profileData.missions,
  address:      profileData.address,
  phone:        profileData.phone,
  email:        profileData.email,
  office_hours: profileData.officeHours,
};

// ── Fetcher ───────────────────────────────────────────────────

/**
 * Returns the singleton profil row.
 * If no row exists in Supabase, returns null (not a fallback — EmptyState shown).
 */
export async function getProfil(): Promise<CmsResponse<Profil>> {
  return queryWithFallback(async () => {
    const { data, error } = await supabase!
      .from('profil')
      .select('office_name,description,history,vision,mission,address,phone,email,office_hours')
      .maybeSingle();

    if (error) throw new Error(error.message);
    // If no profil row exists, return the fallback shape so the page renders meaningfully.
    // This is the singleton case — treat missing row as "empty" data.
    return (data ?? null) as Profil;
  }, fallbackProfil);
}
