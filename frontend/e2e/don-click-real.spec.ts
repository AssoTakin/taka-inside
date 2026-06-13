import { test, expect } from '@playwright/test';

test('test clic dons alias actuel', async ({ page }) => {
  await page.goto('/faire-un-don?_t=123456789');
  
  // Attendre le chargement complet
  await page.waitForSelector('button:has-text("25 €")', { timeout: 10000 });
  
  // Vérifier la classe avant clic
  const btnBefore = await page.locator('button:has-text("25 €")').getAttribute('class');
  console.log('Class before:', btnBefore);
  
  // Clic
  await page.locator('button:has-text("25 €")').click();
  await page.waitForTimeout(1000);
  
  // Vérifier la classe après clic
  const btnAfter = await page.locator('button:has-text("25 €")').getAttribute('class');
  console.log('Class after:', btnAfter);
  
  // Vérifier que le montant affiché a changé
  const montantText = await page.locator('#amount-display').textContent();
  console.log('Montant affiché:', montantText);
  
  expect(montantText).toContain('25');
});
