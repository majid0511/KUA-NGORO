// HALAMAN DETAIL BERITA (alamat: /news/<slug>): menampilkan satu berita secara lengkap.
// "slug" adalah potongan alamat yang mengidentifikasi berita, mis. /news/pendaftaran-nikah-online.
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Check } from "lucide-react";
import { getBeritaBySlug } from "../lib/cms/berita";
import type { Berita } from "../lib/cms/types";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/CmsState";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * Halaman detail berita. Menampilkan: loading -> error -> "tidak ditemukan" -> isi berita lengkap.
 */
export default function NewsDetail() {
  // Ambil slug dari alamat URL
  const { slug } = useParams<{ slug: string }>();
  // Berita yang sedang dibuka (null = belum ada / tidak ditemukan)
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // True sesaat setelah tombol "Bagikan" ditekan (untuk menampilkan "Link Tersalin!")
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Muat berita berdasarkan slug; dijalankan ulang jika slug berubah
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const res = await getBeritaBySlug(slug);
      if (res.error) setError(res.error);
      setBerita(res.data);
      setLoading(false);
    }
    loadData();
  }, [slug]);

  usePageMeta({
    title: berita?.title ?? "Berita & Pengumuman",
    description: berita?.excerpt ?? "Berita dan pengumuman resmi KUA Kecamatan Ngoro.",
    path: `/news/${slug ?? ""}`,
  });

  // Salin alamat halaman ke clipboard, lalu tampilkan "Link Tersalin!" selama 2 detik
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Tahap 1: sedang memuat -> tampilkan indikator loading
  if (loading) {
    return (
      <div className="container-kua py-20">
        <LoadingState message="Memuat berita..." />
      </div>
    );
  }

  // Tahap 2: terjadi kesalahan -> tampilkan pesan error
  if (error) {
    return (
      <div className="container-kua py-20">
        <ErrorState message={error} />
      </div>
    );
  }

  // Tahap 3: berita tidak ditemukan -> pesan + tombol kembali ke Pusat Informasi
  if (!berita) {
    return (
      <div className="container-kua py-20 space-y-6 text-center">
        <EmptyState message="Berita tidak ditemukan." submessage="Berita yang Anda cari tidak tersedia atau telah dihapus." />
        <Button to="/informasi" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Kembali ke Pusat Informasi
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-10">
      <div className="container-kua max-w-4xl">
        {/* Tautan kembali ke daftar informasi */}
        <Link
          to="/informasi"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0f5132] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Informasi</span>
        </Link>

        {/* Kategori, judul, tanggal, penulis, dan tombol bagikan */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f5132] text-white text-xs font-bold uppercase tracking-wider">
            {berita.category}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {berita.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 border-y border-stone-200 py-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#0f5132]" />
                {berita.published_at}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-[#0f5132]" />
                {berita.author}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Tersalin!" : "Bagikan Berita"}</span>
            </button>
          </div>
        </div>

        {/* Gambar utama berita (hanya tampil jika ada) */}
        {berita.featured_image && (
          <div className="my-8 rounded-3xl overflow-hidden aspect-[16/9] shadow-md border border-stone-200 bg-stone-100">
            <img
              src={berita.featured_image}
              alt={berita.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Ringkasan berita (kotak hijau muda) */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-stone-800 text-sm sm:text-base font-semibold leading-relaxed mb-6">
          {berita.excerpt}
        </div>

        {/* Isi lengkap berita; whitespace-pre-line menjaga baris baru yang diketik admin */}
        <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-4 text-base sm:text-lg">
          <p className="whitespace-pre-line">{berita.content}</p>
        </div>
      </div>
    </div>
  );
}
