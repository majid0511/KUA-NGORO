// KOMPONEN BERSAMA PANEL ADMIN (REDESIGN: emerald glass)
// Menyediakan komponen UI dan helper yang digunakan oleh seluruh halaman admin.
// API (nama export & props) kompatibel dengan versi sebelumnya.
// Tambahan baru: AdminShell, AdminSidebar, dan AdminSidebarAction.
// Semua komponen punya animasi (motion/react) yang menghormati preferensi reduced motion.

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Inbox,
  AlertCircle,
  Trash2,
  Pencil,
  Plus,
  ArrowLeft,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { showToast } from "./toast";

// ============================================================
// 1. HELPER OPERASI SUPABASE
// ============================================================

/**
 * Menjalankan operasi tulis Supabase dan menangani error.
 * Mengembalikan true jika berhasil dan false jika gagal.
 */
export async function run(
  op: PromiseLike<{ error: { message: string } | null }>,
  successMessage?: string,
): Promise<boolean> {
  try {
    const { error } = await op;

    if (error) {
      showToast("error", `Gagal menyimpan perubahan: ${error.message}`);
      return false;
    }

    if (successMessage) {
      showToast("success", successMessage);
    }

    return true;
  } catch (error: unknown) {
    // Menangani Promise rejection atau error jaringan.
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui.";

    showToast("error", `Gagal menyimpan perubahan: ${message}`);
    return false;
  }
}

// ============================================================
// 2. ANIMASI BERSAMA
// ============================================================

/**
 * Animasi masuk sederhana yang menghormati preferensi reduced motion.
 */
const useAdminMotion = () => {
  const shouldReduceMotion = useReducedMotion();

  return {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.35,
      ease: "easeOut" as const,
    },
  };
};

/** Kurva easing halus yang dipakai bersama oleh semua animasi. */
const EASE = [0.22, 1, 0.36, 1] as const;

// ============================================================
// 3. SHELL & SIDEBAR (BARU)
// ============================================================

export interface AdminNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface AdminSidebarProps {
  items: AdminNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  /** Isi logo (mis. <img />); default ikon daun. */
  logo?: React.ReactNode;
  /** Judul & subjudul di samping logo (hanya tampil saat expanded). */
  brand?: { title: string; subtitle?: string };
  /** Isi bagian bawah sidebar. Menerima status collapsed. */
  footer?: (collapsed: boolean) => React.ReactNode;
  /**
   * "docked": menempel ke panel konten (desktop), bisa collapse, tab aktif menyatu dengan panel.
   * "floating": kartu mandiri tanpa collapse (untuk menu geser di HP).
   */
  variant?: "docked" | "floating";
  defaultCollapsed?: boolean;
}

/**
 * Sidebar kaca berwarna emerald dengan dua mode (docked):
 * - expanded: ikon + label, item aktif berupa "tab" putih yang menyatu
 *   dengan panel konten di sebelah kanannya.
 * - collapsed: hanya ikon bulat.
 */
