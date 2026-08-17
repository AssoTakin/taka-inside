import { test, expect } from '@playwright/test';

test('Console log during checkout', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text().slice(0, 200));
  });
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message.slice(0, 200));
  });

  await page.goto('/checkout');
  await page.waitForTimeout(3000);

  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log(e));
  console.log('Total errors:', errors.length);

  const hasFinaliser = await page.locator('text=/Finaliser/i').count() > 0;
  const hasVide = await page.locator('text=/panier est vide/i').count() > 0;
  console.log('Has Finaliser:', hasFinaliser);
  console.log('Has vide:', hasVide);
});
