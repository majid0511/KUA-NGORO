
/**
 * JADWAL SHOLAT HARIAN
 *
 * Mengambil jadwal sholat Kabupaten Jombang melalui Aladhan API.
 *
 * Fitur:
 * - Zona waktu Asia/Jakarta (WIB).
 * - Metode perhitungan Kemenag RI (method=20).
 * - Validasi dan normalisasi data API.
 * - Cache localStorage berdasarkan tanggal WIB.
 * - Validasi ulang data cache.
 * - Menentukan waktu sholat berikutnya.
 * - Mendukung pengujian dengan parameter Date.
 *
 * Catatan:
 * Jadwal Aladhan tetap perlu dicocokkan dengan jadwal resmi
 * Bimas Islam/Kemenag untuk wilayah Ngoro, Jombang.
 */

// Lima waktu sholat wajib dalam format HH:mm.
export interface PrayerTimes {
  Subuh: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

// Urutan waktu sholat.
const ORDER: (keyof PrayerTimes)[] = [
  "Subuh",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

// Konfigurasi zona waktu.
const WIB = "Asia/Jakarta";

// Konfigurasi cache.
const CACHE_KEY_PREFIX = "kua-ngoro:prayer-times:";

// Aladhan API menggunakan metode perhitungan Kemenag RI.
const API_URL =
  "https://api.aladhan.com/v1/timingsByCity?city=Jombang&country=Indonesia&method=20";

// Batas waktu permintaan API agar tidak menggantung terlalu lama.
const REQUEST_TIMEOUT = 10_000;

// Cache dianggap hanya berlaku untuk tanggal WIB yang sesuai.

/**
 * Mengambil bagian tanggal atau waktu berdasarkan zona waktu WIB.
 */
function getWibParts(now: Date = new Date()) {
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
 * Mengubah waktu menjadi HH:mm.
 *
 * Menerima:
 * - 4:05
 * - 04:05
 * - 04:05 (WIB)
 *
 * Menolak:
 * - 24:00
 * - 12:60
 * - 04:05abc
 * - Nilai selain string.
 */
function normalizeTime(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const match = value.trim().match(
    /^(\d{1,2}):(\d{2})(?:\s|$)/
  );

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
 *
 * Jika salah satu waktu tidak tersedia atau tidak valid,
 * seluruh jadwal dianggap tidak tersedia.
 */
export function parsePrayerTimes(raw: unknown): PrayerTimes | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const result = {} as PrayerTimes;

  for (const name of ORDER) {
    const time = normalizeTime(source[name]);

    if (!time) return null;

    result[name] = time;
  }

  return result;
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
 * Mengambil jadwal dari cache browser.
 *
 * Data cache tetap divalidasi sebelum digunakan.
 */
function getCachedPrayerTimes(date: string): PrayerTimes | null {
  try {
    const cached = localStorage.getItem(getCacheKey(date));

    if (!cached) return null;

    const parsed: unknown = JSON.parse(cached);
    const valid = parsePrayerTimes(parsed);

    if (valid) return valid;

    // Hapus cache jika formatnya tidak valid.
    localStorage.removeItem(getCacheKey(date));

    return null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan jadwal ke cache browser.
 *
 * Cache lama milik fitur ini dibersihkan agar tidak menumpuk.
 */
function saveCachedPrayerTimes(
  date: string,
  times: PrayerTimes
): void {
  try {
    const cacheKey = getCacheKey(date);

    localStorage.setItem(cacheKey, JSON.stringify(times));

    // Hapus cache tanggal sebelumnya.
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);

      if (
        key?.startsWith(CACHE_KEY_PREFIX) &&
        key !== cacheKey
      ) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Kegagalan cache tidak boleh merusak situs.
  }
}

/**
 * Mengambil data jadwal dari Aladhan API.
 *
 * Menggunakan AbortController untuk membatasi waktu permintaan.
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

    // Pemetaan nama waktu API ke bahasa Indonesia.
    return parsePrayerTimes({
      Subuh: timings.Fajr,
      Dzuhur: timings.Dhuhr,
      Ashar: timings.Asr,
      Maghrib: timings.Maghrib,
      Isya: timings.Isha,
    });
  } catch (error) {
    console.warn(
      "[PrayerTimes] Gagal mengambil jadwal:",
      error
    );

    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Mengambil jadwal sholat hari ini untuk wilayah Jombang.
 *
 * Alur:
 * 1. Tentukan tanggal berdasarkan WIB.
 * 2. Periksa cache.
 * 3. Jika cache tidak tersedia, ambil dari API.
 * 4. Validasi data.
 * 5. Simpan data valid ke cache.
 *
 * Mengembalikan null jika jadwal gagal diperoleh.
 */
export async function getTodayPrayerTimes(): Promise<PrayerTimes | null> {
  const today = getTodayWibKey();

  // Gunakan cache jika tersedia dan valid.
  const cached = getCachedPrayerTimes(today);

  if (cached) return cached;

  // Ambil jadwal terbaru dari API.
  const fetched = await fetchPrayerTimes();

  if (!fetched) return null;

  // Pastikan tanggal belum berubah selama proses fetch.
  if (getTodayWibKey() !== today) {
    return getTodayPrayerTimes();
  }

  // Simpan hanya data yang sudah tervalidasi.
  saveCachedPrayerTimes(today, fetched);

  return fetched;
}

/**
 * Mendapatkan nama sholat berikutnya yang belum masuk waktunya.
 *
 * Mengembalikan:
 * - Subuh
 * - Dzuhur
 * - Ashar
 * - Maghrib
 * - Isya
 * - null jika seluruh waktu sholat hari ini telah berlalu.
 *
 * Parameter now dapat digunakan untuk pengujian.
 */
export function getNextPrayerName(
  times: PrayerTimes,
  now: Date = new Date()
): keyof PrayerTimes | null {
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
 *
 * Berguna jika nantinya UI membutuhkan informasi waktu
 * untuk countdown atau indikator tambahan.
 */
export function getNextPrayer(
  times: PrayerTimes,
  now: Date = new Date()
): {
  name: keyof PrayerTimes;
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