export function AdminSidebar({
  items,
  activeKey,
  onSelect,
  logo,
  brand,
  footer,
  variant = "docked",
  defaultCollapsed = false,
}: AdminSidebarProps) {
  const docked = variant === "docked";
  const [collapsedState, setCollapsed] = useState(defaultCollapsed);
  const collapsed = docked && collapsedState;
  const shouldReduceMotion = useReducedMotion();
  // Saat docked & expanded, tepi kanan sidebar bersentuhan langsung dengan panel konten.
  const merged = docked && !collapsed;
  // Jarak kanan agar elemen non-menu tidak menempel ke panel konten.
  const rightGap = merged ? "pr-5" : "";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: "easeInOut" }}
      aria-label="Navigasi admin"
      className={`relative z-10 flex shrink-0 flex-col border border-white/20 bg-gradient-to-b from-emerald-500/90 via-emerald-600/80 to-emerald-900/90 py-4 backdrop-blur-xl ${
        docked
          ? "my-4 ml-4 rounded-l-[2rem] rounded-r-none border-r-0"
          : "m-3 h-[calc(100%-1.5rem)] rounded-[2rem] shadow-2xl shadow-black/40"
      } ${merged ? "pl-3" : "px-3"}`}
    >
      {/* Logo, nama panel, dan tombol collapse */}
      <div
        className={`mb-5 flex shrink-0 items-center gap-3 ${
          collapsed ? "justify-center" : ""
        } ${rightGap}`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 shadow-inner ${
            logo ? "bg-white p-1.5" : "bg-white/20 text-white"
          }`}
        >
          {logo ?? <Leaf size={18} />}
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            {brand && (
              <>
                <p className="truncate text-sm font-bold leading-tight text-white">
                  {brand.title}
                </p>
                {brand.subtitle && (
                  <p className="truncate text-[11px] font-medium text-emerald-50/70">
                    {brand.subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {docked && !collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Ciutkan sidebar"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Perluas sidebar"
          className="mx-auto -mt-2 mb-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Daftar menu (padding & margin negatif agar lengkungan tab tidak terpotong saat scroll) */}
      <nav className="-my-5 flex flex-1 flex-col gap-2.5 overflow-y-auto py-5">
        {items.map(({ key, label, icon: Icon }, index) => {
          const active = key === activeKey;

          // Mode collapsed: lingkaran ikon
          if (collapsed) {
            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.28,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                  ease: EASE,
                }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                title={label}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  active
                    ? "border-white bg-white text-slate-900 shadow-lg"
                    : "border-white/10 bg-white/10 text-white/85 hover:bg-white/20"
                }`}
              >
                <Icon size={18} />
              </motion.button>
            );
          }

          // Mode expanded
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.32,
                delay: shouldReduceMotion ? 0 : index * 0.045,
                ease: EASE,
              }}
              whileHover={shouldReduceMotion || active ? undefined : { x: 4 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-11 shrink-0 items-center gap-3 pl-2 pr-4 text-left text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                active
                  ? docked
                    ? "rounded-l-full bg-white text-slate-900"
                    : "rounded-full bg-white text-slate-900"
                  : "rounded-full bg-white/10 text-white/90 hover:bg-white/20"
              } ${!active && docked ? "mr-5" : ""}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-emerald-50 text-emerald-800" : "bg-white/10"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="truncate">{label}</span>

              {/* Lengkungan terbalik atas & bawah agar tab menyatu dengan panel putih */}
              {active && docked && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-5 right-0 h-5 w-5 bg-[radial-gradient(circle_at_0_0,transparent_19px,#fff_20px)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-5 right-0 h-5 w-5 bg-[radial-gradient(circle_at_0_100%,transparent_19px,#fff_20px)]"
                  />
                </>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bagian bawah (lihat situs, keluar, dll.) */}
      {footer && (
        <div
          className={`mt-4 flex shrink-0 flex-col gap-1 border-t border-white/15 pt-3 ${rightGap}`}
        >
          {footer(collapsed)}
        </div>
      )}
    </motion.aside>
  );
}

/**
 * Tombol aksi di bagian bawah sidebar (tautan atau tombol).
 * Otomatis menjadi lingkaran ikon saat sidebar collapsed.
 */
export function AdminSidebarAction({
  icon: Icon,
  label,
  collapsed,
  onClick,
  href,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  /** Jika diisi, dirender sebagai tautan yang dibuka di tab baru. */
  href?: string;
  tone?: "default" | "danger";
}) {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = {
    whileHover: shouldReduceMotion ? undefined : { x: collapsed ? 0 : 3, scale: collapsed ? 1.08 : 1 },
    whileTap: shouldReduceMotion ? undefined : { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 24 },
  };

  const cls = `flex items-center rounded-full text-sm font-medium text-white/85 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
    collapsed ? "mx-auto h-10 w-10 justify-center" : "h-10 gap-3 px-3"
  } ${tone === "danger" ? "hover:bg-red-500/30" : "hover:bg-white/15"}`;

  const content = (
    <>
      <Icon size={16} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={collapsed ? label : undefined}
        aria-label={label}
        className={cls}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={cls}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}

/**
 * Kerangka halaman admin: latar gradien hijau gelap, sidebar di kiri (desktop),
 * dan panel konten putih (bilah atas + isi halaman) yang menempel ke sidebar.
 * Di HP, sidebar disembunyikan; menu geser dirender oleh layout.
 */
export function AdminShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#0b7a58_0%,#06402f_38%,#020806_85%)]">
      <div className="hidden lg:flex">{sidebar}</div>

      <div className="relative m-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-white lg:my-4 lg:ml-0 lg:mr-4 lg:rounded-l-none lg:rounded-r-[2rem]">
        {topbar}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

// ============================================================
// 4. PAGE HEADER
// ============================================================

interface PageHeaderProps {
  title: string;
  description?: string;
  addLabel?: string;
  onAdd?: () => void;
}

/**
 * Header halaman bergaya kaca emerald dengan judul, deskripsi, dan tombol tambah.
 */
export function PageHeader({
  title,
  description,
  addLabel = "Tambah Data",
  onAdd,
}: PageHeaderProps) {
  const motionProps = useAdminMotion();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...motionProps}
      className="relative mb-7 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 shadow-lg shadow-emerald-950/20"
    >
      {/* Cahaya dekoratif */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/15" />

      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-50 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Panel Administrasi
          </span>

          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-emerald-50/75">
              {description}
            </p>
          )}
        </div>

        {onAdd && (
          <motion.button
            type="button"
            onClick={onAdd}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-lg shadow-black/20 transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800"
          >
            <Plus size={17} />
            {addLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// 5. TABLE COMPONENTS
// ============================================================

/**
 * Pembungkus tabel dengan tampilan kartu dan scroll horizontal.
 */
export function Table({ children }: { children: React.ReactNode }) {
  const motionProps = useAdminMotion();

  return (
    <motion.div
      {...motionProps}
      className="overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white shadow-sm shadow-emerald-950/5"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    </motion.div>
  );
}

/**
 * Header kolom tabel.
 */
export function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-emerald-900/10 bg-emerald-50/70 px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-900/70 ${className}`}
    >
      {children}
    </th>
  );
}

/**
 * Sel data tabel.
 */
export function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 align-middle text-slate-600 ${className}`}>
      {children}
    </td>
  );
}

/**
 * Baris tabel: muncul perlahan dari bawah, dengan efek hover.
 * `index` (opsional) memberi jeda antar baris agar muncul berurutan,
 * mis. rows.map((r, i) => <Tr key={r.id} index={i}>...</Tr>).
 */
export function Tr({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.tr
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        delay: shouldReduceMotion ? 0 : Math.min(index, 10) * 0.035,
        ease: EASE,
      }}
      className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-emerald-50/50"
    >
      {children}
    </motion.tr>
  );
}

