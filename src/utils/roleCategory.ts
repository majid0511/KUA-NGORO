export type RoleCategory = "Kepala" | "Penghulu" | "Staf";

/**
 * Menentukan kategori badge dari teks jabatan.
 * Aman untuk null/undefined dan tidak peka huruf besar/kecil.
 */
export function getRoleCategory(position?: string | null): RoleCategory {
  const p = (position ?? "").trim().toLowerCase();
  if (p.startsWith("kepala")) return "Kepala";
  if (p.includes("penghulu")) return "Penghulu";
  return "Staf";
}
