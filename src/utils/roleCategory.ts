export type RoleCategory = "Kepala" | "Penghulu" | "Penyuluh" | "Pelaksana" | "Staf";

/**
 * Menentukan kategori badge dari teks jabatan.
 * Aman untuk null/undefined dan tidak peka huruf besar/kecil.
 */
export function getRoleCategory(position?: string | null): RoleCategory {
  const p = (position ?? "").trim().toLowerCase();
  if (p.startsWith("kepala")) return "Kepala";
  if (p.includes("penghulu")) return "Penghulu";
  if (p.includes("penyuluh")) return "Penyuluh";
  if (p.includes("pengolah") || p.includes("penata") || p.includes("pelaksana")) return "Pelaksana";
  return "Staf";
}