// ============================================================
// 6. STATUS PILL
// ============================================================

const PILL_TONE = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-600",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

/**
 * Badge status yang dapat diubah menjadi tombol.
 * Muncul dengan efek "pop" kecil; versi tombol punya efek hover dan tap.
 */
export function StatusPill({
  tone,
  children,
  onClick,
}: {
  tone: keyof typeof PILL_TONE;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const classes = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold ${PILL_TONE[tone]}`;
  const dot = (
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
  );
  const enter = {
    initial: shouldReduceMotion ? false : { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring" as const, stiffness: 420, damping: 24 },
  };

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        {...enter}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        className={`${classes} cursor-pointer transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
      >
        {dot}
        {children}
      </motion.button>
    );
  }

  return (
    <motion.span {...enter} className={classes}>
      {dot}
      {children}
    </motion.span>
  );
}

// ============================================================
// 7. ROW ACTIONS
// ============================================================

/**
 * Tombol edit dan hapus pada setiap baris tabel.
 */
export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hover = shouldReduceMotion ? undefined : { scale: 1.12 };
  const tap = shouldReduceMotion ? undefined : { scale: 0.9 };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <motion.button
        type="button"
        onClick={onEdit}
        whileHover={hover}
        whileTap={tap}
        title="Edit data"
        aria-label="Edit data"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-slate-50 text-slate-400 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <Pencil size={16} />
      </motion.button>

      <motion.button
        type="button"
        onClick={onDelete}
        whileHover={hover}
        whileTap={tap}
        title="Hapus data"
        aria-label="Hapus data"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-slate-50 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <Trash2 size={16} />
      </motion.button>
    </div>
  );
}

// ============================================================
// 8. LOADING STATE
// ============================================================

/**
 * Tampilan ketika data sedang dimuat (ikon berputar dengan lingkaran denyut).
 */
export function AdminLoading({
  message = "Memuat data...",
}: {
  message?: string;
}) {
  const motionProps = useAdminMotion();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...motionProps}
      role="status"
      className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-emerald-900/10 bg-white px-5 py-12 text-center shadow-sm"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        {!shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-emerald-500/40"
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-lg shadow-emerald-900/20">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <p className="mt-1 text-xs text-slate-400">Mohon tunggu sebentar</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// 9. EMPTY STATE
// ============================================================

/**
 * Tampilan ketika belum ada data (ikon melayang pelan).
 */
