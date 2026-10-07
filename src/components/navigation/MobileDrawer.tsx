import React, { useEffect, useState } from "react";
import { X, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLinks } from "./NavLinks";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms/profil";
import kualogo from "../../assets/kualogo.png";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("08")) {
    return "62" + digits.slice(1);
  }

  if (digits.startsWith("628")) {
    return digits;
  }

  return digits;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [phone, setPhone] = useState(profileData.phone);
  const [waNumber, setWaNumber] = useState(
    toWaNumber(profileData.whatsapp || profileData.phone)
  );

  // Ambil data profil terbaru dari CMS
  useEffect(() => {
  getProfil().then((response) => {
    const profil = response.data;

    if (profil?.phone) {
      setPhone(profil.phone);
      setWaNumber(toWaNumber(profil.phone));
    }
  });
}, []);

  // Kunci scroll halaman ketika drawer terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Mobile Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-y-0 right-0 z-10 flex w-full max-w-xs flex-col justify-between overflow-y-auto bg-white shadow-2xl sm:max-w-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 bg-emerald-950 p-5 text-white">
                <div className="flex items-center gap-3">
                  {/* Logo KUA */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img
                      src={kualogo}
                      alt="Logo KUA Kecamatan Ngoro"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  {/* Nama */}
                  <div>
                    <span className="block text-sm font-bold leading-tight">
                      KUA Ngoro
                    </span>

                    <span className="block text-[11px] text-emerald-200">
                      Kabupaten Jombang
                    </span>
                  </div>
                </div>

                {/* Tombol Close */}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-emerald-200 transition hover:bg-emerald-900 hover:text-white"
                  aria-label="Tutup menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <div className="p-4">
                <NavLinks
                  vertical
                  onItemClick={onClose}
                />
              </div>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3 border-t border-stone-200 bg-stone-50 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                Akses Cepat KUA
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-[#0f5132] transition hover:bg-emerald-100"
              >
                <MessageSquare className="h-5 w-5 shrink-0 text-emerald-700" />

                <span>Konsultasi WhatsApp</span>
              </a>

              {/* Telepon */}
              <a
                href={`tel:${phone}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-stone-100 p-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-200"
              >
                <Phone className="h-5 w-5 shrink-0 text-stone-600" />

                <span>Telepon: {phone}</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};