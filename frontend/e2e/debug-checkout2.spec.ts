import { test, expect } from '@playwright/test';

test('debug checkout hydrate', async ({ page, context }) => {
  // Injecter le panier
  await context.addInitScript(() => {
    localStorage.setItem('taka-cart', JSON.stringify([
      {"id":2,"documentId":"f42g5tnnp3lyhq3whjebjken","name":"T-Shirt Taka Inside","price":25,"quantity":1,"slug":"t-shirt-taka-inside","type":"merch","image":"/images/logo-taka-inside.jpg"}
    ]));
  });

  // Capturer les erreurs
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/checkout');

  // Attendre 5s
  await page.waitForTimeout(5000);

  const text = await page.locator('body').textContent() ?? '';
  console.log('Body text:', text.substring(0, 300));
  console.log('Errors:', errors);
  console.log('Has Chargement du panier:', text.includes('Chargement du panier'));
  console.log('Has Récapitulatif:', text.includes('Récapitulatif'));
  console.log('Has vide:', text.includes('panier est vide'));
});