export function AdminEmpty({ label }: { label: string }) {
  const motionProps = useAdminMotion();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...motionProps}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-900/20 bg-emerald-50/30 px-5 py-12 text-center"
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-emerald-900/10"
      >
        <Inbox className="h-7 w-7 text-emerald-700" strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-base font-bold text-slate-800">Belum Ada Data</h3>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
        Belum ada {label} yang tersedia. Data yang ditambahkan akan muncul di
        sini.
      </p>
    </motion.div>
  );
}

// ============================================================
// 10. ERROR STATE
// ============================================================

/**
 * Tampilan ketika terjadi kesalahan saat memuat data (bergetar sekali saat muncul).
 */
export function AdminError({ message }: { message: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      role="alert"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
      }
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
      className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.5rem] border border-red-200 bg-red-50/60 px-5 py-10 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-7 w-7 text-red-600" />
      </div>

      <h3 className="text-base font-bold text-red-800">Terjadi Kesalahan</h3>

      <p className="mt-2 max-w-lg text-sm leading-relaxed text-red-700">
        {message}
      </p>
    </motion.div>
  );
}

// ============================================================
// 11. CONFIRM DELETE DIALOG
// ============================================================

interface ConfirmDeleteProps {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog konfirmasi penghapusan data.
 */
export function ConfirmDelete({
  open,
  label,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) {
  const shouldReduceMotion = useReducedMotion();

  // Tekan Esc untuk menutup dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm-delete"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/60 p-4 backdrop-blur-md"
          role="presentation"
        >
          <motion.div
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 15, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            aria-describedby="confirm-delete-description"
            className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl"
          >
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-amber-400" />

            <div className="p-6">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>

                  <div>
                    <h2
                      id="confirm-delete-title"
                      className="text-base font-bold text-slate-900"
                    >
                      Hapus Data?
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Konfirmasi penghapusan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Tutup dialog"
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                id="confirm-delete-description"
                className="rounded-2xl border border-red-100 bg-red-50/60 p-4"
              >
                <p className="break-words text-sm leading-relaxed text-slate-700">
                  Data{" "}
                  <strong className="font-semibold text-slate-900">
                    &ldquo;{label}&rdquo;
                  </strong>{" "}
                  akan dihapus secara permanen dan tidak dapat dikembalikan.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Batal
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onConfirm}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  <Trash2 size={15} />
                  Ya, Hapus
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// 12. FORM CARD
// ============================================================

/**
 * Pembungkus form tambah/edit.
 */
export function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const motionProps = useAdminMotion();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div {...motionProps} className="max-w-3xl">
      <div className="mb-6">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Panel Administrasi
        </span>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-emerald-900/10 bg-white shadow-sm shadow-emerald-950/5">
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: EASE, delay: 0.1 }}
          style={{ originX: 0 }}
          className="h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-300"
        />
        <div className="space-y-6 p-5 sm:p-7">{children}</div>
      </div>
    </motion.div>
  );
}

// ============================================================
// 13. FORM FIELD
// ============================================================

/**
 * Komponen label dan pembungkus input form.
 * `htmlFor` opsional untuk menghubungkan label dengan input (aksesibilitas).
 */
export function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-bold uppercase tracking-[0.08em] text-slate-600"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-label="wajib diisi">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ============================================================
// 14. INPUT STYLES
// ============================================================

/**
 * Kelas standar input satu baris.
 */
export const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

/**
 * Kelas standar textarea.
 */
export const textareaCls = `${inputCls} min-h-[120px] resize-y leading-relaxed`;

// ============================================================
// 15. FORM ACTIONS
// ============================================================

/**
 * Tombol batal dan simpan pada bagian bawah form.
 * Label tombol simpan berganti dengan transisi halus saat loading.
 */
export function FormActions({
  loading,
  onCancel,
  submitLabel = "Simpan",
}: {
  loading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const tap = shouldReduceMotion ? undefined : { scale: 0.97 };

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
      <motion.button
        type="button"
        onClick={onCancel}
        disabled={loading}
        whileHover={shouldReduceMotion || loading ? undefined : { x: -2 }}
        whileTap={loading ? undefined : tap}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={15} />
        Batal
      </motion.button>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={shouldReduceMotion || loading ? undefined : { y: -2 }}
        whileTap={loading ? undefined : tap}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-shadow hover:shadow-lg hover:shadow-emerald-900/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={loading ? "loading" : "idle"}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
            className="inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                {submitLabel}
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}