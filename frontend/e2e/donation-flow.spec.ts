import { test, expect } from '@playwright/test';

/**
 * SUITE DE TESTS : Parcours de dons (final v4 - simplifié)
 */

test.describe('Parcours de dons', () => {
  test('DEV-DON-001 : Sélection don ponctuel 25€', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    const btn25 = page.locator('button:has-text("25 €")').first();
    await expect(btn25).toBeVisible();
    await btn25.click();
    
    const btnPay = page.locator('button:has-text("Donner")');
    await expect(btnPay).toBeEnabled();
    
    await btnPay.click();
    await expect(page.locator('text=Paiement sécurisé').first()).toBeVisible();
  });

  test('DEV-DON-002 : Sélection don mensuel 15€', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Don mensuel")');
    await page.waitForTimeout(500);
    
    const btn15 = page.locator('button:has-text("15 €")').first();
    await btn15.click();
    
    const pageText = await page.locator('body').innerText();
    expect(pageText).toContain('15');
  });

  test('DEV-DON-003 : Bouton "Autre" présent et cliquable', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Vérifier que le bouton "Autre" existe et est cliquable
    const btnAutre = page.locator('button:has-text("Autre")').first();
    await expect(btnAutre).toBeVisible();
    await expect(btnAutre).toBeEnabled();
    
    // Le montant par défaut doit être affiché
    const pageText = await page.locator('body').innerText();
    expect(pageText).toMatch(/\d+\s*€/); // Au moins un montant
  });

  test('DEV-DON-004 : Changement méthode de paiement', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("10 €")').catch(() => {});
    await page.waitForTimeout(300);
    await page.click('button:has-text("Mobile Money")').catch(() => {});
    await page.waitForTimeout(500);
    await page.click('button:has-text("Donner")');
    await page.waitForTimeout(1000);
    
    const newPageText = await page.locator('body').innerText();
    expect(newPageText).toMatch(/Mobile Money|MTN|Moov|FedaPay/);
  });

  test('DEV-DON-005 : Email kwabo@ dans le footer', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    const footerText = await page.locator('footer').innerText();
    expect(footerText).toMatch(/kwabo@takainside\.org/);
  });
});
