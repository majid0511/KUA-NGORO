// BAGIAN LOKASI di Beranda: peta Google Maps tertanam + alamat, telepon, email, dan jam pelayanan kantor,
// serta tombol "Buka di Google Maps". Data kontak diambil dari profil di Supabase; jika kosong, memakai data lokal.
import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from "lucide-react";
import { profileData } from "../../data/profile";
import { Button } from "../ui/Button";
import { getProfil } from "../../lib/cms";
import type { Profil } from "../../lib/cms/types";

/**
 * Komponen lokasi kantor (peta di kiri, informasi di kanan pada layar lebar; peta di atas pada HP).
 */
export const LocationSection: React.FC = () => {
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

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60">
      <div className="container-kua">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#0f5132] text-xs font-bold tracking-wider uppercase mb-3">
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>LOKASI KANTOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Temui Kami di KUA Ngoro
          </h2>

          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
            Kunjungi Kantor Urusan Agama Kecamatan Ngoro untuk pelayanan konsultasi langsung dan verifikasi dokumen.
          </p>
        </div>

        {/* Layar lebar: peta ~58% + informasi ~42% berdampingan. HP: peta di atas, informasi di bawah */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-50">
          {/* Peta Google Maps (iframe) */}
          <div className="lg:col-span-7 min-h-[340px] sm:min-h-[420px] relative bg-stone-200 overflow-hidden">
            <iframe
              title="Peta Lokasi KUA Kecamatan Ngoro"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.062086435649!2d112.2692273!3d-7.6925264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7868772497aa05%3A0x2fe556b013739c7f!2sKUA%20Kecamatan%20Ngoro!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Panel informasi: alamat, telepon, email, jam operasional, dan tombol Maps */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0f5132]" />
                <span>Informasi Alamat & Jam Buka</span>
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Alamat Resmi</span>
                    <p className="font-semibold text-stone-800 leading-snug mt-0.5">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Telepon / WhatsApp</span>
                    <p className="font-semibold text-stone-800 font-mono mt-0.5">
                      {phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Email Resmi</span>
                    <p className="font-semibold text-stone-800 font-mono text-xs mt-0.5">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0f5132] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Jam Operasional Pelayanan</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{officeHours.workDays}</p>
                    <p className="font-semibold text-stone-800">{officeHours.fridayHours}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{officeHours.weekend}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <Button
                href={profileData.mapsUrl}
                external
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Buka di Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
