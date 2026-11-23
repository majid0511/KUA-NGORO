/**
 * PARSER & PENGELOLA CATATAN RILIS PUBLIK (update.md)
 *
 * Membaca berkas root `update.md` via import raw Vite (?raw).
 * Memfilter rilis dengan `status: released` dan `visibility: public`,
 * mengelompokkan entri ke dalam kategori standar (NEW, IMPROVED, FIXED, CONTENT),
 * serta mengurutkan rilis dari yang terbaru ke terlama.
 */
import rawChangelog from "../../update.md?raw";

export type ChangelogCategory = "NEW" | "IMPROVED" | "FIXED" | "CONTENT";

export interface ChangelogEntry {
  category: ChangelogCategory;
  text: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  status: "draft" | "released";
  visibility: "public" | "internal";
  introduction: string;
  summary: string;
  entries: ChangelogEntry[];
}

const STORAGE_KEY = "kua-ngoro:seen-update-version";

/**
 * Parsing teks Markdown dari update.md menjadi daftar ReleaseNote terstruktur.
 */
export function parseChangelog(content: string): ReleaseNote[] {
  const releases: ReleaseNote[] = [];
  if (!content || typeof content !== "string") return releases;

  // Pisahkan tiap blok rilis berdasarkan heading "## [vX.Y.Z]"
  const blocks = content.split(/\n(?=##\s+\[)/g);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed.startsWith("##")) continue;

    // Ambil header versi & tanggal: ## [v2.0.0] - 2026-11-24
    const headerMatch = trimmed.match(/^##\s+\[([^\]]+)\]\s*-\s*([^\n\r]+)/m);
    if (!headerMatch) continue;

    const version = headerMatch[1].trim();
    const date = headerMatch[2].trim();

    // Ekstrak metadata status & visibility
    const statusMatch = trimmed.match(/^-\s*status:\s*(\w+)/im);
    const visibilityMatch = trimmed.match(/^-\s*visibility:\s*(\w+)/im);

    const status = (statusMatch?.[1]?.toLowerCase() === "draft" ? "draft" : "released") as "draft" | "released";
    const visibility = (visibilityMatch?.[1]?.toLowerCase() === "internal" ? "internal" : "public") as "public" | "internal";

    // Ekstrak Introduction & Summary
    const introMatch = trimmed.match(/###\s+Introduction\s*\n([\s\S]*?)(?=\n###|\n---|$)/i);
    const summaryMatch = trimmed.match(/###\s+Summary\s*\n([\s\S]*?)(?=\n###|\n---|$)/i);

    const introduction = introMatch ? introMatch[1].trim() : "";
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    // Ekstrak entri kategori NEW, IMPROVED, FIXED, CONTENT
    const entries: ChangelogEntry[] = [];
    const categoryMatches = trimmed.matchAll(/###\s+(NEW|IMPROVED|FIXED|CONTENT)\s*\n([\s\S]*?)(?=\n###|\n---|$)/gi);

    for (const match of categoryMatches) {
      const category = match[1].toUpperCase() as ChangelogCategory;
      const body = match[2];
      const lines = body.split("\n");

      for (const line of lines) {
        const itemMatch = line.trim().match(/^[-*]\s+(.*)$/);
        if (itemMatch && itemMatch[1].trim()) {
          entries.push({
            category,
            text: itemMatch[1].trim(),
          });
        }
      }
    }

    releases.push({
      version,
      date,
      status,
      visibility,
      introduction,
      summary,
      entries,
    });
  }

  return releases;
}

/**
 * Mengambil daftar rilis publik yang sudah berstatus 'released'.
 * Diurutkan terbaru ke terlama.
 */
export function getPublicReleases(): ReleaseNote[] {
  try {
    const all = parseChangelog(rawChangelog);
    return all.filter((r) => r.status === "released" && r.visibility === "public");
  } catch {
    return [];
  }
}

/**
 * Mengambil rilis publik terbaru.
 */
export function getLatestPublicRelease(): ReleaseNote | null {
  const list = getPublicReleases();
  return list.length > 0 ? list[0] : null;
}

/**
 * Mengecek apakah ada pengumuman rilis baru yang belum pernah ditutup oleh pengunjung.
 */
export function shouldShowReleaseAnnouncement(): ReleaseNote | null {
  const latest = getLatestPublicRelease();
  if (!latest) return null;

  try {
    const dismissedVersion = localStorage.getItem(STORAGE_KEY);
    if (dismissedVersion === latest.version) {
      return null;
    }
    return latest;
  } catch {
    // Jika localStorage diblokir / gagal, jangan error
    return null;
  }
}

/**
 * Menandai rilis tertentu sebagai sudah dilihat / ditutup permanen.
 */
export function markReleaseAsDismissed(version: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, version);
  } catch {
    // Kegagalan localStorage tidak boleh merusak situs
  }
}
