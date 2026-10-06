import React, { useEffect, useState } from "react";
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { profileData } from "../../data/profile";
import { getProfil } from "../../lib/cms";
import type { Profil } from "../../lib/cms/types";

export const QuickAccessSection: React.FC = () => {
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

  const address = profil?.address || profileData.address;
  const phone = profil?.phone || profileData.phone;
  const workDaysHours = profil?.office_hours?.workDays || profileData.officeHours.workDays;
  const fridayHours = profil?.office_hours?.fridayHours || profileData.officeHours.fridayHours;
  const rawPhoneNum = phone.replace(/[^0-9]/g, "");
  const whatsappNum = rawPhoneNum || profileData.whatsapp;

  const quickItems = [
    {
      id: "lokasi",
      title: "Lokasi KUA",
      subtitle: address,
      actionText: "Buka Peta Google Maps",
      href: profileData.mapsUrl,
      external: true,
      icon: <MapPin className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "telepon",
      title: "Nomor Telepon",
      subtitle: phone,
      actionText: "Hubungi Langsung",
      href: `tel:${phone}`,
      external: false,
      icon: <Phone className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Resmi",
      subtitle: `${phone} (Konsultasi)`,
      actionText: "Kirim Pesan Chat",
      href: `https://wa.me/${whatsappNum}`,
      external: true,
      icon: <MessageSquare className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "jam-pelayanan",
      title: "Jam Pelayanan",
      subtitle: `Senin-Kamis ${workDaysHours}`,
      actionText: `Jumat ${fridayHours}`,
      href: "/kontak",
      external: false,
      icon: <Clock className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 container-kua">
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {quickItems.map((item, idx) => (
            <motion.a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex items-start gap-4 p-3.5 sm:p-4 rounded-xl hover:bg-stone-50 transition-colors group ${
                idx !== 0 ? "pt-4 sm:pt-0" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-0.5">
                  {item.title}
                </h4>
                <p className="text-sm font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors truncate">
                  {item.subtitle}
                </p>
                <span className="text-xs font-semibold text-[#0f5132] group-hover:underline inline-block mt-1">
                  {item.actionText} →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
