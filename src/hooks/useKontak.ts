import { useEffect, useState } from "react";
import { profileData } from "../data/profile";
import { getProfil } from "../lib/cms/profil";

// "0851-3322-5303" -> "6285133225303" (format wa.me)
export function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  return digits;
}

// Nomor telepon & WhatsApp dari profil di admin; sebelum termuat/gagal memakai data lokal.
export function useKontak() {
  const [phone, setPhone] = useState(profileData.phone);
  const [waNumber, setWaNumber] = useState(profileData.whatsapp);

  useEffect(() => {
    let cancelled = false;
    getProfil().then((res) => {
      const p = res.data?.phone;
      if (!cancelled && p) {
        setPhone(p);
        setWaNumber(toWaNumber(p));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { phone, waNumber };
}