
import { test, expect } from "@playwright/test";

const API_URL = "/api/analytics";

test("GET analytics tanpa login harus ditolak", async ({ request }) => {
  const response = await request.get(`${API_URL}?days=7`);

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.success).toBe(false);
});

test("POST analytics harus ditolak", async ({ request }) => {
  const response = await request.post(`${API_URL}?days=7`);

  expect(response.status()).toBe(405);
});

test("GET analytics dengan token palsu harus ditolak", async ({
  request,
}) => {
  const response = await request.get(`${API_URL}?days=7`, {
    headers: {
      Authorization: "Bearer token-palsu-untuk-pengujian",
    },
  });

  expect(response.status()).toBe(401);
});