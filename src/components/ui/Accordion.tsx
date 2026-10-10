// KOMPONEN AKORDEON: daftar judul yang bisa diklik untuk membuka/menutup isinya (dipakai untuk FAQ & persyaratan layanan).
// Hanya satu item yang terbuka dalam satu waktu.
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Properti satu item akordeon: id, judul, isi (children), status terbuka, dan fungsi yang dipanggil saat judul diklik.
 */
export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

/**
 * Satu baris akordeon: tombol judul (dengan panah yang berputar) + isi yang membuka/menutup dengan animasi.
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
}) => {
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white mb-3 transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 text-left font-semibold text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        // Memberi tahu pembaca layar (aksesibilitas) apakah bagian ini sedang terbuka
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg text-stone-900 font-medium">
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#0f5132] shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animasi tinggi saat isi muncul/hilang; initial={false} = tidak dianimasikan saat halaman pertama dimuat */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-stone-600 leading-relaxed text-sm sm:text-base border-t border-stone-100 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Properti akordeon: daftar item {id, judul, isi}. (allowMultiple belum dipakai.)
 */
export interface AccordionProps {
  items: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
  allowMultiple?: boolean;
}

/**
 * Akordeon lengkap. Item pertama terbuka secara bawaan; mengklik item yang sedang terbuka akan menutupnya.
 */
export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  // id item yang sedang terbuka (null = semua tertutup)
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  // Klik item: jika sudah terbuka -> tutup, jika belum -> buka (dan otomatis menutup yang lain)
  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
