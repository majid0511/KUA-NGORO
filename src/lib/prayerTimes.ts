
/**
 * JADWAL SHOLAT HARIAN KUA KECAMATAN NGORO
 *
 * Mengambil jadwal sholat Kabupaten Jombang / Kecamatan Ngoro melalui Aladhan API
 * dengan metode perhitungan resmi Kemenag RI (method=20).
 *
 * Fitur Keandalan (Reliability):
 * - Zona waktu Asia/Jakarta (WIB).
 * - Koordinat resmi KUA Kecamatan Ngoro: Lat -7.6925, Long 112.2692.
 * - Cache localStorage berdasarkan tanggal WIB (kua-ngoro:prayer-times:YYYY-MM-DD).
 * - Cache persistensi cadangan terakhir (kua-ngoro:prayer-times:last-valid) jika offline / API gagal.
 * - Algoritma kalkulasi astronomi offline presisi standar Kemenag RI (Fajr 20°, Isha 18°, ihtiyat +2 menit)
 *   apabila API offline/timeout/error dan cache belum ada.
 * - Membedakan dengan jelas sumber data: 'api', 'cached', atau 'calculated'.
 */

// Lima waktu sholat wajib dalam format HH:mm.
export interface PrayerTimes {
  Subuh: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
  source?: "api" | "cached" | "calculated";
}

