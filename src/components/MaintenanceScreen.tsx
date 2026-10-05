import { Wrench } from "lucide-react";

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9] px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0f5132] flex items-center justify-center mx-auto">
          <Wrench className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-stone-900">
            Web dalam Maintenance
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Situs KUA Kecamatan Ngoro sedang dalam pemeliharaan. Mohon kembali
            lagi beberapa saat lagi. Untuk keperluan mendesak, silakan
            hubungi kantor secara langsung.
          </p>
        </div>
      </div>
    </div>
  );
}
