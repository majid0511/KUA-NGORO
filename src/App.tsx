import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileStickyBar } from "./components/layout/MobileStickyBar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Marriage from "./pages/Marriage";
import Information from "./pages/Information";
import Activities from "./pages/Activities";
import Contact from "./pages/Contact";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import { MaintenanceScreen } from "./components/MaintenanceScreen";
import { isMaintenanceMode } from "./lib/cms/profil";
import { initGA, useGaTracker } from "./lib/analyticsTracker";
import { Analytics } from "@vercel/analytics/react";

// Inisialisasi GA4 jika VITE_GA_MEASUREMENT_ID dikonfigurasi
initGA();

// Panel admin dimuat terpisah (tidak menambah bundle halaman publik)
const AdminApp = lazy(() => import("./pages/admin/AdminApp"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const [maintenance, setMaintenance] = useState<boolean | null>(null);

  // Track page view GA4 untuk rute publik
  useGaTracker();

  // Panel admin selalu bisa diakses, termasuk saat mode maintenance aktif,
  // supaya admin tetap bisa masuk dan mematikannya kembali.
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (isAdminRoute) return;
    let cancelled = false;
    isMaintenanceMode().then((on) => {
      if (!cancelled) setMaintenance(on);
    });
    return () => {
      cancelled = true;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#fbfbf9]" />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    );
  }

  // Sebelum status diketahui: tampilkan layar kosong sebentar, bukan
  // langsung situs, supaya tidak "berkedip" menampilkan isi lalu ditutup.
  if (maintenance === null) {
    return <div className="min-h-screen bg-[#fbfbf9]" />;
  }

  if (maintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans relative">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Main Indonesian routes */}
          <Route path="/profil" element={<Profile />} />
          <Route path="/layanan" element={<Services />} />
          <Route path="/layanan/pernikahan" element={<Marriage />} />
          <Route path="/informasi" element={<Information />} />
          <Route path="/kegiatan" element={<Activities />} />
          <Route path="/kontak" element={<Contact />} />

          {/* Detail berita */}
          <Route path="/news/:slug" element={<NewsDetail />} />

          {/* Alias lama -> URL utama (satu URL per halaman, baik untuk SEO) */}
          <Route path="/news" element={<Navigate to="/informasi" replace />} />
          <Route path="/pengumuman" element={<Navigate to="/informasi" replace />} />
          <Route path="/information" element={<Navigate to="/informasi" replace />} />
          <Route path="/profile" element={<Navigate to="/profil" replace />} />
          <Route path="/staff" element={<Navigate to="/profil" replace />} />
          <Route path="/services" element={<Navigate to="/layanan" replace />} />
          <Route path="/marriage" element={<Navigate to="/layanan/pernikahan" replace />} />
          <Route path="/activities" element={<Navigate to="/kegiatan" replace />} />
          <Route path="/gallery" element={<Navigate to="/kegiatan" replace />} />
          <Route path="/contact" element={<Navigate to="/kontak" replace />} />

          {/* Custom 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileStickyBar />
      <Analytics />
    </div>
  );
}
