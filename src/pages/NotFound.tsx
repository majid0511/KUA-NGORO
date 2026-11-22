
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * Halaman 404 untuk menangani URL yang tidak ditemukan.
 * Menyediakan navigasi kembali ke beranda dan halaman layanan KUA.
 */
export default function NotFound() {
  usePageMeta({
    title: "Halaman Tidak Ditemukan",
    description:
      "Halaman yang Anda cari tidak tersedia di situs resmi KUA Kecamatan Ngoro.",
    path: "/404",
    noindex: true,
  });

  return (
    <main className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-stone-50 px-4 py-12 sm:min-h-[75vh] sm:px-6 sm:py-20">

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl sm:h-96 sm:w-96"
      />

      {/* Main card */}
      <section className="relative w-full max-w-3xl rounded-[1.75rem] border border-emerald-100/80 bg-white/95 px-5 pb-7 pt-6 shadow-[0_24px_80px_-30px_rgba(15,81,50,0.18)] backdrop-blur-sm sm:rounded-[2rem] sm:px-12 sm:pb-12 sm:pt-10">

        {/* 404 Illustration */}
        <div
          aria-hidden="true"
          className="relative mx-auto mb-6 flex h-36 w-full max-w-sm items-center justify-center sm:mb-7 sm:h-52"
        >
          {/* Soft glow */}
          <div className="absolute inset-x-10 bottom-2 h-8 rounded-full bg-emerald-100/70 blur-xl sm:bottom-3 sm:h-10" />

          {/* Browser window */}
          <div className="relative w-56 -rotate-3 rounded-xl border border-stone-200 bg-white shadow-xl sm:w-72 sm:rounded-2xl">
            {/* Browser header */}
            <div className="flex h-8 items-center gap-1.5 rounded-t-xl bg-[#124C38] px-3 sm:h-10 sm:rounded-t-2xl sm:px-4">
              <span className="h-2 w-2 rounded-full bg-rose-400 sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-amber-300 sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5" />
            </div>

            {/* Browser content */}
            <div className="px-6 py-3.5 sm:px-7 sm:py-5">
              <span className="block text-center font-mono text-5xl font-black tracking-tight text-[#124C38] sm:text-7xl">
                404
              </span>

              <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                <div className="h-2 w-full rounded-full bg-stone-200 sm:h-2.5" />
                <div className="h-2 w-3/4 rounded-full bg-stone-100 sm:h-2.5" />
              </div>
            </div>
          </div>

          {/* Floating search illustration */}
          <div className="absolute right-3 top-3 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border-4 border-[#124C38] bg-white text-[#124C38] shadow-lg sm:right-8 sm:top-3 sm:h-24 sm:w-24 sm:border-[6px]">
            <Search className="h-8 w-8 sm:h-12 sm:w-12" strokeWidth={2.5} />
          </div>

          {/* Decorative leaves */}
          <div className="absolute bottom-3 left-4 h-10 w-5 -rotate-45 rounded-full bg-emerald-200/80 sm:bottom-4 sm:h-12 sm:w-6" />

          <div className="absolute bottom-5 left-9 h-8 w-4 rotate-12 rounded-full bg-emerald-300/60 sm:bottom-7 sm:left-10 sm:h-9 sm:w-5" />

          <div className="absolute right-7 top-0 h-6 w-3 rotate-12 rounded-full bg-emerald-300/70 sm:right-8 sm:h-8 sm:w-4" />
        </div>

        {/* Content */}
        <div className="mx-auto max-w-xl space-y-3 text-center sm:space-y-4">

          {/* Status label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />

            <span className="text-[11px] font-semibold tracking-wide text-emerald-800 sm:text-xs">
              ERROR 404
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Halaman Tidak Ditemukan
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-md text-sm leading-6 text-stone-500 sm:text-base sm:leading-7">
            Maaf, halaman yang Anda cari tidak ditemukan atau alamat URL
            mungkin telah dipindahkan. Silakan kembali atau jelajahi layanan
            kami.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">

          <Button
            to="/"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Kembali ke Beranda
          </Button>

          <Button
            to="/layanan"
            variant="outline"
            leftIcon={<Search className="h-4 w-4" />}
          >
            Cari Layanan KUA
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-7 border-t border-stone-100 pt-4 text-center sm:mt-9 sm:pt-5">
          <p className="text-[11px] leading-relaxed text-stone-400 sm:text-xs">
            KUA Kecamatan Ngoro
            <span className="mx-2 text-emerald-300">•</span>
            Pelayanan Publik dan Informasi Keagamaan
          </p>
        </div>
      </section>
    </main>
  );
}
