import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Building2, Landmark, ShieldCheck, BookOpen, Info, Users } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  detailUrl?: string;
  externalUrl?: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "HeartHandshake":
      return <HeartHandshake className="w-6 h-6 text-[#0f5132]" />;
    case "Building2":
      return <Building2 className="w-6 h-6 text-[#0f5132]" />;
    case "Landmark":
      return <Landmark className="w-6 h-6 text-[#0f5132]" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-6 h-6 text-[#0f5132]" />;
    case "BookOpen":
      return <BookOpen className="w-6 h-6 text-[#0f5132]" />;
    case "Users":
      return <Users className="w-6 h-6 text-[#0f5132]" />;
    default:
      return <Info className="w-6 h-6 text-[#0f5132]" />;
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  number,
  title,
  description,
  iconName,
  detailUrl,
  externalUrl,
}) => {
  const targetUrl = detailUrl || `/layanan#${id}`;

  const cardContent = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-emerald-700/40 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            {getIconComponent(iconName)}
          </div>
          <span className="text-xl font-bold font-mono text-stone-300 group-hover:text-[#0f5132] transition-colors">
            {number}
          </span>
        </div>

        <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors mb-2.5">
          {title}
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-sm font-semibold text-[#0f5132]">
        <span>Lihat Detail</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
      </div>
    </motion.div>
  );

  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={targetUrl} className="block h-full">
      {cardContent}
    </Link>
  );
};
