import { test, expect, type Page } from '@playwright/test';

import { screenshotTestsEnabled } from '../src/utils/screenshot-tests';

/** Golden image filenames (stored under golden_images/). */
const GOOGLE_HOMEPAGE_SNAPSHOT = 'google-homepage.png';
const CRESTA_HOMEPAGE_SNAPSHOT = 'cresta-homepage.png';

async function dismissCookieConsentIfPresent(page: Page): Promise<void> {
  const acceptPatterns = [/accept all/i, /accept cookies/i, /allow all/i, /got it/i];
  for (const pattern of acceptPatterns) {
    const button = page.getByRole('button', { name: pattern });
    if (
      await button
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await button.first().click();
      return;
    }
  }
}

async function openGoogleHomepage(page: Page): Promise<void> {
  await page.goto('https://www.google.com/?hl=en', { waitUntil: 'networkidle' });
  await dismissCookieConsentIfPresent(page);
  await expect(page).toHaveTitle(/Google/i);
  await expect(page.locator('[name="q"]').first()).toBeVisible();
}

async function openCrestaHomepage(page: Page): Promise<void> {
  await page.goto('https://www.cresta.com/', { waitUntil: 'networkidle' });
  await dismissCookieConsentIfPresent(page);
  await expect(page).toHaveTitle(/Cresta/i);
  await expect(page.getByRole('link', { name: /get a demo|request live demo|book live demo/i }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /AI agents|customer experience/i }).first()).toBeVisible();
}

test.describe('smoke', () => {
  test('loads Google homepage', async ({ page }) => {
    await openGoogleHomepage(page);
  });

  test('loads Cresta homepage', async ({ page }) => {
    await openCrestaHomepage(page);
  });

  test.describe('screenshots', () => {
    test.skip(
      () => !screenshotTestsEnabled,
      'Golden image comparison is disabled locally. Use npm run test:docker or SCREENSHOT_TESTS=true.',
    );

    test('matches Google homepage golden image', async ({ page }) => {
      await openGoogleHomepage(page);

      await expect(page).toHaveScreenshot(GOOGLE_HOMEPAGE_SNAPSHOT, {
        animations: 'disabled',
        fullPage: false,
      });
    });

    test('matches Cresta homepage golden image', async ({ page }) => {
      await openCrestaHomepage(page);

      await expect(page).toHaveScreenshot(CRESTA_HOMEPAGE_SNAPSHOT, {
        animations: 'disabled',
        fullPage: true,
      });
    });
  });
});
