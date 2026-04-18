const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1600 });

  // Verify Privacy Policy
  await page.goto('http://localhost:3000/privacy');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/privacy_policy_v2.png' });

  // Verify Terms & Conditions
  await page.goto('http://localhost:3000/terms');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/terms_conditions_v2.png' });

  await browser.close();
})();
