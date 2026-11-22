/**
 * PRAYER DYNAMIC ISLAND
 *
 * Floating bubble jadwal sholat KUA Kecamatan Ngoro.
 *
 * Fitur:
 * - Posisi fixed di pojok kanan atas.
 * - Tampilan compact (idle) dan expanded.
 * - Menampilkan lima waktu sholat.
 * - Menyorot waktu sholat berikutnya.
 * - Kembali ke mode idle saat pengguna menekan area di luar island
 *   atau menekan tombol Escape.
 * - Notifikasi in-app ketika waktu sholat masuk.
 * - Browser Notification dengan izin pengguna.
 * - Memuat ulang jadwal saat tanggal WIB berubah.
 * - Mencegah notifikasi yang sama muncul berulang kali.
 *
 * Transisi:
 * - Satu wadah yang tetap ada (tidak di-remount), ukurannya beranimasi
 *   dengan spring lewat layout animation.
 * - Radius sudut diatur lewat style agar ikut terkoreksi saat wadah
 *   berubah ukuran (tidak penyok / meloncat).
 * - Isi (idle, expanded, notifikasi) saling bertukar dengan crossfade.
 *
 * Catatan:
 * Browser Notification hanya berjalan ketika halaman website
 * masih terbuka. Push Notification membutuhkan Service Worker
 * dan backend tersendiri.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  Bell,
  BellRing,
  ChevronDown,
  MoonStar,
  X,
} from "lucide-react";

import {
  getTodayPrayerTimes,
  getNextPrayerName,
  getTodayWibKey,
  type PrayerTimes,
} from "../lib/prayerTimes";

// Urutan lima waktu sholat.
const ORDER: (keyof PrayerTimes)[] = [
  "Subuh",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

// Zona waktu Indonesia Barat.
const TIME_ZONE = "Asia/Jakarta";

// Interval pemeriksaan waktu sholat.
const CHECK_INTERVAL = 15_000;

// Durasi notifikasi in-app.
const ALERT_DURATION = 12_000;

// Interval pemeriksaan pergantian tanggal.
const DATE_CHECK_INTERVAL = 30_000;

// Radius sudut tiap keadaan (px). Dibuat berdekatan agar perubahannya mulus.
const RADIUS_COMPACT = 18;
const RADIUS_ALERT = 22;
const RADIUS_EXPANDED = 24;

/**
 * Mendapatkan waktu sekarang berdasarkan WIB.
 * Hasil berupa jam, menit, dan total menit sejak tengah malam.
 */
function getCurrentWibTime(): {
  totalMinutes: number;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const hour = get("hour");
  const minute = get("minute");

  return {
    totalMinutes: hour * 60 + minute,
  };
}

/**
 * Mengubah format HH:mm menjadi total menit.
 */
function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

/**
 * Membuat ID unik notifikasi berdasarkan tanggal dan nama sholat.
 */
function getNotificationId(
  date: string,
  prayer: keyof PrayerTimes
): string {
  return `kua-ngoro:prayer-notification:${date}:${prayer}`;
}

/**
 * Memeriksa apakah notifikasi sudah pernah ditampilkan.
 */
function hasBeenNotified(id: string): boolean {
  try {
    return sessionStorage.getItem(id) === "true";
  } catch {
    return false;
  }
}

/**
 * Menandai notifikasi sebagai sudah ditampilkan.
 */
function markAsNotified(id: string): void {
  try {
    sessionStorage.setItem(id, "true");
  } catch {
    // Tetap lanjut jika sessionStorage tidak tersedia.
  }
}

/**
 * Dynamic Island jadwal sholat KUA Kecamatan Ngoro.
 */
