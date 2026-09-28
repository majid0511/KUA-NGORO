import React from "react";
import { UserCheck } from "lucide-react";

interface StaffCardProps {
  name: string;
  position: string;
  nip?: string;
  roleCategory: string;
  description?: string;
  photoUrl?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  name,
  position,
  nip,
  roleCategory,
  description,
  photoUrl,
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden shrink-0 flex items-center justify-center">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCheck className="w-10 h-10 text-[#0f5132]" />
        )}
      </div>

      <div className="text-center sm:text-left flex-1">
        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-[#0f5132] mb-1">
          {roleCategory}
        </span>

        <h3 className="text-lg font-bold text-stone-900 leading-tight">
          {name}
        </h3>

        <p className="text-sm font-medium text-[#0f5132] mt-0.5">
          {position}
        </p>

        {nip && (
          <p className="text-xs font-mono text-stone-500 mt-1">
            NIP. {nip}
          </p>
        )}

        {description && (
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
