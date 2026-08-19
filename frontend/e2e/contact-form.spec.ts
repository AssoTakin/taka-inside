import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://frontend-cbx85ilcr-sam-takas-projects.vercel.app';

test.setTimeout(120000);

test('formulaire de contact — soumission et envoi email', async ({ page }) => {
  await page.goto(`${BASE_URL}/contact`);

  await expect(page.locator('h1:has-text("Contact")')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('h2:has-text("Envoyez-nous un message")')).toBeVisible();

  // Le bouton est initialement désactivé tant que le formulaire est incomplet
  const submitButton = page.locator('button:has-text("Envoyer le message")');
  await expect(submitButton).toBeDisabled();

  await page.fill('input[name="nom"]', 'Hermes Contact Test');
  await page.fill('input[name="email"]', `hermes-contact-${Date.now()}@example.com`);
  await page.selectOption('select[name="sujet"]', 'Partenariat');
  await page.fill('textarea[name="message"]', 'Ceci est un test automatisé du formulaire de contact. Merci de ne pas tenir compte de ce message.');

  await expect(submitButton).toBeEnabled();

  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/contact') && resp.request().method() === 'POST');
  await submitButton.click();
  const response = await responsePromise;

  console.log('Contact API status:', response.status());
  const body = await response.json().catch(() => ({}));
  console.log('Contact API body:', JSON.stringify(body));

  expect(response.status()).toBe(200);
  expect(body).toHaveProperty('success', true);

  await expect(page.locator('text=/Message envoyé/i')).toBeVisible({ timeout: 30000 });
});
