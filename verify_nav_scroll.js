const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Set viewport to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // Set verification flag to bypass splash/robot check
    await page.addInitScript(() => {
      sessionStorage.setItem('isVerified', 'true');
    });

    console.log('Navigating to landing page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Close login promo if it appears
    try {
      await page.click('button[aria-label="Close"]', { timeout: 2000 });
    } catch (e) {}

    // 1. Initial State (Solid Nav)
    console.log('Taking screenshot of initial solid nav...');
    await page.screenshot({ path: 'nav_solid_final.png' });

    // 2. Scrolled State (Floating Nav)
    console.log('Scrolling down...');
    await page.evaluate(() => window.scrollTo(0, 150));
    // Wait for the RAF/Transition to complete
    await page.waitForTimeout(1000);

    console.log('Taking screenshot of floating nav...');
    await page.screenshot({ path: 'nav_floating_final.png' });

    // 3. Stats Section
    console.log('Checking Stats Section...');
    await page.evaluate(() => {
        const statsSection = document.querySelector('h2').parentElement.parentElement;
        statsSection.scrollIntoView();
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'stats_section_final.png' });

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
})();
