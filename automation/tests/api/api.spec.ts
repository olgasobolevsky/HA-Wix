import type { APIResponse } from '@playwright/test';
import { test, expect } from '../helpers/fixtures';

test('API-01 Taken name', { tag: ['@api'] }, async ({ checkDomain }) => {
  let response!: APIResponse;

  await test.step('GET …/check-domain-availability?domain=google.com with header Authorization: <WIX_API_KEY>', async () => {
    response = await checkDomain('google.com');
    expect(response.status()).toBe(200);
  });

  await test.step('Read the body', async () => {
    // Required fields only: extra fields in the response must not fail the test.
    expect(await response.json()).toMatchObject({
      availability: { domain: 'google.com', available: false },
    });
  });
});

test('API-02 Free name', { tag: ['@api'] }, async ({ checkDomain, freeDomain }) => {
  let response!: APIResponse;

  await test.step(`GET …/check-domain-availability?domain=${freeDomain} with header Authorization: <WIX_API_KEY>`, async () => {
    response = await checkDomain(freeDomain);
    expect(response.status()).toBe(200);
  });

  await test.step('Read the body', async () => {
    // Required fields only: extra fields in the response must not fail the test.
    expect(await response.json()).toMatchObject({
      availability: { domain: freeDomain, available: true },
    });
  });
});
