export interface PrayerTimes {
  Subuh: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

const CACHE_KEY_PREFIX = 'kua-ngoro:prayer-times:';

/**
 * Jadwal sholat harian untuk Kabupaten Jombang (kota terdekat yang dikenali
 * Aladhan API — KUA Ngoro adalah kecamatan di dalamnya), method=20 (Kemenag RI).
 *
 * PENTING: method Kemenag di Aladhan API belum pernah kami verifikasi silang
 * dengan jadwal resmi Bimas Islam Kemenag. Sebelum dipakai publik, cocokkan
 * selisihnya (biasanya dalam hitungan menit) dengan jadwal resmi setempat.
 *
 * Di-cache di localStorage per tanggal supaya tidak memanggil API berulang
 * kali dalam satu hari yang sama.
 */
export async function getTodayPrayerTimes(): Promise<PrayerTimes | null> {
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + todayKey);
    if (cached) return JSON.parse(cached) as PrayerTimes;
  } catch {
    // localStorage tidak tersedia / isi rusak — lanjut fetch dari API
  }

  try {
    const res = await fetch(
      'https://api.aladhan.com/v1/timingsByCity?city=Jombang&country=Indonesia&method=20'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const t = json?.data?.timings;
    if (!t) throw new Error('Format respons tidak sesuai');

    const times: PrayerTimes = {
      Subuh: t.Fajr,
      Dzuhur: t.Dhuhr,
      Ashar: t.Asr,
      Maghrib: t.Maghrib,
      Isya: t.Isha,
    };

    try {
      localStorage.setItem(CACHE_KEY_PREFIX + todayKey, JSON.stringify(times));
    } catch {
      // kuota localStorage penuh atau diblokir — tidak fatal, lewati saja
    }

    return times;
  } catch (err) {
    console.warn('[PrayerTimes] Gagal mengambil jadwal sholat:', err);
    return null;
  }
}

/** Nama sholat yang sedang berlangsung sekarang (null jika belum Subuh / sudah lewat Isya tengah malam). */
export function getCurrentPrayerName(times: PrayerTimes): keyof PrayerTimes | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const order: (keyof PrayerTimes)[] = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
  let current: keyof PrayerTimes | null = null;
  for (const name of order) {
    if (nowMinutes >= toMinutes(times[name])) current = name;
  }
  return current;
}