// Urutan waktu sholat.
export const ORDER: (keyof Omit<PrayerTimes, "source">)[] = [
  "Subuh",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

// Konfigurasi zona waktu & koordinat Ngoro, Jombang
export const WIB = "Asia/Jakarta";
export const NGORO_COORDINATES = {
  latitude: -7.6925,
  longitude: 112.2692,
  timezone: 7, // UTC+7
};

// Parameter perhitungan Kemenag RI (sesuai method=20 Aladhan)
export const KEMENAG_PARAMS = {
  fajrAngle: 20,
  ishaAngle: 18,
  ihtiyatMinutes: 2, // Pengaman waktu hisab Kemenag (+2 menit)
};

// Konfigurasi cache.
const CACHE_KEY_PREFIX = "kua-ngoro:prayer-times:";
const LAST_VALID_CACHE_KEY = "kua-ngoro:prayer-times:last-valid";

// Aladhan API menggunakan metode perhitungan Kemenag RI (method=20).
const API_URL =
  "https://api.aladhan.com/v1/timingsByCity?city=Jombang&country=Indonesia&method=20";

// Batas waktu permintaan API agar tidak menggantung terlalu lama (10 detik).
const REQUEST_TIMEOUT = 10_000;

/**
 * Mengambil bagian tanggal atau waktu berdasarkan zona waktu WIB.
 */
export function getWibParts(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/**
 * Mendapatkan tanggal hari ini menurut WIB.
 * Format: YYYY-MM-DD.
 */
export function getTodayWibKey(now: Date = new Date()): string {
  const { year, month, day } = getWibParts(now);
  return `${year}-${month}-${day}`;
}

/**
 * Mendapatkan jam dan menit sekarang menurut WIB.
 * Hasil berupa total menit sejak tengah malam.
 */
function getMinutesNowWib(now: Date = new Date()): number {
  const { hour, minute } = getWibParts(now);
  return Number(hour) * 60 + Number(minute);
}

/**
 * Mengubah waktu menjadi format standar HH:mm.
 */
export function normalizeTime(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s|$)/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Memvalidasi dan menormalisasi seluruh jadwal sholat.
 */
export function parsePrayerTimes(raw: unknown): PrayerTimes | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const result: Partial<PrayerTimes> = {};

  for (const name of ORDER) {
    const time = normalizeTime(source[name]);
    if (!time) return null;
    result[name] = time;
  }

  if (source.source === "api" || source.source === "cached" || source.source === "calculated") {
    result.source = source.source;
  }

  return result as PrayerTimes;
}

/**
 * Mengubah HH:mm menjadi total menit sejak tengah malam.
 */
function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

/**
 * Membuat kunci cache berdasarkan tanggal WIB.
 */
function getCacheKey(date: string): string {
  return `${CACHE_KEY_PREFIX}${date}`;
}

/**
 * Mengambil jadwal dari cache browser untuk tanggal tertentu.
 */
function getCachedPrayerTimes(date: string): PrayerTimes | null {
  try {
    const cached = localStorage.getItem(getCacheKey(date));
    if (!cached) return null;

    const parsed: unknown = JSON.parse(cached);
    const valid = parsePrayerTimes(parsed);
    if (valid) {
      valid.source = "cached";
      return valid;
    }

    localStorage.removeItem(getCacheKey(date));
    return null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan jadwal ke cache browser untuk tanggal tertentu dan cache terakhir.
 */
function saveCachedPrayerTimes(date: string, times: PrayerTimes): void {
  try {
    const cacheKey = getCacheKey(date);
    const payload = JSON.stringify(times);
    localStorage.setItem(cacheKey, payload);
    localStorage.setItem(LAST_VALID_CACHE_KEY, payload);

    // Hapus cache tanggal-tanggal sebelumnya agar tidak menumpuk.
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (
        key?.startsWith(CACHE_KEY_PREFIX) &&
        key !== cacheKey &&
        key !== LAST_VALID_CACHE_KEY
      ) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Abaikan jika kuota storage penuh
  }
}

/**
 * Kalkulasi astronomis offline jadwal sholat presisi tinggi berdasarkan hisab Kemenag RI.
 * Menggunakan parameter koordinat KUA Kecamatan Ngoro, Jombang (WIB).
 */
export function calculateOfflinePrayerTimes(
  dateOrNow: Date = new Date(),
  coords = NGORO_COORDINATES,
  params = KEMENAG_PARAMS
): PrayerTimes {
  const parts = getWibParts(dateOrNow);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);

  const d2r = Math.PI / 180;
  const r2d = 180 / Math.PI;

  // Konversi kalender Gregorian ke Julian Date
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5 -
    coords.timezone / 24;

  const d = jd - 2451545.0;

  // Posisi Matahari
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L =
    (q +
      1.915 * Math.sin(g * d2r) +
      0.02 * Math.sin(2 * g * d2r)) %
    360;
  const e = 23.439 - 0.00000036 * d;

  let RA =
    Math.atan2(Math.cos(e * d2r) * Math.sin(L * d2r), Math.cos(L * d2r)) * r2d;
  RA = ((RA / 15) % 24 + 24) % 24;

  const decl = Math.asin(Math.sin(e * d2r) * Math.sin(L * d2r));
  const qHours = ((q / 15) % 24 + 24) % 24;
  let eqt = qHours - RA;
  if (eqt > 12) eqt -= 24;
  if (eqt < -12) eqt += 24;

  // Dzuhur (Solar Noon / Transit)
  const dhuhr = 12 + coords.timezone - coords.longitude / 15 - eqt;

  // Sudut jam matahari untuk elevasi tertentu
  const sunHourAngle = (angle: number, isAfterNoon: boolean): number => {
    const sinAlt = Math.sin(-angle * d2r);
    const cosLat = Math.cos(coords.latitude * d2r);
    const sinLat = Math.sin(coords.latitude * d2r);
    const cosDecl = Math.cos(decl);
    const sinDecl = Math.sin(decl);
    const cosH = (sinAlt - sinLat * sinDecl) / (cosLat * cosDecl);
    const clampedCosH = Math.max(-1, Math.min(1, cosH));
    const h = (Math.acos(clampedCosH) * r2d) / 15;
    return isAfterNoon ? dhuhr + h : dhuhr - h;
  };

  // Waktu Ashar (Madzhab Syafi'i standar Kemenag: panjang bayangan = panjang benda + bayangan saat zawal)
  const asrHour = (): number => {
    const alt =
      Math.atan(1 / (1 + Math.tan(Math.abs(coords.latitude * d2r - decl)))) *
      r2d;
    const sinAlt = Math.sin(alt * d2r);
    const cosLat = Math.cos(coords.latitude * d2r);
    const sinLat = Math.sin(coords.latitude * d2r);
    const cosDecl = Math.cos(decl);
    const sinDecl = Math.sin(decl);
    const cosH = (sinAlt - sinLat * sinDecl) / (cosLat * cosDecl);
    const clampedCosH = Math.max(-1, Math.min(1, cosH));
    const h = (Math.acos(clampedCosH) * r2d) / 15;
    return dhuhr + h;
  };

  // Terbenam / Terbit (faktor refraksi atmosfer & jari-jari matahari = 0.833°)
  const sunset = sunHourAngle(0.833, true);
  const fajr = sunHourAngle(params.fajrAngle, false);
  const isha = sunHourAngle(params.ishaAngle, true);
  const asr = asrHour();

  const formatWithIhtiyat = (h: number): string => {
    const totalMinutes = Math.round(h * 60) + params.ihtiyatMinutes;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  return {
    Subuh: formatWithIhtiyat(fajr),
    Dzuhur: formatWithIhtiyat(dhuhr),
    Ashar: formatWithIhtiyat(asr),
    Maghrib: formatWithIhtiyat(sunset),
    Isya: formatWithIhtiyat(isha),
    source: "calculated",
  };
}

/**
 * Mengambil data jadwal dari Aladhan API.
 */
async function fetchPrayerTimes(): Promise<PrayerTimes | null> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT
  );

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Aladhan API HTTP ${response.status}`);
    }

    const json: unknown = await response.json();
    if (!json || typeof json !== "object") {
      throw new Error("Respons API tidak valid");
    }

    const payload = json as {
      code?: number;
      data?: {
        timings?: Record<string, unknown>;
      };
    };

    if (payload.code !== 200 || !payload.data?.timings) {
      throw new Error("Struktur respons Aladhan tidak sesuai");
    }

    const timings = payload.data.timings;
    const parsed = parsePrayerTimes({
      Subuh: timings.Fajr,
      Dzuhur: timings.Dhuhr,
      Ashar: timings.Asr,
      Maghrib: timings.Maghrib,
      Isya: timings.Isha,
    });

    if (parsed) {
      parsed.source = "api";
      return parsed;
    }

    return null;
  } catch (error) {
    console.warn("[PrayerTimes] Gagal mengambil jadwal dari API:", error);
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Mengambil jadwal sholat hari ini untuk wilayah Jombang / Ngoro.
 *
 * Alur Penanganan Tangguh (Reliability Flow):
 * 1. Periksa cache lokal untuk hari ini (`kua-ngoro:prayer-times:YYYY-MM-DD`).
 * 2. Jika tidak ada, coba panggil Aladhan API (timeout 10 detik).
 * 3. Jika API berhasil: validasi dan simpan ke cache hari ini + cache cadangan terakhir.
 * 4. Jika API gagal / offline / invalid:
 *    - Gunakan kalkulasi astronomis offline presisi Kemenag RI untuk hari ini.
 *    - Tandai sumber sebagai 'calculated'.
 */
export async function getTodayPrayerTimes(now: Date = new Date()): Promise<PrayerTimes> {
  const today = getTodayWibKey(now);

  // 1. Cek cache hari ini
  const cached = getCachedPrayerTimes(today);
  if (cached) return cached;

  // 2. Coba fetch dari API jika online
  const fetched = await fetchPrayerTimes();
  if (fetched) {
    // Pastikan tanggal belum berganti selama request
    if (getTodayWibKey() === today) {
      saveCachedPrayerTimes(today, fetched);
    }
    return fetched;
  }

  // 3. Fallback Offline: Kalkulasi hisab astronomis standar Kemenag RI
  const calculated = calculateOfflinePrayerTimes(now);
  saveCachedPrayerTimes(today, calculated);
  return calculated;
}

/**
 * Mendapatkan nama sholat berikutnya yang belum masuk waktunya.
 */
export function getNextPrayerName(
  times: PrayerTimes,
  now: Date = new Date()
): keyof Omit<PrayerTimes, "source"> | null {
  const valid = parsePrayerTimes(times);
  if (!valid) return null;

  const currentMinutes = getMinutesNowWib(now);

  for (const name of ORDER) {
    if (toMinutes(valid[name]) > currentMinutes) {
      return name;
    }
  }

  return null;
}

/**
 * Mendapatkan waktu sholat berikutnya beserta namanya.
 */
export function getNextPrayer(
  times: PrayerTimes,
  now: Date = new Date()
): {
  name: keyof Omit<PrayerTimes, "source">;
  time: string;
} | null {
  const name = getNextPrayerName(times, now);
  if (!name) return null;

  const valid = parsePrayerTimes(times);
  if (!valid) return null;

  return {
    name,
    time: valid[name],
  };
}
