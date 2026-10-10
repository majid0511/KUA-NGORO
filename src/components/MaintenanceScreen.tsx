// LAYAR MAINTENANCE: ditampilkan menggantikan seluruh situs publik ketika admin mengaktifkan "Mode Maintenance"
// di panel admin (menu Profil KUA). Berisi pesan "Web dalam Maintenance" dan tombol WhatsApp untuk keperluan mendesak.
import { Wrench } from "lucide-react";
import { profileData } from "../data/profile";

/**
 * Halaman pesan pemeliharaan situs (tidak memakai navbar/footer).
 */
export function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9] px-4">
      <div className="w-full max-w-md text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#0f5132]">
          <Wrench className="h-7 w-7" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-stone-900">
            Web dalam Maintenance
          </h1>

          <p className="text-sm leading-relaxed text-stone-600">
            Situs KUA Kecamatan Ngoro sedang dalam pemeliharaan.
            Mohon kembali lagi beberapa saat lagi. Untuk keperluan
            mendesak, silakan hubungi kantor secara langsung.
          </p>

          <a
            href={`https://wa.me/${profileData.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-emerald-600"
          >
            WhatsApp KUA Ngoro
          </a>

          <p className="text-xs text-stone-500">
            0851-3322-5303
          </p>
        </div>
      </div>
    </div>
  );
}
