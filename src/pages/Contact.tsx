// HALAMAN KONTAK (alamat: /kontak): alamat, telepon, WhatsApp, email, jam pelayanan, formulir pesan, dan peta lokasi.
// Data kontak diambil dari profil di Supabase; jika kosong, memakai data lokal.
import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { profileData } from "../data/profile";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { getProfil } from "../lib/cms";
import type { Profil } from "../lib/cms/types";

/**
 * Halaman kontak.
 */
export default function Contact() {
  usePageMeta({
    title: "Kontak",
    description:
      "Alamat, nomor telepon, WhatsApp, dan jam pelayanan Kantor Urusan Agama Kecamatan Ngoro.",
    path: "/kontak",
  });

  // Profil dari database (null selama belum dimuat atau gagal)
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProfil().then((res) => {
      if (!cancelled && res.data) setProfil(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Setiap data: pakai nilai dari database jika terisi, jika tidak pakai data lokal (profileData)
  const address = profil?.address || profileData.address;
  const phone = profil?.phone || profileData.phone;
  const email = profil?.email || profileData.email;
  const officeHours = profil?.office_hours || profileData.officeHours;
  // Nomor telepon hanya angka, dipakai untuk tautan WhatsApp (wa.me)
  const rawPhone = phone.replace(/[^0-9]/g, "");
  const whatsappNum = rawPhone || profileData.whatsapp;

  // Isi formulir yang sedang diketik pengunjung
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    topic: "Pernikahan",
    message: "",
  });

  // True setelah tombol "Kirim Pesan" ditekan -> formulir diganti layar konfirmasi
  const [submitted, setSubmitted] = useState(false);

  /**
   * CATATAN PENTING: formulir ini TIDAK menyimpan atau mengirim pesan ke server mana pun.
   * "Kirim Pesan" hanya memvalidasi nama & pesan terisi lalu menampilkan layar konfirmasi.
   * Pesan baru benar-benar terkirim ketika pengunjung menekan "Lanjutkan ke WhatsApp" (handleWhatsAppSend).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
  };

  /**
   * Membuka WhatsApp (tab baru) ke nomor KUA dengan isi pesan yang sudah terisi otomatis dari formulir
   * (nama, telepon, topik, pesan). encodeURIComponent memastikan karakter khusus aman di dalam alamat URL.
   */
  const handleWhatsAppSend = () => {
    const text = `Halo KUA Ngoro,%0ANama: ${encodeURIComponent(formData.name)}%0ATelepon: ${encodeURIComponent(formData.phone)}%0ATopik: ${encodeURIComponent(formData.topic)}%0APesan: ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, "_blank");
  };

  return (
    <div className="py-10 space-y-16">
      {/* Kepala halaman */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0f5132] text-xs font-bold uppercase tracking-wider mb-4">
              <Phone className="w-4 h-4" />
              <span>HUBUNGI KUA NGORO</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Kontak & Lokasi Kantor
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Silakan hubungi KUA Kecamatan Ngoro melalui telepon, WhatsApp, email, atau datang langsung ke alamat kantor kami.
            </p>
          </div>
        </div>
      </section>

      {/* Grid utama: informasi kontak (kiri) + formulir (kanan) */}
      <section className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Kolom kiri: kartu informasi kontak resmi */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-stone-900 pb-4 border-b border-stone-100">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Alamat Kantor</span>
                    <p className="font-semibold text-stone-800 leading-snug mt-0.5">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Nomor Telepon</span>
                    <p className="font-semibold text-stone-800 font-mono mt-0.5">
                      {phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">WhatsApp Konsultasi</span>
                    <a
                      href={`https://wa.me/${whatsappNum}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0f5132] font-mono hover:underline block mt-0.5"
                    >
                      {phone} (Klik untuk Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Email Resmi</span>
                    <p className="font-semibold text-stone-800 font-mono text-xs mt-0.5">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Jam pelayanan kantor */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Jam Pelayanan Kantor
                </span>
                <p className="text-xs text-stone-700 font-semibold">{officeHours.workDays}</p>
                <p className="text-xs text-stone-700 font-semibold">{officeHours.fridayHours}</p>
                <p className="text-xs text-stone-400">{officeHours.weekend}</p>
              </div>
            </div>
          </div>

          {/* Kolom kanan: formulir pesan & konsultasi */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Formulir Pesan & Konsultasi Online
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6">
              Kirimkan pertanyaan Anda mengenai pelayanan KUA. Tim kami akan merespons pertanyaan Anda.
            </p>

            {/* Jika sudah "terkirim": tampilkan konfirmasi + tombol lanjut ke WhatsApp; jika belum: tampilkan formulir */}
            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-stone-900">Pesan Berhasil Terkirim</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  Terima kasih <strong>{formData.name}</strong>. Anda juga dapat langsung menghubungi via WhatsApp untuk respon cepat.
                </p>
                <div className="pt-3">
                  <Button onClick={handleWhatsAppSend} rightIcon={<MessageSquare className="w-4 h-4" />}>
                    Lanjutkan ke WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nomor HP / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Topik Layanan
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    >
                      <option value="Pernikahan">Pencatatan Nikah & SIMKAH</option>
                      <option value="Wakaf">Sertifikasi Tanah Wakaf</option>
                      <option value="Kemasjidan">Kemakmuran Masjid & Arah Kiblat</option>
                      <option value="Bimbingan">Bimbingan Perkawinan & Konseling</option>
                      <option value="Lainnya">Lainnya / Informasi Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Pesan Pertanyaan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pertanyaan atau kebutuhan konsultasi Anda di sini..."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button type="submit" rightIcon={<Send className="w-4 h-4" />} className="w-full sm:w-auto">
                    Kirim Pesan
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleWhatsAppSend}
                    rightIcon={<MessageSquare className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Kirim via WhatsApp
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Peta Google Maps lokasi kantor (iframe tertanam) */}
      <section className="container-kua">
        <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-md aspect-[16/9] sm:aspect-[21/9]">
          <iframe
            title="Google Maps KUA Ngoro"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.062086435649!2d112.2692273!3d-7.6925264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7868772497aa05%3A0x2fe556b013739c7f!2sKUA%20Kecamatan%20Ngoro!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
