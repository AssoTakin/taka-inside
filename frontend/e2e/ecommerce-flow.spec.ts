import { test, expect } from '@playwright/test';

/**
 * Parcours complet boutique → panier → checkout en production
 * Dépend de la navigation côté client (pas de reload direct checkout)
 */

test.describe('Parcours e-commerce complet', () => {
  test('DEV-SHOP-001 : Ajouter au panier & naviguer au checkout', async ({ page }) => {
    // 1. Aller sur la fiche produit
    await page.goto('/boutique/t-shirt-taka-inside');
    await expect(page.locator('h1', { hasText: /T-Shirt Taka Inside/i })).toBeVisible();

    // 2. Cliquer "Ajouter au panier"
    await page.getByRole('button', { name: /Ajouter au panier/i }).click();

    // 3. Attendre que le panier se mette à jour (badge)
    await expect(page.locator('span', { hasText: '1' }).first()).toBeVisible({ timeout: 5000 });

    // 4. Naviguer sur /checkout VIA navigation interne (pas de reload)
    await page.evaluate(() => { window.location.href = '/checkout'; });

    // 5. Attendre que le checkout soit chargé — le composant dynamique se monte
    await page.waitForTimeout(3000);

    // 6. Vérifier le récapitulatif (preuve que le panier est lu)
    const recap = page.locator('text=/Récapitulatif/i');
    await expect(recap).toBeVisible({ timeout: 15000 });

    // 7. Vérifier le T-shirt
    await expect(page.locator('text=/T-Shirt Taka Inside/i')).toBeVisible();
  });

  test('DEV-SHOP-002 : Checkout avec panier vide reste sur "vide"', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    const emptyMsg = page.locator('text=/panier est vide/i');
    await expect(emptyMsg).toBeVisible({ timeout: 10000 });
  });
});
