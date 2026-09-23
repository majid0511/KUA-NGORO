import type { GalleryItem } from "../config/profile";
import EmptyState from "./EmptyState";

interface GalleryProps {
  items: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  if (items.length === 0) {
    return <EmptyState message="Galeri kegiatan resmi belum tersedia dan akan ditambahkan setelah foto terverifikasi diunggah." />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <figure key={item.id} className="rounded-xl overflow-hidden border border-[var(--color-line)]">
          <img src={item.imageUrl} alt={item.caption} className="w-full h-40 object-cover" loading="lazy" />
          <figcaption className="px-3 py-2 text-xs text-[var(--color-ink-soft)]">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
