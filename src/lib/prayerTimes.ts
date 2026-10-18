// JADWAL SOLAT HARIAN: mengambil waktu sholat hari ini dari layanan Aladhan API (untuk Kabupaten Jombang) dan menentukan sholat berikutnya.
// Dipakai oleh komponen PrayerTimesBar (strip hijau di bawah navbar).
//
// Prinsip keamanan: data dari API / cache browser TIDAK dipercaya begitu saja. Semua waktu diperiksa dan dirapikan
// ke format "HH:MM"; jika ada yang tidak valid, jadwal dianggap tidak tersedia (strip disembunyikan), situs tetap normal.
// Seluruh perhitungan memakai zona waktu WIB (Asia/Jakarta), bukan zona waktu perangkat pengunjung.

/**
 * Lima waktu sholat wajib dalam format "HH:MM" (24 jam, WIB)
 */
export interface PrayerTimes {
  Subuh: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

/** Urutan waktu sholat dalam sehari */
const ORDER: (keyof PrayerTimes)[] = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

const WIB = 'Asia/Jakarta';

/**
 * Merapikan satu waktu dari API menjadi "HH:MM". Menerima "4:05", "04:05", atau "04:05 (WIB)".
 * Mengembalikan null jika bukan jam yang valid (bukan teks, di luar 00:00-23:59, dst.).
 */
function normalizeTime(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const m = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/**
 * Memeriksa dan merapikan satu set jadwal (dari API atau cache). Mengembalikan null jika ADA satu saja waktu
 * yang hilang/tidak valid, sehingga data setengah rusak tidak pernah sampai ke tampilan.
 */
export function parsePrayerTimes(raw: unknown): PrayerTimes | null {
  if (!raw || typeof raw !== 'object') return null;
  const src = raw as Record<string, unknown>;
  const out = {} as PrayerTimes;
  for (const name of ORDER) {
    const t = normalizeTime(src[name]);
    if (!t) return null;
    out[name] = t;
  }
  return out;
}

/** Tanggal hari ini menurut WIB, format YYYY-MM-DD (dipakai sebagai bagian kunci cache) */
function todayKeyWib(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: WIB, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Jam & menit saat ini menurut WIB, dalam total menit sejak tengah malam */
function minutesNowWib(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: WIB, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
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
  // Tanggal hari ini (WIB), format YYYY-MM-DD, dipakai sebagai bagian kunci cache
  const todayKey = todayKeyWib();
  const cacheKey = CACHE_KEY_PREFIX + todayKey;

  try {
    // Jika jadwal hari ini sudah tersimpan di browser DAN isinya valid, langsung pakai (tanpa menghubungi API lagi)
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const valid = parsePrayerTimes(JSON.parse(cached));
      if (valid) return valid;
      localStorage.removeItem(cacheKey); // isi cache rusak/tidak lengkap -> buang, ambil ulang dari API
    }
  } catch {
    // localStorage tidak tersedia / isi tidak bisa dibaca — lanjut fetch dari API
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
    // lalu periksa & rapikan; jika ada yang tidak valid, anggap gagal (strip disembunyikan) -- jangan sampai merusak halaman
    const times = parsePrayerTimes({
      Subuh: t.Fajr,
      Dzuhur: t.Dhuhr,
      Ashar: t.Asr,
      Maghrib: t.Maghrib,
      Isya: t.Isha,
    });
    if (!times) throw new Error('Waktu sholat dari API tidak lengkap / tidak valid');

    try {
      // Simpan jadwal hari ini di browser agar kunjungan berikutnya di hari yang sama tidak memanggil API lagi
      localStorage.setItem(cacheKey, JSON.stringify(times));
      // Bersihkan jadwal hari-hari sebelumnya supaya penyimpanan browser tidak menumpuk
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_KEY_PREFIX) && k !== cacheKey) localStorage.removeItem(k);
      }
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
 * Nama sholat BERIKUTNYA yang belum terjadi hari ini (bukan yang baru lewat), dihitung menurut jam WIB
 * (bukan jam perangkat). null jika sudah lewat Isya -- tidak ada lagi waktu sholat untuk disorot
 * hingga Subuh besok (jadwalnya beda tanggal, di luar cakupan data hari ini) -- atau jika data jadwal tidak valid.
 * Parameter "now" opsional (untuk pengujian); bawaannya waktu sekarang.
 */
export function getNextPrayerName(times: PrayerTimes, now: Date = new Date()): keyof PrayerTimes | null {
  const valid = parsePrayerTimes(times);
  if (!valid) return null;

  const nowMinutes = minutesNowWib(now);
  // Mengubah "HH:MM" menjadi total menit sejak tengah malam agar mudah dibandingkan
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  // Cari waktu sholat pertama (menurut urutan) yang belum masuk waktunya
  for (const name of ORDER) {
    if (toMinutes(valid[name]) > nowMinutes) return name;
  }
  return null;
}
