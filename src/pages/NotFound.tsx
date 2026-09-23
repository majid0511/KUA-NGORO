import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-6xl font-semibold text-[var(--color-forest)]">404</p>
      <p className="mt-3 text-lg text-[var(--color-ink)]">Halaman tidak ditemukan.</p>
      <p className="mt-1 text-[var(--color-ink-soft)]">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 bg-[var(--color-forest)] text-[var(--color-paper)] px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[var(--color-forest-2)]"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
