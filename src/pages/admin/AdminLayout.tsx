import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard, Newspaper, Bell, Landmark,
  User, Users, Image, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import kuaLogo from '../../assets/kualogo.png';

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

  const activeItem = NAV.find((n) =>
    n.to === '/admin' ? pathname === '/admin' : pathname.startsWith(n.to),
  );

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200 shrink-0">
        <img src={kuaLogo} alt="KUA Logo" className="w-10 h-10" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight truncate">KUA Ngoro</p>
          <p className="text-[11px] text-slate-400 font-medium">Panel admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = activeItem?.to === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-50 text-[#0f5132] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#0f5132]" />
              )}
              <Icon size={18} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-0.5 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ExternalLink size={16} />
          Lihat situs
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-64 h-full z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-sm text-slate-400">
            Admin <span className="mx-1.5 text-slate-300">/</span>
            <span className="font-semibold text-slate-700">{activeItem?.label ?? ''}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
