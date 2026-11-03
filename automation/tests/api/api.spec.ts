import { test, expect, type APIResponse } from '@playwright/test';
import { randomLabel } from '../helpers/random-name';

const CHECK = '/domain-search/v2/check-domain-availability';

test('API-01 Taken name', { tag: ['@api'] }, async ({ request }) => {
  let response!: APIResponse;

  await test.step('GET …/check-domain-availability?domain=google.com with header Authorization: <WIX_API_KEY>', async () => {
    response = await request.get(CHECK, { params: { domain: 'google.com' } });
    expect(response.status()).toBe(200);
  });

  await test.step('Read the body', async () => {
    const body = await response.json();
    expect(body.availability.domain).toBe('google.com');
    expect(body.availability.available).toBe(false);
  });
});

test('API-02 Free name', { tag: ['@api'] }, async ({ request }) => {
  const domain = `${randomLabel()}.com`;
  let response!: APIResponse;

  await test.step('GET …/check-domain-availability?domain=<random name>.com with header Authorization: <WIX_API_KEY>', async () => {
    response = await request.get(CHECK, { params: { domain } });
    expect(response.status()).toBe(200);
  });

  await test.step('Read the body', async () => {
    const body = await response.json();
    expect(body.availability.domain).toBe(domain);
    expect(body.availability.available).toBe(true);
  });
});
