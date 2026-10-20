// KOMPONEN MODAL (jendela pop-up di tengah layar dengan latar gelap), dipakai mis. untuk detail layanan & foto kegiatan.
import React, { useEffect, useId, useRef } from "react";
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
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const activeElement = document.activeElement;
    returnFocusRef.current =
      activeElement instanceof HTMLElement && activeElement !== document.body
        ? activeElement
        : null;

    // Saat modal terbuka, kunci scroll halaman di belakangnya.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
        ),
      ).filter(
        (element) =>
          !element.matches(":disabled") &&
          element.getAttribute("aria-hidden") !== "true" &&
          element.tabIndex >= 0 &&
          element.getClientRects().length > 0 &&
          window.getComputedStyle(element).visibility !== "hidden",
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentFocus = document.activeElement;

      if (
        event.shiftKey &&
        (currentFocus === firstElement || !dialog.contains(currentFocus))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (currentFocus === lastElement || !dialog.contains(currentFocus))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const returnFocusElement = returnFocusRef.current;
      returnFocusRef.current = null;
      if (returnFocusElement?.isConnected) returnFocusElement.focus();
    };
  }, [isOpen]);

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title ? "Dialog" : undefined}
            tabIndex={-1}
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl overflow-hidden z-10 my-8`}
          >
            {/* Jika ada judul: tampilkan bilah judul + tombol X di dalamnya */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h3 id={titleId} className="text-lg font-bold text-stone-900">{title}</h3>
                <button
                  type="button"
                  ref={closeButtonRef}
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
                type="button"
                ref={closeButtonRef}
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
