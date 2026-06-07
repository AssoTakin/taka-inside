import { test, expect } from '@playwright/test';

/**
 * SUITE DE TESTS : Parcours boutique et panier (corrigée)
 */

test.describe('Parcours boutique et panier', () => {
  test('DEV-SHOP-001 : Affichage boutique avec 3 produits', async ({ page }) => {
    await page.goto('/boutique', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Vérifier les 3 produits
    const pageText = await page.locator('body').innerText();
    expect(pageText).toContain('T-Shirt Taka Inside');
    expect(pageText).toContain('Ticket Festival Taka');
    expect(pageText).toContain('KIKOKO');
    
    // Vérifier les prix (format: "25 €")
    expect(pageText).toMatch(/25\s*€/);
    expect(pageText).toMatch(/15\s*€/);
    expect(pageText).toMatch(/4\s*€/);
  });

  test('DEV-SHOP-002 : Détail produit physique avec ajout panier', async ({ page }) => {
    await page.goto('/boutique/t-shirt-taka-inside', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Vérifier le bouton "Ajouter au panier"
    const btn = page.locator('button:has-text("Ajouter au panier")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    
    // Ajouter au panier
    await btn.click();
    await page.waitForTimeout(500);
  });

  test('DEV-SHOP-003 : Détail produit numérique (KIKOKO)', async ({ page }) => {
    await page.goto('/boutique/kikoko', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Vérifier le bouton d'achat
    const btn = page.locator('button:has-text("Ajouter au panier")');
    await expect(btn).toBeVisible();
    
    // Vérifier badge ALBUM DIGITAL
    const pageText = await page.locator('body').innerText();
    expect(pageText).toMatch(/ALBUM DIGITAL|Album digital/);
  });

  test('DEV-SHOP-004 : Fallback images (logo Taka Inside)', async ({ page }) => {
    await page.goto('/boutique', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Vérifier que les images utilisent le logo fallback
    const images = await page.locator('img').all();
    let logoCount = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src') || '';
      if (src.includes('logo-taka-inside')) {
        logoCount++;
      }
    }
    
    expect(logoCount).toBeGreaterThan(0);
    
    // Vérifier sur projets aussi
    await page.goto('/projets', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    const projectImages = await page.locator('img').all();
    let projectLogoCount = 0;
    for (const img of projectImages) {
      const src = await img.getAttribute('src') || '';
      if (src.includes('logo-taka-inside')) {
        projectLogoCount++;
      }
    }
    expect(projectLogoCount).toBeGreaterThan(0);
  });

  test('DEV-SHOP-005 : Logo Taka Inside dans header et footer', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    // Header logo
    const headerLogo = await page.locator('header img[alt*="Taka"]').count();
    expect(headerLogo).toBeGreaterThan(0);
    
    // Footer logo
    const footerLogo = await page.locator('footer img[alt*="Taka"]').count();
    expect(footerLogo).toBeGreaterThan(0);
  });
});
