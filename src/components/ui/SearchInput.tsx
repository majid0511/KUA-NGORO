// KOMPONEN KOTAK PENCARIAN: input teks dengan ikon kaca pembesar dan tombol X untuk menghapus isinya.
import React from "react";
import { Search, X } from "lucide-react";

/**
 * value = teks saat ini, onChange = dipanggil tiap kali teks berubah, placeholder = teks petunjuk.
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Kotak pencarian "terkontrol": isinya disimpan oleh halaman pemakai (lewat value/onChange), bukan di komponen ini.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Cari informasi atau pengumuman...",
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0f5132] focus:border-transparent transition"
      />
      {/* Tombol X hanya muncul jika sudah ada teks yang diketik */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          aria-label="Bersihkan pencarian"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
