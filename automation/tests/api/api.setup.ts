import { test as setup } from '@playwright/test';

setup('WIX_API_KEY is set', () => {
  if (!process.env.WIX_API_KEY) {
    throw new Error('WIX_API_KEY is missing: copy automation/.env.example to automation/.env and fill it in.');
  }
});
