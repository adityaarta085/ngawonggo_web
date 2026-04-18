const { test, expect } = require('@playwright/test');

test('Takedown page renders correctly', async ({ page }) => {
  // We'll mock the Supabase call in the next step or just navigate directly if possible
  // Since we can't easily mock the supabase response in the browser without more setup,
  // we'll just check if the /down route exists and renders the TakedownPage component.

  await page.goto('http://localhost:3000/down');

  // Check for the warning banner title
  await expect(page.locator('h2:has-text("PERINGATAN SISTEM")')).toBeVisible();

  // Check for the AI chat header
  await expect(page.locator('h2:has-text("ASISTEN DARURAT AI")')).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'takedown_page_verification.png', fullPage: true });
});
