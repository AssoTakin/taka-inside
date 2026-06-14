import { test, expect } from '@playwright/test';

test('don page click test', async ({ page }) => {
  await page.goto('/faire-un-don');
  
  // Click 25€ button using Playwright real click
  await page.locator('button:has-text("25 €")').click();
  await page.waitForTimeout(500);
  
  // Verify the selection visually
  const selectedBtn = page.locator('button:has-text("25 €")');
  const className = await selectedBtn.getAttribute('class');
  console.log('Button class after click:', className);
  
  // Check if it has the selected styling
  expect(className).toContain('selected');
});
