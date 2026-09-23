import { MapPinned } from "lucide-react";
import type { Village } from "../config/profile";
import EmptyState from "./EmptyState";

interface ServiceAreaProps {
  villages: Village[];
}

export default function ServiceArea({ villages }: ServiceAreaProps) {
  if (villages.length === 0) {
    return <EmptyState message="Data wilayah kerja (desa/kelurahan) belum tersedia dan akan ditambahkan setelah terverifikasi." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {villages.map((village) => (
        <div
          key={village.id}
          className="flex items-center gap-2 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg px-3 py-3"
        >
          <MapPinned size={16} className="text-[var(--color-forest)] shrink-0" />
          <span className="text-sm text-[var(--color-ink)]">{village.name}</span>
        </div>
      ))}
    </div>
  );
}
