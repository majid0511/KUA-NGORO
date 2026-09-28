import React from "react";
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { profileData } from "../../data/profile";

export const QuickAccessSection: React.FC = () => {
  const quickItems = [
    {
      id: "lokasi",
      title: "Lokasi KUA",
      subtitle: profileData.address,
      actionText: "Buka Peta Google Maps",
      href: profileData.mapsUrl,
      external: true,
      icon: <MapPin className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "telepon",
      title: "Nomor Telepon",
      subtitle: profileData.phone,
      actionText: "Hubungi Langsung",
      href: `tel:${profileData.phone}`,
      external: false,
      icon: <Phone className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Resmi",
      subtitle: `0851-3322-5303 (Konsultasi)`,
      actionText: "Kirim Pesan Chat",
      href: `https://wa.me/${profileData.whatsapp}`,
      external: true,
      icon: <MessageSquare className="w-6 h-6 text-[#0f5132]" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: "jam-pelayanan",
      title: "Jam Pelayanan",
      subtitle: "Senin-Kamis 07.30-16.00 WIB",
      actionText: "Jumat 07.30-16.30 WIB",
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
