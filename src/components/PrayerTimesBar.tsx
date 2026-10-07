import React, { useEffect, useState } from "react";
import { getTodayPrayerTimes, getNextPrayerName, type PrayerTimes } from "../lib/prayerTimes";

const ORDER: (keyof PrayerTimes)[] = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];

export const PrayerTimesBar: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [next, setNext] = useState<keyof PrayerTimes | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTodayPrayerTimes().then((t) => {
      if (!cancelled && t) setTimes(t);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!times) return;
    setNext(getNextPrayerName(times));
    const id = setInterval(() => setNext(getNextPrayerName(times)), 60_000);
    return () => clearInterval(id);
  }, [times]);

  // Gagal memuat (offline / API bermasalah): sembunyikan saja, jangan tampilkan bar rusak.
  if (!times) return null;

  return (
    <div className="bg-[#0f5132] text-white text-xs">
      <div className="container-kua flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
        <span className="font-semibold text-emerald-200 shrink-0 mr-1">Jadwal Sholat:</span>
        {ORDER.map((name, i) => {
          const active = next === name;
          return (
            <React.Fragment key={name}>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                  active ? "bg-white text-[#0f5132]" : "text-emerald-100"
                }`}
              >
                {name} {times[name]}
              </span>
              {i < ORDER.length - 1 && <span className="text-emerald-700 shrink-0">·</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
