/**
 * Lima waktu sholat wajib dalam format "HH:MM" (24 jam)
 */
// JADWAL SOLAT HARIAN: mengambil waktu sholat hari ini dari layanan Aladhan API (untuk Kabupaten Jombang) dan menentukan sholat berikutnya.
// Dipakai oleh komponen PrayerTimesBar (strip hijau di bawah navbar).
export interface PrayerTimes {
  Subuh: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

// Awalan nama kunci penyimpanan di browser (localStorage); ditambah tanggal agar jadwal baru diambil tiap hari
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
  // Tanggal hari ini dalam format YYYY-MM-DD, dipakai sebagai bagian kunci cache
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    // Jika jadwal hari ini sudah tersimpan di browser, langsung pakai (tanpa menghubungi API lagi)
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + todayKey);
    if (cached) return JSON.parse(cached) as PrayerTimes;
  } catch {
    // localStorage tidak tersedia / isi rusak — lanjut fetch dari API
  }

  try {
    // Minta jadwal ke Aladhan API. method=20 adalah metode perhitungan Kemenag RI.
    const res = await fetch(
      'https://api.aladhan.com/v1/timingsByCity?city=Jombang&country=Indonesia&method=20'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const t = json?.data?.timings;
    if (!t) throw new Error('Format respons tidak sesuai');

    // Ambil lima waktu wajib dari jawaban API (nama Inggris -> Indonesia: Fajr=Subuh, Dhuhr=Dzuhur, Asr=Ashar, Isha=Isya)
    const times: PrayerTimes = {
      Subuh: t.Fajr,
      Dzuhur: t.Dhuhr,
      Ashar: t.Asr,
      Maghrib: t.Maghrib,
      Isya: t.Isha,
    };

    try {
      // Simpan jadwal hari ini di browser agar kunjungan berikutnya di hari yang sama tidak memanggil API lagi
      localStorage.setItem(CACHE_KEY_PREFIX + todayKey, JSON.stringify(times));
    } catch {
      // kuota localStorage penuh atau diblokir — tidak fatal, lewati saja
    }

    return times;
  } catch (err) {
    // Gagal (offline / API bermasalah): catat di konsol lalu kembalikan null -> strip jadwal disembunyikan, situs tetap normal
    console.warn('[PrayerTimes] Gagal mengambil jadwal sholat:', err);
    return null;
  }
}

/**
 * Nama sholat BERIKUTNYA yang belum terjadi hari ini (bukan yang baru lewat).
 * null jika sudah lewat Isya -- tidak ada lagi waktu sholat untuk disorot
 * hingga Subuh besok (jadwalnya beda tanggal, di luar cakupan data hari ini).
 */
export function getNextPrayerName(times: PrayerTimes): keyof PrayerTimes | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // Mengubah "HH:MM" menjadi total menit sejak tengah malam agar mudah dibandingkan
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  // Urutan waktu sholat dalam sehari; dipakai untuk mencari yang pertama belum masuk waktunya
  const order: (keyof PrayerTimes)[] = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
  for (const name of order) {
    if (toMinutes(times[name]) > nowMinutes) return name;
  }
  return null;
}
