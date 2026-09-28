import React, { useEffect } from "react";
import { X, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLinks } from "./NavLinks";
import { Button } from "../ui/Button";
import { profileData } from "../../data/profile";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
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

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-emerald-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white text-base">
                    KUA
                  </div>
                  <div>
                    <span className="font-bold text-sm block leading-tight">
                      KUA Ngoro
                    </span>
                    <span className="text-[11px] text-emerald-200 block">
                      Kabupaten Jombang
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition"
                  aria-label="Tutup menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                <NavLinks vertical onItemClick={onClose} />
              </div>
            </div>

            {/* Quick Contact & Action CTA */}
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Akses Cepat KUA
              </div>

              <a
                href={`https://wa.me/${profileData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-[#0f5132] font-semibold text-sm hover:bg-emerald-100 transition"
              >
                <MessageSquare className="w-5 h-5 shrink-0 text-emerald-700" />
                <span>Konsultasi WhatsApp</span>
              </a>

              <a
                href={`tel:${profileData.phone}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl bg-stone-100 text-stone-800 font-semibold text-sm hover:bg-stone-200 transition"
              >
                <Phone className="w-5 h-5 shrink-0 text-stone-600" />
                <span>Telepon: {profileData.phone}</span>
              </a>

              <div className="pt-2">
                <Button to="/kontak" onClick={onClose} className="w-full justify-center">
                  Hubungi KUA
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
