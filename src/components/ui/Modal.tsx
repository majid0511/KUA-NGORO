// KOMPONEN MODAL (jendela pop-up di tengah layar dengan latar gelap), dipakai mis. untuk detail layanan & foto kegiatan.
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * isOpen = tampil/tidak, onClose = fungsi penutup, title = judul (opsional), maxWidth = lebar maksimum.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

/**
 * Menampilkan modal dengan animasi. Bisa ditutup dengan tombol X, klik latar gelap, atau tombol Esc.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    // Tekan tombol Esc -> tutup modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      // Saat modal terbuka, kunci scroll halaman di belakangnya
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      // Pembersihan: kembalikan scroll halaman & lepas pendengar keyboard saat modal ditutup
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Pemetaan nama lebar ke kelas CSS
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Latar gelap di belakang modal; mengkliknya menutup modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Panel putih modal (muncul dengan efek membesar halus) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl overflow-hidden z-10 my-8`}
          >
            {/* Jika ada judul: tampilkan bilah judul + tombol X di dalamnya */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h3 className="text-lg font-bold text-stone-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
                  aria-label="Tutup dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Jika tanpa judul: tombol X melayang di pojok kanan atas */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
