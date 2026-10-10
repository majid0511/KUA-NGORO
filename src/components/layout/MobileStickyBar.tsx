// BILAH AKSI CEPAT DI HP: empat tombol (WhatsApp, Telepon, Nikah, Lokasi) yang menempel di bagian bawah layar.
// Hanya tampil di layar kecil (HP); disembunyikan di layar lebar.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Phone, MapPin, HeartHandshake } from "lucide-react";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms/profil";

/**
 * Mengubah nomor telepon menjadi format tautan WhatsApp (hanya angka, awalan 0 -> 62). Sama dengan fungsi di Navbar.
 */
function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("628")) return digits;
  return digits;
}

/**
 * Komponen bilah bawah. Nomor telepon/WA diambil dari data lokal, lalu diperbarui dari profil di Supabase.
 */
export const MobileStickyBar: React.FC = () => {
  const [waNumber, setWaNumber] = useState(profileData.whatsapp);
  const [phone, setPhone] = useState(profileData.phone);

  useEffect(() => {
    // Ambil nomor terbaru dari profil di database. getProfil() mengembalikan pembungkus { data, fromFallback, error },
    // jadi profilnya ada di response.data (sama seperti di Navbar). Jika nomor kosong, tetap memakai nomor lokal.
    getProfil().then((response) => {
      const profil = response.data;
      if (profil?.phone) {
        setPhone(profil.phone);
        setWaNumber(toWaNumber(profil.phone));
      }
    });
  }, []);

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-2">
      <div className="grid grid-cols-4 gap-1 text-center">
        {/* 1. WhatsApp: chat langsung ke KUA */}
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition"
        >
          <MessageSquare className="w-5 h-5 text-[#0f5132]" />
          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
        </a>

        {/* 2. Telepon: langsung memanggil nomor kantor */}
        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 transition"
        >
          <Phone className="w-5 h-5 text-stone-700" />
          <span className="text-[10px] font-bold mt-0.5">Telepon</span>
        </a>

        {/* 3. Nikah: pintasan ke halaman layanan pernikahan */}
        <Link
          to="/layanan/pernikahan"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-amber-800 hover:bg-amber-50 active:bg-amber-100 transition"
        >
          <HeartHandshake className="w-5 h-5 text-amber-700" />
          <span className="text-[10px] font-bold mt-0.5">Nikah</span>
        </Link>

        {/* 4. Lokasi: membuka Google Maps kantor di tab baru */}
        <a
          href={profileData.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 transition"
        >
          <MapPin className="w-5 h-5 text-[#0f5132]" />
          <span className="text-[10px] font-bold mt-0.5">Lokasi</span>
        </a>
      </div>
    </div>
  );
};
