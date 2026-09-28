import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-stone-200 p-8 sm:p-10 rounded-3xl shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0f5132] font-mono font-extrabold text-2xl flex items-center justify-center mx-auto">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Maaf, halaman yang Anda cari tidak ditemukan atau alamat URL telah dipindahkan.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/" leftIcon={<Home className="w-4 h-4" />}>
            Kembali ke Beranda
          </Button>

          <Button to="/layanan" variant="outline" leftIcon={<Search className="w-4 h-4" />}>
            Cari Layanan KUA
          </Button>
        </div>
      </div>
    </div>
  );
}
