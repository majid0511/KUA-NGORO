import type { OrgNode } from "../config/profile";
import EmptyState from "./EmptyState";

interface OrganizationChartProps {
  root: OrgNode | null;
}

function NodeCard({ node }: { node: OrgNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[var(--color-forest)] text-[var(--color-paper)] rounded-lg px-4 py-2.5 text-center min-w-[9rem]">
        <p className="text-sm font-semibold">{node.title}</p>
        {node.name && <p className="text-xs text-[var(--color-paper)]/75">{node.name}</p>}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-6 flex gap-6 border-t border-[var(--color-line)] pt-6">
          {node.children.map((child) => (
            <NodeCard key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationChart({ root }: OrganizationChartProps) {
  if (!root) {
    return <EmptyState message="Struktur organisasi resmi belum tersedia dan akan ditambahkan setelah terverifikasi." />;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-center min-w-max px-2">
        <NodeCard node={root} />
      </div>
    </div>
  );
}
