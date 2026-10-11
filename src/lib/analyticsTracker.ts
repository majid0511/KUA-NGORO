import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ID pengukuran Google Analytics dari file .env (boleh kosong = fitur analytics mati)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// Memberitahu TypeScript bahwa objek window punya properti dataLayer & gtag (disuntikkan oleh skrip Google)
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Menyalakan Google Analytics 4 (statistik pengunjung).
 * Hanya aktif jika variabel VITE_GA_MEASUREMENT_ID diisi di file .env; jika kosong, tidak melakukan apa-apa.
 * Dipanggil sekali saat aplikasi dimulai (lihat App.tsx).
 */
export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Hindari duplikasi injection script
  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Fungsi standar Google: mengantre perintah ke dataLayer untuk diproses skrip GA.
  // PENTING: harus memakai objek "arguments", BUKAN array dari (...args). Skrip gtag.js hanya mengenali perintah
  // yang dikirim sebagai objek arguments; array biasa diabaikan diam-diam (tidak ada error, tapi tidak ada data terkirim).
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // Page view dikirim manual saat rute berubah
  });
}

/**
 * Hook yang mengirim catatan "halaman dilihat" ke Google Analytics setiap kali alamat URL berubah
 * (kecuali halaman /admin).
 * Perlu dikirim manual karena situs ini aplikasi satu halaman (SPA): browser tidak memuat ulang halaman
 * saat pindah menu, sehingga GA tidak mendeteksinya otomatis.
 */
export function useGaTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    // Kunjungan ke panel admin tidak dihitung, supaya statistik hanya berisi pengunjung publik
    if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) return;

    // Kirim event page_view setiap rute berubah
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}
