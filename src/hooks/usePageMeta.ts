import { useEffect } from "react";

// Alamat situs yang sebenarnya. WAJIB diganti dengan domain produksi (mis. https://kua-ngoro.vercel.app
// atau domain sendiri) setelah deploy, supaya og:url dan canonical menunjuk ke alamat yang benar.
export const SITE_URL = "https://kua-ngoro-ngoro.vercel.app";
// Nama situs, ditempelkan di belakang judul tab browser: "Judul Halaman | KUA Kecamatan Ngoro"
const SITE_NAME = "KUA Kecamatan Ngoro";

/**
 * Data yang diberikan tiap halaman:
 * - title       : judul halaman
 * - description : ringkasan (tampil di hasil pencarian Google & saat tautan dibagikan)
 * - path        : alamat halaman, mis. "/layanan"
 * - noindex     : true = minta mesin pencari TIDAK mengindeks halaman ini (dipakai di halaman 404)
 */
interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/**
 * Mengisi (atau membuat jika belum ada) satu tag <meta> di <head>, mis. description atau og:title.
 */
function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Mengisi (atau membuat jika belum ada) satu tag <link> di <head>, dipakai untuk alamat "canonical".
 */
function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Hook untuk mengatur info SEO tiap halaman: judul tab, deskripsi, Open Graph (pratinjau saat tautan
 * dibagikan ke WhatsApp/sosmed), canonical, dan aturan robots.
 * Dipanggil di bagian atas setiap halaman publik.
 *
 * Catatan: situs ini dirender di browser (SPA), jadi mesin pencari perlu menjalankan JavaScript untuk
 * membaca ini. Google bisa, tetapi crawler yang lebih ketat belum tentu.
 */
export function usePageMeta({ title, description, path, noindex }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${SITE_URL}${path}`, "property");

    setLink("canonical", `${SITE_URL}${path}`);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, path, noindex]);
}
