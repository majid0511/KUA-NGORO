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
 * Seluruh panel admin. Di-lazy-load dari App.tsx supaya kode admin
 * tidak ikut bundle halaman publik.
 * Dipasang di path "/admin/*", jadi semua path di bawah relatif terhadap /admin.
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="berita" element={<BeritaAdmin />} />
          <Route path="pengumuman" element={<PengumumanAdmin />} />
          <Route path="layanan" element={<LayananAdmin />} />
          <Route path="profil" element={<ProfilAdmin />} />
          <Route path="staf" element={<StafAdmin />} />
          <Route path="galeri" element={<GaleriAdmin />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
