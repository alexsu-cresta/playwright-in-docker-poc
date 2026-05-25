import path from 'path';

import { defineConfig, devices } from '@playwright/test';

const isHeadfulMode = process.env.HEADFUL_MODE === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  snapshotDir: path.join(__dirname, 'golden_images'),
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: process.env.CI ? 0.02 : 0.01,
    },
  },
  use: {
    headless: !isHeadfulMode,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
