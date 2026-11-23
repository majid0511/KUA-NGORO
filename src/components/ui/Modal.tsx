// KOMPONEN MODAL dengan elemen native HTML <dialog>
// Mengintegrasikan lifecycle React dengan dialog.showModal(), dialog.close(),
// pengembalian fokus otomatis, backdrop click, Escape key handling, dan penanganan scroll.
import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Simpan elemen pemicu aktif untuk pengembalian fokus saat ditutup
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement && activeElement !== document.body) {
        returnFocusRef.current = activeElement;
      }

      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Cegah crash jika sudah terbuka dalam transisi bersamaan
        }
      }

      // Kunci scroll halaman belakang
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Fokuskan tombol tutup saat dialog dibuka
      const focusTimer = window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);

      return () => {
        window.clearTimeout(focusTimer);
        document.body.style.overflow = prevOverflow;

        if (dialog.open) {
          dialog.close();
        }

        const trigger = returnFocusRef.current;
        returnFocusRef.current = null;
        if (trigger?.isConnected) {
          trigger.focus();
        }
      };
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Tangani event native 'cancel' (saat user menekan Escape)
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onCloseRef.current();
  };

  // Tutup jika mengklik area backdrop di luar bounding box dialog
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isClickInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isClickInside) {
      onCloseRef.current();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? "Dialog" : undefined}
      className={`fixed inset-0 m-auto w-[calc(100%-2rem)] ${maxWidthClasses[maxWidth]} rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-stone-900/60 backdrop:backdrop-blur-sm z-50 overflow-hidden border border-stone-200/60 focus:outline-none`}
    >
      <div className="relative w-full flex flex-col max-h-[85vh]">
        {/* Header Dialog */}
        {title ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
            <h3 id={titleId} className="text-lg font-bold text-stone-900">
              {title}
            </h3>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => onCloseRef.current()}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-label="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            ref={closeButtonRef}
            onClick={() => onCloseRef.current()}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Konten Dialog */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </dialog>
  );
};
