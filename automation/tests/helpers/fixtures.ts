import { test as base, expect, type APIResponse } from '@playwright/test';
import { randomLabel } from './random-name';

// One place for the endpoint path. Base URL and the Authorization header come from the `api` project in playwright.config.ts.
const CHECK = '/domain-search/v2/check-domain-availability';

type Fixtures = {
  // GET check-domain-availability for one domain, on the authenticated `request` context.
  checkDomain: (domain: string) => Promise<APIResponse>;
  // Fresh per test: 16 random lowercase letters + .com. Never regenerate it after a `false` answer; that would hide a bug.
  freeDomain: string;
};

export const test = base.extend<Fixtures>({
  checkDomain: async ({ request }, use) => {
    await use((domain) => request.get(CHECK, { params: { domain } }));
  },
  freeDomain: async ({}, use) => {
    await use(`${randomLabel()}.com`);
  },
});

export { expect };
