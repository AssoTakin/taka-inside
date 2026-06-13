import { test, expect } from '@playwright/test';

test('checkout avec panier', async ({ page, context }) => {
  // Injecter le panier avant navigation
  await context.addInitScript(() => {
    localStorage.setItem('taka-cart', JSON.stringify([
      {"id":2,"documentId":"f42g5tnnp3lyhq3whjebjken","name":"T-Shirt Taka Inside","price":25,"quantity":1,"slug":"t-shirt-taka-inside","type":"merch","image":"/images/logo-taka-inside.jpg"}
    ]));
  });

  await page.goto('https://frontend-ngodphc48-sam-takas-projects.vercel.app/checkout');
  
  // Attendre que le chargement disparaisse
  await page.waitForFunction(() => !document.body.innerText.includes('Chargement du panier'), { timeout: 15000 });
  
  // Attendre le récapitulatif
  const recap = page.locator('text=/Récapitulatif/i');
  await expect(recap).toBeVisible({ timeout: 10000 });
  
  // Vérifier le T-shirt
  await expect(page.locator('text=/T-Shirt Taka Inside/i')).toBeVisible();
});
