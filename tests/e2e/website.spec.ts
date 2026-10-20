
import { test, expect } from "@playwright/test";

// Stub jadwal waktu sholat agar tes tidak memanggil Aladhan atau bergantung pada jam/cache.
const prayerTimesResponse = {
  code: 200,
  status: "OK",
  data: {
    timings: {
      Fajr: "04:00",
      Dhuhr: "11:30",
      Asr: "15:00",
      Maghrib: "17:30",
      Isha: "19:00",
    },
  },
};

test.beforeEach(async ({ page }) => {
  // Hanya izinkan server lokal dan stub Aladhan; blokir semua request eksternal lain.
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());

    if (url.hostname === "127.0.0.1") {
      await route.continue();
      return;
    }

    if (
      url.origin === "https://api.aladhan.com" &&
      url.pathname === "/v1/timingsByCity"
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(prayerTimesResponse),
      });
      return;
    }

    await route.abort();
  });
});

// Daftar halaman publik berdasarkan rute di src/App.tsx.
const pages = [
  { path: "/", title: "Beranda" },
  { path: "/profil", title: "Profil KUA" },
  { path: "/layanan", title: "Layanan" },
  { path: "/layanan/pernikahan", title: "Layanan Pernikahan" },
  { path: "/informasi", title: "Informasi & Berita" },
  { path: "/kegiatan", title: "Galeri Kegiatan" },
  { path: "/kontak", title: "Kontak" },
];

for (const route of pages) {
  test(`Halaman ${route.title} tampil dengan benar`, async ({
    page,
  }, testInfo) => {
    // Catat error JavaScript yang benar-benar terjadi di browser.
    const pageErrors: string[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    // Buka halaman target.
    await page.goto(route.path);

    // Pastikan judul tab sesuai metadata halaman.
    await expect(page).toHaveTitle(
      new RegExp(route.title, "i"),
    );

    // Pastikan konten utama dan judul halaman terlihat.
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1").first()).toBeVisible();

    // Periksa apakah halaman mengalami overflow horizontal.
    if (testInfo.project.name === "mobile-chromium") {
      const hasHorizontalOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          window.innerWidth + 2
        );
      });

      expect(
        hasHorizontalOverflow,
        "Ada konten yang melebar melewati layar HP",
      ).toBe(false);
    }

    // Ambil screenshot halaman penuh dan lampirkan ke laporan.
    const screenshotPath = testInfo.outputPath("halaman.png");

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: "disabled",
    });

    await testInfo.attach("Screenshot halaman", {
      path: screenshotPath,
      contentType: "image/png",
    });

    // Gagalkan tes jika browser mencatat error JavaScript.
    expect(
      pageErrors,
      `Error JavaScript:\n${pageErrors.join("\n")}`,
    ).toEqual([]);
  });
}

// Tes navigasi utama pada desktop.
test("Menu Profil membuka halaman Profil", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "Tes navigasi desktop saja",
  );

  await page.goto("/");

  // Cari tautan Profil yang terlihat pada navbar.
  await page.getByRole("link", { name: /Profil/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/profil\/?$/);
  await expect(page).toHaveTitle(/Profil KUA/i);
});