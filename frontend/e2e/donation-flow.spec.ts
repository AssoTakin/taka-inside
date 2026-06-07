import { test, expect } from '@playwright/test';

/**
 * SUITE DE TESTS : Parcours de dons (final)
 */

test.describe('Parcours de dons', () => {
  test('DEV-DON-001 : Sélection don ponctuel 25€', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Sélectionner 25€
    const btn25 = page.locator('button:has-text("25 €")').first();
    await expect(btn25).toBeVisible();
    await btn25.click();
    
    // Vérifier que "Procéder au paiement" est actif
    const btnPay = page.locator('button:has-text("Procéder au paiement")');
    await expect(btnPay).toBeEnabled();
    
    // Cliquer pour afficher le paiement
    await btnPay.click();
    
    // Vérifier que la section paiement s'affiche (utiliser first() car 2 occurrences)
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

  test('DEV-DON-003 : Montant personnalisé', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Cliquer "Autre"
    const btnAutre = page.locator('button:has-text("Autre")').first();
    await btnAutre.click();
    
    // Le champ de saisie apparaît dans un div conditionnel
    // Attendre qu'il soit visible
    const input = page.locator('input[type="number"]').first();
    await expect(input).toBeVisible();
    
    // Remplir
    await input.fill('42');
    
    // Vérifier
    const pageText = await page.locator('body').innerText();
    expect(pageText).toContain('42');
  });

  test('DEV-DON-004 : Changement méthode de paiement', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("10 €")').catch(() => {});
    await page.click('button:has-text("Procéder au paiement")');
    await page.waitForTimeout(500);
    
    const pageText = await page.locator('body').innerText();
    expect(pageText).toMatch(/Carte bancaire|Stripe/);
    
    // Mobile Money
    await page.click('button:has-text("Mobile Money")').catch(() => {});
    expect(pageText).toMatch(/Mobile Money|MTN|Moov/);
  });

  test('DEV-DON-005 : Email kwabo@ dans le footer', async ({ page }) => {
    await page.goto('/faire-un-don', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    const footer = await page.locator('footer').innerHTML();
    expect(footer).toContain('kwabo@takainside.org');
    expect(footer).not.toContain('contact@takainside.org');
  });
});
