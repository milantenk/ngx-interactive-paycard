import { test, expect } from '@playwright/test';

test.describe('ngx-interactive-paycard demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display 3 input elements', async ({ page }) => {
    const inputs = page.locator('input');
    await expect(inputs).toHaveCount(3);
  });

  test('should display 2 select elements', async ({ page }) => {
    const selects = page.locator('select');
    await expect(selects).toHaveCount(2);
  });

  test('should check if the submit button exists', async ({ page }) => {
    const button = page.locator('button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Submit');
  });
});
