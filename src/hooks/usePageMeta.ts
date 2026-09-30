import { useEffect } from "react";

// Ganti dengan domain produksi (mis. https://kua-ngoro.vercel.app atau domain sendiri)
// setelah deploy, supaya og:url dan canonical menunjuk ke alamat yang benar.
export const SITE_URL = "https://kua-ngoro-ngoro.vercel.app";
const SITE_NAME = "KUA Kecamatan Ngoro";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

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
 * Mengatur <title>, meta description, Open Graph, canonical, dan robots
 * per halaman. Situs ini SPA (client-side render), jadi mesin pencari
 * perlu menjalankan JS untuk membaca ini — cukup untuk Google, tapi
 * bukan pengganti server-side rendering untuk crawler yang lebih ketat.
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
