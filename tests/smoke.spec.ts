import { test, expect, type Page } from '@playwright/test';

import { screenshotTestsEnabled } from '../src/utils/screenshot-tests';

/** Golden image filenames (stored under golden_images/). */
const LOCAL_FIXTURE_SNAPSHOT = 'local-fixture-page.png';
const LOCAL_VARIANT_SNAPSHOT = 'local-variant-page.png';

async function openLocalFixturePage(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright POC Fixture/i);
  await expect(page.getByRole('heading', { name: /Playwright in Docker POC/i })).toBeVisible();
  await expect(page.getByTestId('fixture-card')).toBeVisible();
}

async function openLocalVariantPage(page: Page): Promise<void> {
  await page.goto('/variant.html');
  await expect(page).toHaveTitle(/Playwright POC Variant/i);
  await expect(page.getByRole('heading', { name: /Comparison target page/i })).toBeVisible();
  await expect(page.getByTestId('variant-card')).toBeVisible();
}

test.describe('smoke', () => {
  test('loads local fixture page', async ({ page }) => {
    await openLocalFixturePage(page);
  });

  test('loads local variant page', async ({ page }) => {
    await openLocalVariantPage(page);
  });

  test.describe('screenshots', () => {
    test.skip(
      () => !screenshotTestsEnabled,
      'Golden image comparison is disabled locally. Use npm run test:docker or SCREENSHOT_TESTS=true.',
    );

    // Variant golden must exist before the cross-page comparison test runs.
    test.describe.configure({ mode: 'serial' });

    test('matches local fixture golden image', async ({ page }) => {
      await openLocalFixturePage(page);

      await expect(page).toHaveScreenshot(LOCAL_FIXTURE_SNAPSHOT, {
        animations: 'disabled',
        fullPage: true,
      });
    });

    test('matches local variant golden image', async ({ page }) => {
      await openLocalVariantPage(page);

      await expect(page).toHaveScreenshot(LOCAL_VARIANT_SNAPSHOT, {
        animations: 'disabled',
        fullPage: true,
      });
    });

    test('comparison: fixture page does not match variant golden image', async ({ page }) => {
      await openLocalFixturePage(page);

      await expect(page).not.toHaveScreenshot(LOCAL_VARIANT_SNAPSHOT, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  });
});
