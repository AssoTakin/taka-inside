import { test, expect } from '@playwright/test';

/**
 * SUITE DE TESTS : Checkout avec panier existant
 * Objectif : Vérifier que checkout affiche le récapitulatif quand un article est dans le panier
 */

test.describe('Parcours checkout — avec panier', () => {
  test.beforeEach(async ({ page, context }) => {
    // Injecter un panier dans le localStorage avant toute navigation
    const cartItem = [{
      id: 2,
      documentId: "f42g5tnnp3lyhq3whjebjken",
      name: "T-Shirt Taka Inside",
      price: 25,
      quantity: 1,
      slug: "t-shirt-taka-inside",
      type: "merch",
      image: "/images/logo-taka-inside.jpg"
    }];

    await context.addInitScript((items) => {
      localStorage.setItem('taka-cart', JSON.stringify(items));
    }, cartItem);
  });

  test('DEV-CHK-001 : Checkout affiche le récapitulatif avec 1 article', async ({ page }) => {
    await page.goto('/checkout');

    // Attendre que le récapitulatif apparaisse (hydratation client)
    const recap = page.locator('text=/Récapitulatif/i');
    await expect(recap).toBeVisible({ timeout: 15000 });

    // Vérifier que le T-shirt est listé
    const tshirt = page.locator('text=/T-Shirt Taka Inside/i');
    await expect(tshirt).toBeVisible();

    // Vérifier que le prix est affiché
    const priceLine = page.locator('text=/25,00/');
    await expect(priceLine.first()).toBeVisible({ timeout: 5000 });
  });

  test('DEV-CHK-002 : Checkout sans panier montre "vide"', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.addInitScript(() => {
      localStorage.removeItem('taka-cart');
    });

    await page.goto('/checkout');

    const emptyMsg = page.locator('text=/panier est vide/i');
    await expect(emptyMsg).toBeVisible({ timeout: 10000 });
  });
});