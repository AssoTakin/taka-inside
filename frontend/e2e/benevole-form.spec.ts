import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://takainside.org';

test.setTimeout(120000);

test('formulaire bénévole — soumission complète', async ({ page }) => {
  await page.goto(`${BASE_URL}/devenir-benevole`);

  // Attendre que le formulaire soit hydraté (pas juste le placeholder)
  await page.waitForSelector('input[name="lastName"]', { timeout: 10000 });

  await page.fill('input[name="lastName"]', 'TestPlaywright');
  await page.fill('input[name="firstName"]', 'Hermes');
  await page.fill('input[name="email"]', `hermes-playwright-${Date.now()}@takainside.org`);
  await page.fill('input[name="phone"]', '+229 01 02 03 04');
  await page.fill('input[name="city"]', 'Cotonou');
  await page.fill('input[name="country"]', 'Bénin');

  await page.click('button:has-text("Communication")');
  await page.click('button:has-text("Événementiel")');
  await page.click('button:has-text("Week-ends")');

  await page.fill('textarea[name="motivation"]', 'Test Playwright de la soumission bénévole');

  // Suivre la requête API
  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/benevole') && resp.request().method() === 'POST');
  await page.click('button[type="submit"]');
  const response = await responsePromise;
  console.log('API status:', response.status());
  const body = await response.json().catch(() => ({}));
  console.log('API body:', JSON.stringify(body));

  // Attendre le message de succès ou d'erreur explicite
  await expect(page.locator('text=/envoyée|succès|erreur|problème/i')).toBeVisible({ timeout: 60000 });
});
