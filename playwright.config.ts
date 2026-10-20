
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
let parsedBaseURL: URL;

try {
  parsedBaseURL = new URL(baseURL);
} catch {
  throw new Error("Playwright tests require a valid local base URL.");
}

if (
  parsedBaseURL.protocol !== "http:" ||
  parsedBaseURL.hostname !== "127.0.0.1" ||
  !parsedBaseURL.port ||
  parsedBaseURL.pathname !== "/" ||
  parsedBaseURL.username ||
  parsedBaseURL.password ||
  parsedBaseURL.search ||
  parsedBaseURL.hash
) {
  throw new Error(
    "Playwright is restricted to an HTTP 127.0.0.1 origin; tests were not started.",
  );
}

const localOrigin = parsedBaseURL.origin;
const localPort = parsedBaseURL.port;

export default defineConfig({
  // Lokasi seluruh skenario pengujian.
  testDir: "./tests/e2e",

  // Jalankan satu per satu agar tidak membebani website produksi.
  fullyParallel: false,
  workers: 1,
  retries: 0,

  // Simpan laporan dan bukti pengujian.
  outputDir: "./test-results",
  reporter: [
    ["list"],
    ["html", {
      outputFolder: "./playwright-report",
      open: "never",
    }],
  ],

  // Pengaturan umum browser.
  use: {
    baseURL: localOrigin,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,

    // Screenshot otomatis ketika tes gagal.
    screenshot: "only-on-failure",

    // Rekam langkah dan kondisi browser untuk investigasi bug.
    trace: "retain-on-failure",

    // Simpan video ketika tes gagal.
    video: "retain-on-failure",
  },

  // Jalankan hanya server lokal dan jangan biarkan aplikasi memakai konfigurasi Supabase dari .env.
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${localPort} --strictPort`,
    url: localOrigin,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_SITE_URL: localOrigin,
    },
  },

  // Tes di layar laptop dan layar HP.
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1365, height: 900 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
});