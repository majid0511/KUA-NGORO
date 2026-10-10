import { useState, useEffect } from "react";

/**
 * Hook yang mengembalikan seberapa jauh halaman sudah di-scroll ke bawah (dalam piksel).
 * Dipakai Navbar untuk mengubah tampilan (mis. menjadi lebih solid) setelah pengunjung menggulir halaman.
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Dipanggil setiap kali halaman di-scroll: simpan posisi vertikal terbaru
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    // "passive: true" memberi tahu browser bahwa kita tidak menahan scroll, sehingga scroll tetap mulus
    window.addEventListener("scroll", updatePosition, { passive: true });
    updatePosition();

    // Pembersihan: lepas pendengar scroll saat komponen ditutup agar tidak bocor memori
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}
