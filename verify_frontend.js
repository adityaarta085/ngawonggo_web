const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for splash screen to disappear or just wait a bit
  console.log('Waiting for content to load...');
  await page.waitForTimeout(5000);

  console.log('Taking screenshots...');
  await page.screenshot({ path: 'hero.png' });

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'vision.png' });

  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'news.png' });

  await browser.close();
  console.log('Screenshots saved.');
})();
