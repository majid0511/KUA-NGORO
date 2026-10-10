// Daftar kategori lencana pegawai yang tersedia
export type RoleCategory = "Kepala" | "Penghulu" | "Penyuluh" | "Pelaksana" | "Staf";

/**
 * Menentukan kategori lencana (badge) pegawai dari teks jabatannya, mis.:
 *   "Kepala KUA ..."           -> Kepala
 *   "Penghulu Ahli Pertama"    -> Penghulu
 *   "Penyuluh Agama Islam ..." -> Penyuluh
 *   "Pengolah Data ..."        -> Pelaksana
 *   jabatan lain / kosong      -> Staf
 * Aman untuk nilai kosong (null/undefined) dan tidak membedakan huruf besar/kecil.
 */
export function getRoleCategory(position?: string | null): RoleCategory {
  const p = (position ?? "").trim().toLowerCase();
  if (p.startsWith("kepala")) return "Kepala";
  if (p.includes("penghulu")) return "Penghulu";
  if (p.includes("penyuluh")) return "Penyuluh";
  if (p.includes("pengolah") || p.includes("penata") || p.includes("pelaksana")) return "Pelaksana";
  return "Staf";
}
