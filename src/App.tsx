import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
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

          {/* New News routes */}
          <Route path="/news" element={<Information />} />
          <Route path="/news/:slug" element={<NewsDetail />} />

          {/* Spec CMS alias routes */}
          <Route path="/pengumuman" element={<Information />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/marriage" element={<Marriage />} />
          <Route path="/information" element={<Information />} />
          <Route path="/staff" element={<Profile />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/gallery" element={<Activities />} />
          <Route path="/contact" element={<Contact />} />

          {/* Custom 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
