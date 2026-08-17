import { test, expect } from '@playwright/test';

test('dons avec configs serveur', async ({ page }) => {
  await page.goto('/faire-un-don?_cache=20250701');
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  console.log('Has 25 €:', html.includes('25 €'));
  console.log('Has 15 €:', html.includes('15 €'));
  console.log('Has Don ponctuel:', html.includes('Don ponctuel'));
  console.log('Has Don mensuel:', html.includes('Don mensuel'));
  
  // Click 25€
  await page.locator('button:has-text("25 €")').click();
  await page.waitForTimeout(500);

  const text = (await page.locator('body').textContent()) ?? '';
  console.log('After click, has 15 € selected:', text.includes('15 €'));
  console.log('After click, has 25 €:', text.includes('25 €'));
});
