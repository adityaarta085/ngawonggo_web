const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('verify auth page and navbar', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Skip Splash Screen & Verification by going directly to /auth
  await page.goto('http://localhost:3000/auth');

  // Verify Auth UI
  await expect(page.getByText('Portal Warga')).toBeVisible();
  await expect(page.getByText('Lanjutkan dengan Google')).toBeVisible();

  // Check tabs
  await page.getByRole('tab', { name: 'Daftar' }).click();
  await expect(page.getByRole('button', { name: 'Daftar Sekarang' })).toBeVisible();

  await page.screenshot({ path: 'auth_page.png' });
});
