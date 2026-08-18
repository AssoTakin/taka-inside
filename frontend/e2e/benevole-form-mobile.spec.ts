import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://takainside.org';

test.setTimeout(120000);

test('formulaire bénévole — mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/devenir-benevole`);

  await page.waitForSelector('input[name="lastName"]', { timeout: 10000 });
  await expect(page.locator('h1:has-text("Devenir Bénévole")')).toBeVisible();

  await page.fill('input[name="lastName"]', 'Mobile');
  await page.fill('input[name="firstName"]', 'Test');
  await page.fill('input[name="email"]', `mobile-test-${Date.now()}@takainside.org`);
  await page.fill('input[name="city"]', 'Cotonou');

  await page.click('button:has-text("Musique")');
  await page.click('button:has-text("Temps plein")');

  await page.fill('textarea[name="motivation"]', 'Test mobile bénévole');

  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/benevole') && resp.request().method() === 'POST');
  await page.click('button[type="submit"]');
  const response = await responsePromise;
  console.log('Mobile API status:', response.status());
  const body = await response.json().catch(() => ({}));
  console.log('Mobile API body:', JSON.stringify(body));

  await expect(page.locator('text=/envoyée|succès|erreur|problème/i')).toBeVisible({ timeout: 60000 });
});
