import { test, expect } from '@playwright/test';

test.describe('Navigation principale', () => {
  test('La page d\'accueil charge et affiche le header', async ({ page }) => {
    await page.goto('/');
    
    // Le header est présent avec le logo
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText(/Taka Inside|taka.*inside/i).first()).toBeVisible();
  });

  test('La page d\'accueil affiche les projets', async ({ page }) => {
    await page.goto('/');
    
    // Section projets visible
    await expect(page.getByText(/Made In Bénin Radio|Projets/i).first()).toBeVisible();
  });

  test('La page /projets affiche la liste', async ({ page }) => {
    await page.goto('/projets');
    
    await expect(page.getByRole('heading', { name: /Projets/i })).toBeVisible();
    // Au moins un projet affiché
    await expect(page.locator('text=Made In Bénin Radio').first()).toBeVisible();
  });

  test('La page /label-musical affiche les artistes', async ({ page }) => {
    await page.goto('/label-musical');
    
    await expect(page.getByRole('heading', { name: /Label Musical|Artistes/i })).toBeVisible();
    // Vérifie la présence d'artistes seedés
    await expect(page.getByText(/DJ Kenza|MC Takin/i).first()).toBeVisible();
  });

  test('Navigation depuis le menu', async ({ page }) => {
    await page.goto('/');
    
    // Clic sur Boutique
    const boutonBoutique = page.getByRole('link', { name: /Boutique|Store/i });
    if (await boutonBoutique.isVisible().catch(() => false)) {
      await boutonBoutique.click();
      await expect(page.url()).toContain('/boutique');
    }
  });

  test('La page /contact charge le formulaire', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.getByRole('heading', { name: /Contact/i }).first()).toBeVisible();
    
    // Champs présents (sélecteurs par placeholder car pas de name/id)
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('La page /faire-un-don charge', async ({ page }) => {
    await page.goto('/faire-un-don');
    
    await expect(page.getByRole('heading', { name: /Don|Soutenir|Faire un don/i }).first()).toBeVisible();
  });

  test('Page 404 personnalisée', async ({ page }) => {
    await page.goto('/page-inexistante-12345');
    
    await expect(page.getByText(/404|existe pas|déplacée/i).first()).toBeVisible();
    // Liens vers l'accueil
    await expect(page.getByText(/Retour/i).first()).toBeVisible();
  });

  test('Le footer est présent sur toutes les pages', async ({ page }) => {
    const pages = ['/', '/projets', '/contact', '/boutique'];
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('footer')).toBeVisible();
    }
  });
});
