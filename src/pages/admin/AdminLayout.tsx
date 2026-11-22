// KERANGKA TAMPILAN PANEL ADMIN: sidebar menu di kiri, bilah atas (breadcrumb) di atas, dan area isi halaman di tengah.
// Di HP, sidebar menjadi menu geser yang dibuka lewat tombol hamburger.
import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  Landmark,
  User,
  Users,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ToastContainer } from './ToastContainer';
import kuaLogo from '../../assets/kualogo.png';
import { AdminInternshipNote } from '../../components/layout/InternshipCredit';
import {
  AdminShell,
  AdminSidebar,
  AdminSidebarAction,
  type AdminNavItem,
} from './AdminShared';

// Daftar menu sidebar: key = alamat (to), ikon, dan label.
// Untuk menambah halaman admin baru, tambahkan di sini dan di AdminApp.tsx.
const NAV: AdminNavItem[] = [
  { key: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { key: '/admin/berita',     icon: Newspaper,       label: 'Berita' },
  { key: '/admin/pengumuman', icon: Bell,            label: 'Pengumuman' },
  { key: '/admin/layanan',    icon: Landmark,        label: 'Layanan' },
  { key: '/admin/profil',     icon: User,            label: 'Profil KUA' },
  { key: '/admin/staf',       icon: Users,           label: 'Staf' },
  { key: '/admin/galeri',     icon: ImageIcon,       label: 'Galeri' },
];

/**
 * Kerangka admin. Isi halaman aktif ditampilkan oleh <Outlet /> di bagian tengah.
 */
export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Apakah menu geser (mobile) sedang terbuka
  const [open, setOpen] = useState(false);

  // Keluar dari panel admin. Setelah sesi berakhir, AdminGuard otomatis mengalihkan ke halaman login.
  async function handleLogout() {
    await supabase!.auth.signOut();
  }

  // Menu yang sedang aktif menurut alamat saat ini ("/admin" harus persis sama agar Dashboard tidak aktif di semua halaman)
  const activeItem = NAV.find((n) =>
    n.key === '/admin' ? pathname === '/admin' : pathname.startsWith(n.key),
  );

  /**
   * Sidebar: logo, daftar menu, serta tautan "Lihat situs" dan tombol "Keluar".
   * Dipakai di versi desktop (docked) dan mobile (floating).
   * Ini fungsi biasa (bukan komponen) supaya status collapse tidak ter-reset setiap render.
   */
  const renderSidebar = (variant: 'docked' | 'floating') => (
    <AdminSidebar
      variant={variant}
      items={NAV}
      activeKey={activeItem?.key ?? ''}
      onSelect={(to) => {
        setOpen(false);
        navigate(to);
      }}
      logo={<img src={kuaLogo} alt="KUA Logo" className="h-full w-full object-contain" />}
      brand={{ title: 'KUA Ngoro', subtitle: 'Panel admin' }}
      footer={(collapsed) => (
        <>
          <AdminSidebarAction
            href="/"
            icon={ExternalLink}
            label="Lihat situs"
            collapsed={collapsed}
          />
          <AdminSidebarAction
            onClick={handleLogout}
            icon={LogOut}
            label="Keluar"
            collapsed={collapsed}
            tone="danger"
          />
          {!collapsed && (
            <AdminInternshipNote className="px-3 py-2 text-white/60" />
          )}
        </>
      )}
    />
  );

  return (
    <>
      {/* Tempat notifikasi (toast) muncul di pojok kanan atas, berlaku untuk semua halaman admin */}
      <ToastContainer />

      <AdminShell
        sidebar={renderSidebar('docked')}
        topbar={
          // Bilah atas: tombol hamburger (HP) dan penunjuk lokasi "Admin / Halaman"
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-4 lg:px-8">
            <button
              type="button"
              className="-ml-2 rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-800 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="text-sm text-slate-400">
              Admin <span className="mx-1.5 text-slate-300">/</span>
              <span className="font-semibold text-slate-700">
                {activeItem?.label ?? ''}
              </span>
            </div>
          </header>
        }
      >
        <Outlet />
      </AdminShell>

      {/* Sidebar geser untuk HP (muncul di atas latar gelap saat open = true) */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 h-full">{renderSidebar('floating')}</div>
        </div>
      )}
    </>
  );
}