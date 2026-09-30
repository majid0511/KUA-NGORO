import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Check } from "lucide-react";
import { getBeritaBySlug } from "../lib/cms/berita";
import type { Berita } from "../lib/cms/types";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/CmsState";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container-kua py-20">
        <LoadingState message="Memuat berita..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-kua py-20">
        <ErrorState message={error} />
      </div>
    );
  }

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
        {/* Back Link */}
        <Link
          to="/informasi"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0f5132] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Informasi</span>
        </Link>

        {/* Category & Metadata */}
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

        {/* Featured Image */}
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

        {/* Article Excerpt */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-stone-800 text-sm sm:text-base font-semibold leading-relaxed mb-6">
          {berita.excerpt}
        </div>

        {/* Article Content Body */}
        <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-4 text-base sm:text-lg">
          <p className="whitespace-pre-line">{berita.content}</p>
        </div>
      </div>
    </div>
  );
}
