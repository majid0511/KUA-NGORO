
import { test, expect } from "@playwright/test";

test("Analytics menolak pengunjung tanpa login", async ({
  request,
}) => {
  const response = await request.get(
    "/api/analytics?days=7",
  );

  expect(response.status()).toBe(401);

  const body = await response.json();

  expect(body.success).toBe(false);
  expect(body.error).toContain("admin");
});

test("Analytics menolak metode POST", async ({
  request,
}) => {
  const response = await request.post(
    "/api/analytics?days=7",
  );

  expect(response.status()).toBe(405);
});

test("Analytics menolak token palsu", async ({
  request,
}) => {
  const response = await request.get(
    "/api/analytics?days=7",
    {
      headers: {
        Authorization: "Bearer token-tidak-valid-untuk-tes",
      },
    },
  );

  expect(response.status()).toBe(401);
});