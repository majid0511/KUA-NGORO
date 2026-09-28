import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard, Newspaper, Bell, Landmark,
  User, Users, Image, LogOut, Menu, X,
} from 'lucide-react';

const NAV = [
  { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/berita',      icon: Newspaper,        label: 'Berita' },
  { to: '/admin/pengumuman',  icon: Bell,             label: 'Pengumuman' },
  { to: '/admin/layanan',     icon: Landmark,         label: 'Layanan' },
  { to: '/admin/profil',      icon: User,             label: 'Profil KUA' },
  { to: '/admin/staf',        icon: Users,            label: 'Staf' },
  { to: '/admin/galeri',      icon: Image,            label: 'Galeri' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase!.auth.signOut();
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-64 bg-[#0f5132] text-white">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Panel Admin</p>
        <h1 className="mt-0.5 text-base font-extrabold leading-tight">KUA Ngoro</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active =
            to === '/admin' ? pathname === '/admin' : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-100 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 font-sans">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-64 h-full z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-bold text-stone-700">
            {NAV.find((n) =>
              n.to === '/admin' ? pathname === '/admin' : pathname.startsWith(n.to),
            )?.label ?? 'Admin'}
          </span>
          <div className="ml-auto">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-[#0f5132] font-semibold hover:underline"
            >
              Lihat Website ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
