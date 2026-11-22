// KOMPONEN BERSAMA PANEL ADMIN
// Seluruh komponen kini berada di adminShared.tsx (tampilan emerald glass).
// File ini hanya meneruskan (re-export) supaya halaman yang mengimpor dari "./AdminUI"
// otomatis memakai tampilan yang sama tanpa perlu mengubah impornya.
export * from './AdminShared';