const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to Landing Page...');
  await page.goto('http://localhost:3000');
  await page.evaluate(() => sessionStorage.setItem('isVerified', 'true'));
  await page.reload();
  await page.waitForTimeout(5000); // Wait for splash to clear

  // 1. Hero Screenshot
  await page.screenshot({ path: 'hero_landing.png' });
  console.log('Saved hero_landing.png');

  // 2. Footer Screenshot (Scroll to bottom)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'footer.png' });
  console.log('Saved footer.png');

  // 3. Jelajahi Page
  console.log('Navigating to Jelajahi...');
  await page.goto('http://localhost:3000/jelajahi');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'jelajahi_page.png' });
  console.log('Saved jelajahi_page.png');

  // 4. Quran Page
  console.log('Navigating to Quran...');
  await page.goto('http://localhost:3000/quran');
  await page.waitForTimeout(5000); // Wait for data to load
  await page.screenshot({ path: 'quran_page.png' });
  console.log('Saved quran_page.png');

  await browser.close();
})();
