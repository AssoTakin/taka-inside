import { test, expect } from '@playwright/test';

const CART_ITEM = {
  id: 'single-mc-takin-benin-remix',
  name: 'Single MC Takin - Bénin Remix',
  price: 1,
  quantity: 1,
  image: 'https://9c330323a1895c9f923862371ec9acfe.r2.cloudflarestorage.com/taka-inside-digital/single-cover.webp',
  productType: 'digital',
};

const CUSTOMER = {
  prenom: 'Baba',
  nom: 'Babba',
  email: 'wwx@gmail.com',
  telephone: '+22995133333',
};

async function injectCart(context) {
  await context.addInitScript((items) => {
    localStorage.setItem('taka-cart', JSON.stringify(items));
  }, [CART_ITEM]);
}

async function fillCustomerForm(page) {
  await page.locator('#prenom').fill(CUSTOMER.prenom);
  await page.locator('#nom').fill(CUSTOMER.nom);
  await page.locator('#email').fill(CUSTOMER.email);
  await page.locator('#telephone').fill(CUSTOMER.telephone);
}

test.describe('Paiement single — méthodes de paiement', () => {
  test('DEV-CHK-PM-001 : les moyens de paiement se chargent et le bouton Payer est actif', async ({ page, context }) => {
    await injectCart(context);
    await page.goto('/paiement?preview=taka2026');

    await expect(page.locator('text=/Carte Bancaire/i')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=/Mobile Money/i')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/Impossible de charger les moyens de paiement/i')).not.toBeVisible();

    const payBtn = page.locator('#pay-btn');
    await expect(payBtn).toBeEnabled({ timeout: 5000 });
    await expect(payBtn).toContainText('Payer 1,00 €');
  });

  test('DEV-CHK-PM-002 : Mobile Money redirige vers FedaPay', async ({ page, context }) => {
    await injectCart(context);

    await page.route('/api/fedapay/create-transaction', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://process.fedapay.com/mock-checkout' }),
      });
    });

    await page.goto('/paiement?preview=taka2026');

    await expect(page.locator('text=/Mobile Money/i')).toBeVisible({ timeout: 15000 });
    await page.locator('button:has-text("Mobile Money")').click();

    await fillCustomerForm(page);

    const [response] = await Promise.all([
      page.waitForResponse('/api/fedapay/create-transaction'),
      page.locator('#pay-btn').click(),
    ]);

    expect(response.ok()).toBe(true);
    const payload = await response.request().postDataJSON();
    expect(payload).toMatchObject({
      amount: 1,
      currency: 'eur',
      customer: expect.objectContaining({
        email: CUSTOMER.email,
        prenom: CUSTOMER.prenom,
        nom: CUSTOMER.nom,
        telephone: CUSTOMER.telephone,
      }),
    });

    await expect(page).toHaveURL('https://process.fedapay.com/mock-checkout', { timeout: 5000 });
  });

  test('DEV-CHK-PM-003 : Carte Bancaire redirige vers Stripe', async ({ page, context }) => {
    await injectCart(context);

    await page.route('/api/create-checkout-session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/mock-pay' }),
      });
    });

    await page.goto('/paiement?preview=taka2026');

    await expect(page.locator('text=/Carte Bancaire/i')).toBeVisible({ timeout: 15000 });
    await page.locator('button:has-text("Carte Bancaire")').click();

    await fillCustomerForm(page);

    const [response] = await Promise.all([
      page.waitForResponse('/api/create-checkout-session'),
      page.locator('#pay-btn').click(),
    ]);

    expect(response.ok()).toBe(true);
    const payload = await response.request().postDataJSON();
    expect(payload).toMatchObject({
      items: expect.arrayContaining([expect.objectContaining({ name: CART_ITEM.name })]),
      customer: expect.objectContaining({ email: CUSTOMER.email }),
    });

    await expect(page).toHaveURL('https://checkout.stripe.com/mock-pay', { timeout: 5000 });
  });
});