export const PrayerTimesBar: React.FC = () => {
  // Menyimpan jadwal sholat hari ini.
  const [times, setTimes] = useState<PrayerTimes | null>(null);

  // Menyimpan nama waktu sholat berikutnya.
  const [next, setNext] = useState<keyof PrayerTimes | null>(null);

  // Mengatur kondisi panel terbuka atau tertutup.
  const [expanded, setExpanded] = useState(false);

  // Menyimpan nama sholat yang sedang diberitahukan.
  const [alertPrayer, setAlertPrayer] =
    useState<keyof PrayerTimes | null>(null);

  // Menyimpan status izin Browser Notification.
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  // Menghormati preferensi Reduce Motion pengguna.
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  // Wadah island: dipakai untuk mendeteksi tekanan di luar island.
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Menyimpan ID timer notifikasi in-app.
  const alertTimerRef = useRef<number | null>(null);

  // Mencegah notifikasi yang sama diproses berulang kali.
  const notifiedRef = useRef<Set<string>>(new Set());

  // Menyimpan menit terakhir yang diperiksa.
  const lastCheckedRef = useRef<number | null>(null);

  // Menyimpan tanggal jadwal yang berhasil dimuat.
  const loadedDateRef = useRef<string>("");

  // Mencegah permintaan jadwal berjalan bersamaan.
  const loadingRef = useRef(false);

  /**
   * Mengambil jadwal sholat hari ini.
   */
  const loadPrayerTimes = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    try {
      const requestedDate = getTodayWibKey();

      const result = await getTodayPrayerTimes();

      // Jangan gunakan hasil jika tanggal WIB sudah berubah.
      if (getTodayWibKey() !== requestedDate) return;

      if (result) {
        setTimes(result);
        loadedDateRef.current = requestedDate;
        lastCheckedRef.current = null;
      }
    } catch (error) {
      console.error(
        "[PrayerTimes] Gagal memuat jadwal:",
        error
      );
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // Memuat jadwal ketika komponen pertama kali dipasang.
  useEffect(() => {
    void loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Memuat ulang jadwal ketika tanggal WIB berubah.
  useEffect(() => {
    const refreshDailySchedule = async () => {
      const today = getTodayWibKey();

      // Tidak perlu memuat ulang jika tanggal belum berubah.
      if (today === loadedDateRef.current) return;

      // Kosongkan jadwal lama.
      setTimes(null);
      setNext(null);
      setAlertPrayer(null);
      setExpanded(false);

      // Bersihkan status pemeriksaan sebelumnya.
      lastCheckedRef.current = null;
      notifiedRef.current.clear();
      loadedDateRef.current = "";

      // Hapus timer notifikasi yang masih aktif.
      if (alertTimerRef.current !== null) {
        window.clearTimeout(alertTimerRef.current);
        alertTimerRef.current = null;
      }

      await loadPrayerTimes();
    };

    const intervalId = window.setInterval(
      refreshDailySchedule,
      DATE_CHECK_INTERVAL
    );

    return () => window.clearInterval(intervalId);
  }, [loadPrayerTimes]);

  // Memperbarui waktu sholat berikutnya setiap menit.
  useEffect(() => {
    if (!times) return;

    const updateNextPrayer = () => {
      setNext(getNextPrayerName(times));
    };

    updateNextPrayer();

    const intervalId = window.setInterval(
      updateNextPrayer,
      60_000
    );

    return () => window.clearInterval(intervalId);
  }, [times]);

  // Memeriksa apakah waktu sholat baru saja masuk.
  useEffect(() => {
    if (!times) return;

    const checkPrayerTime = () => {
      const today = getTodayWibKey();
      const now = getCurrentWibTime();

      const previousMinute = lastCheckedRef.current;

      // Simpan menit saat ini.
      lastCheckedRef.current = now.totalMinutes;

      for (const prayer of ORDER) {
        const prayerMinute = toMinutes(times[prayer]);

        // Cocokkan dengan menit saat ini.
        let prayerEntered =
          prayerMinute === now.totalMinutes;

        // Antisipasi keterlambatan interval hingga dua menit.
        if (previousMinute !== null) {
          const difference =
            (now.totalMinutes - previousMinute + 1440) % 1440;

          if (difference > 0 && difference <= 2) {
            prayerEntered =
              prayerEntered ||
              (
                prayerMinute > previousMinute &&
                prayerMinute <= now.totalMinutes
              );
          }
        }

        if (!prayerEntered) continue;

        const notificationId = getNotificationId(
          today,
          prayer
        );

        // Jangan tampilkan notifikasi yang sudah pernah diproses.
        if (
          notifiedRef.current.has(notificationId) ||
          hasBeenNotified(notificationId)
        ) {
          continue;
        }

        // Tandai notifikasi sebelum menampilkan pemberitahuan.
        notifiedRef.current.add(notificationId);
        markAsNotified(notificationId);

        // Tampilkan notifikasi di dalam website.
        setAlertPrayer(prayer);
        setExpanded(false);

        // Bersihkan timer notifikasi sebelumnya.
        if (alertTimerRef.current !== null) {
          window.clearTimeout(alertTimerRef.current);
        }

        // Tutup notifikasi otomatis setelah durasi tertentu.
        alertTimerRef.current = window.setTimeout(() => {
          setAlertPrayer(null);
          alertTimerRef.current = null;
        }, ALERT_DURATION);

        // Tampilkan Browser Notification jika izin diberikan.
        if (
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            const browserNotification = new Notification(
              `Waktu ${prayer} Telah Tiba`,
              {
                body: "Mari tunaikan ibadah sholat tepat waktu.",
                icon: "/favicon.ico",
                tag: notificationId,
              }
            );

            browserNotification.onclick = () => {
              window.focus();
              browserNotification.close();
            };
          } catch (error) {
            console.warn(
              "[PrayerTimes] Browser Notification gagal:",
              error
            );
          }
        }
      }
    };

    // Pemeriksaan pertama ketika jadwal tersedia.
    checkPrayerTime();

    // Pemeriksaan berkala selama halaman terbuka.
    const intervalId = window.setInterval(
      checkPrayerTime,
      CHECK_INTERVAL
    );

    return () => window.clearInterval(intervalId);
  }, [times]);

  // Membersihkan timer ketika komponen dilepas.
  useEffect(() => {
    return () => {
      if (alertTimerRef.current !== null) {
        window.clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  // Kembali ke mode idle saat pengguna menekan area di luar island
  // atau menekan tombol Escape. Hanya aktif selama island terbuka.
  useEffect(() => {
    if (!expanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      const node = containerRef.current;

      if (
        node &&
        event.target instanceof Node &&
        !node.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  /**
   * Meminta izin Browser Notification.
   * Hanya dijalankan setelah pengguna menekan tombol.
   */
  const enableBrowserNotification = async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch {
      setPermission("denied");
    }
  };

  /**
   * Menutup notifikasi in-app secara manual.
   */
  const dismissAlert = () => {
    setAlertPrayer(null);

    if (alertTimerRef.current !== null) {
      window.clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
  };

  // Jangan tampilkan bubble jika jadwal belum tersedia.
  if (!times) return null;

  // Radius sudut mengikuti keadaan island.
  const radius = alertPrayer
    ? RADIUS_ALERT
    : expanded
      ? RADIUS_EXPANDED
      : RADIUS_COMPACT;

  // Transisi ukuran wadah: spring halus ala Dynamic Island.
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34 };

  return (
    <div className="fixed right-3 top-20 z-50 flex justify-end sm:right-5 sm:top-24">
      <motion.div
        ref={containerRef}
        layout={!reduceMotion}
        transition={{ layout: layoutTransition }}
        // Radius lewat style agar terkoreksi otomatis saat layout beranimasi.
        style={{ borderRadius: radius }}
        className={`relative ${
          expanded
            ? "w-[min(88vw,320px)]"
            : "w-fit max-w-[88vw]"
        } overflow-hidden border border-emerald-900/20 bg-[#103d2b] text-white shadow-lg shadow-emerald-950/15`}
      >
        {/* popLayout: isi lama langsung keluar dari alur sehingga wadah
            mulai berubah ukuran sambil isi baru muncul (crossfade). */}
        <AnimatePresence mode="popLayout" initial={false}>
          {/* NOTIFIKASI WAKTU SHOLAT */}
          {alertPrayer ? (
            <motion.div
              key="notification"
              layout={!reduceMotion}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 0.94 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.94 }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.2,
                layout: layoutTransition,
              }}
              className="flex items-center gap-2.5 px-3 py-2"
              role="status"
              aria-live="assertive"
            >
              {/* Lonceng bergoyang sekali saat notifikasi muncul */}
              <motion.span
                aria-hidden="true"
                className="flex shrink-0"
                initial={false}
                animate={
                  reduceMotion
                    ? undefined
                    : { rotate: [0, -18, 16, -12, 8, 0] }
                }
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <BellRing size={16} className="text-emerald-300" />
              </motion.span>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-white">
                  Waktu {alertPrayer} telah tiba
                </p>

                <p className="text-[9px] text-emerald-200">
                  Mari tunaikan sholat tepat waktu.
                </p>
              </div>

              <button
                type="button"
                onClick={dismissAlert}
                aria-label="Tutup pemberitahuan"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-emerald-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <X size={13} />
              </button>
            </motion.div>
          ) : (
            // Wadah isi utama: TIDAK memakai key yang berubah, sehingga
            // bagian ini tidak di-remount saat island dibuka atau ditutup.
            <motion.div
              key="main"
              layout={!reduceMotion}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 0.96 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.96 }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.2,
                layout: layoutTransition,
              }}
              className="relative"
            >
              {/* BUBBLE UTAMA: seluruh baris bisa ditekan untuk buka/tutup */}
              <motion.button
                layout={!reduceMotion}
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-label={
                  expanded
                    ? "Tutup jadwal sholat"
                    : "Buka jadwal sholat"
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="relative flex min-h-9 w-full items-center px-3 py-1.5 pr-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
                style={{ borderRadius: RADIUS_COMPACT }}
              >
                {/* Informasi waktu sholat */}
                <div className="flex min-w-0 items-center gap-2">
                  <MoonStar
                    size={14}
                    className="shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[9px] font-medium leading-none text-emerald-200">
                      {next ? "Berikutnya" : "Jadwal Sholat"}
                    </span>

                    <div className="flex min-w-0 items-center gap-1.5">
                      {next ? (
                        <>
                          <span className="truncate text-[11px] font-bold text-white">
                            {next}
                          </span>

                          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-emerald-100">
                            {times[next]}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-semibold text-white">
                          Semua waktu berlalu
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Panah di kanan: berputar halus, bukan berganti ikon */}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute right-1.5 top-1/2 -mt-3.5 flex h-7 w-7 items-center justify-center rounded-full text-emerald-200"
                >
                  <ChevronDown size={13} />
                </motion.span>
              </motion.button>

              {/* PANEL JADWAL LENGKAP.
                  popLayout: saat ditutup, panel langsung keluar dari alur
                  sambil memudar, sehingga wadah menyusut tanpa jeda. */}
              <AnimatePresence mode="popLayout" initial={false}>
                {expanded && (
                  <motion.div
                    key="panel"
                    layout={!reduceMotion}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: -6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, y: -6 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.2,
                      layout: layoutTransition,
                    }}
                    className="w-full"
                  >
                    <div className="border-t border-white/10 px-2.5 pb-3 pt-2.5">
                      {/* Header jadwal */}
                      <div className="mb-2.5 flex items-center justify-between px-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                          Jadwal Sholat Hari Ini
                        </span>

                        <span className="text-[9px] text-emerald-400">
                          Jombang · WIB
                        </span>
                      </div>

                      {/* Lima waktu sholat: muncul berurutan */}
                      <div className="grid grid-cols-5 gap-1">
                        {ORDER.map((name, index) => {
                          const active = next === name;

                          return (
                            <motion.div
                              key={name}
                              initial={
                                reduceMotion
                                  ? false
                                  : { opacity: 0, y: 6 }
                              }
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: reduceMotion ? 0 : 0.22,
                                delay: reduceMotion ? 0 : 0.06 + index * 0.035,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors duration-300 ${
                                active
                                  ? "bg-white/15 ring-1 ring-white/20"
                                  : "bg-white/5"
                              }`}
                            >
                              <span
                                className={`text-[9px] ${
                                  active
                                    ? "font-bold text-white"
                                    : "text-emerald-200"
                                }`}
                              >
                                {name}
                              </span>

                              <span className="text-[10px] font-bold tabular-nums text-white">
                                {times[name]}
                              </span>

                              {active && (
                                <span className="text-[7px] font-semibold text-emerald-300">
                                  Berikutnya
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* PENGATURAN BROWSER NOTIFICATION */}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Bell
                            size={12}
                            className="shrink-0 text-emerald-300"
                          />

                          <span className="text-[9px] text-emerald-100">
                            Notifikasi browser
                          </span>
                        </div>

                        {permission === "granted" ? (
                          <span className="text-[9px] font-semibold text-emerald-300">
                            Aktif
                          </span>
                        ) : permission === "denied" ? (
                          <span className="text-[9px] text-amber-300">
                            Diblokir browser
                          </span>
                        ) : permission === "unsupported" ? (
                          <span className="text-[9px] text-amber-300">
                            Tidak didukung
                          </span>
                        ) : (
                          <motion.button
                            type="button"
                            onClick={enableBrowserNotification}
                            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                            className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[9px] font-semibold text-emerald-200 transition hover:bg-emerald-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                          >
                            Aktifkan
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};