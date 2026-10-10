import { Routes, Route, Navigate } from 'react-router-dom';
import AdminGuard from './AdminGuard';
import AdminLayout from './AdminLayout';
import AdminLogin from './Login';
import Dashboard from './Dashboard';
import BeritaAdmin from './BeritaAdmin';
import PengumumanAdmin from './PengumumanAdmin';
import LayananAdmin from './LayananAdmin';
import ProfilAdmin from './ProfilAdmin';
import StafAdmin from './StafAdmin';
import GaleriAdmin from './GaleriAdmin';

/**
 * Seluruh panel admin dan daftar alamatnya.
 * Dimuat terpisah (lazy-load) dari App.tsx supaya kode admin tidak ikut membebani halaman publik.
 * Dipasang di alamat "/admin/*", jadi semua path di bawah ini relatif terhadap /admin.
 *
 * Struktur:
 *  - /admin/login           : halaman masuk (bebas diakses)
 *  - semua halaman lainnya  : dibungkus AdminGuard (wajib login sebagai admin) lalu AdminLayout (sidebar & topbar)
 */
export default function AdminApp() {
  return (
    <Routes>
      {/* Halaman login: satu-satunya halaman admin yang boleh dibuka tanpa login */}
      <Route path="login" element={<AdminLogin />} />
      {/* Penjaga: pengunjung yang belum login / bukan admin dialihkan ke halaman login */}
      <Route element={<AdminGuard />}>
        {/* Kerangka tampilan admin (sidebar + topbar); isi halaman muncul di tempat <Outlet /> */}
        <Route element={<AdminLayout />}>
          {/* /admin -> Dashboard ringkasan */}
          <Route index element={<Dashboard />} />
          <Route path="berita" element={<BeritaAdmin />} />
          <Route path="pengumuman" element={<PengumumanAdmin />} />
          <Route path="layanan" element={<LayananAdmin />} />
          <Route path="profil" element={<ProfilAdmin />} />
          <Route path="staf" element={<StafAdmin />} />
          <Route path="galeri" element={<GaleriAdmin />} />
        </Route>
      </Route>
      {/* Alamat /admin/... lain yang tidak dikenal dialihkan ke Dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
