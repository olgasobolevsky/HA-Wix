import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Load automation/.env (git-ignored) relative to this file, not the shell's cwd.
const envFile = resolve(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

export default defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // Fails the run clearly when WIX_API_KEY is missing; runs only together with the api project.
      name: 'api-setup',
      testMatch: /api\.setup\.ts/,
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      dependencies: ['api-setup'],
      use: {
        baseURL: 'https://www.wixapis.com',
        extraHTTPHeaders: { Authorization: process.env.WIX_API_KEY ?? '' },
      },
    },
    {
      name: 'web',
      testMatch: /web\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.wix.com',
      },
    },
  ],
});
