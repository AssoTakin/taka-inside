import { test, expect } from '@playwright/test';
test('debug checkout', async ({ page, context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('taka-cart', JSON.stringify([
      {"id":2,"documentId":"f42g5tnnp3lyhq3whjebjken","name":"T-Shirt Taka Inside","price":25,"quantity":1,"slug":"t-shirt-taka-inside","type":"merch","image":"/images/logo-taka-inside.jpg"}
    ]));
  });
  await page.goto('/checkout');
  const html = await page.content();
  console.log('HTML slice:', html.substring(4000, 4600));
  console.log('Has Finaliser:', html.includes('Finaliser'));
  console.log('Has Récapitulatif:', html.includes('Récapitulatif'));
  console.log('Has vide:', html.includes('panier est vide'));
});
