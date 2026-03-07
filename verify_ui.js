const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop
  await page.setViewportSize({ width: 1280, height: 800 });

  // Go to the page
  await page.goto('http://localhost:3000');

  // Bypass verification by setting session storage and reloading
  await page.evaluate(() => {
    sessionStorage.setItem('isVerified', 'true');
    localStorage.setItem('hasVisited', '2'); // Trigger login promo
  });

  await page.goto('http://localhost:3000');

  // Wait for the content to load
  await page.waitForTimeout(5000);

  // Take screenshot of Hero and Navbar
  await page.screenshot({ path: '/home/jules/verification/hero_navbar_v2.png' });

  // Scroll to Stats Section
  // It's after DusunSection. Let's find "Ngawonggo Dalam Angka"
  const statsHeading = page.locator('text=Ngawonggo Dalam Angka');
  if (await statsHeading.count() > 0) {
    await statsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/stats_section_v2.png' });
  }

  // Scroll to Quran Access
  const quranHeading = page.locator('text=Al-Qur\'an Digital');
  if (await quranHeading.count() > 0) {
    await quranHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/quran_section_v2.png' });
  }

  // Scroll to BMKG
  const bmkgHeading = page.locator('text=Informasi Cuaca');
  if (await bmkgHeading.count() > 0) {
    await bmkgHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/bmkg_section_v2.png' });
  }

  // Scroll to Supports
  const supportsHeading = page.locator('text=Instansi Terkait');
  if (await supportsHeading.count() > 0) {
    await supportsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/supports_section_v2.png' });
  }

  // Check for Login Promo
  const promoHeading = page.locator('text=Bergabunglah dengan Portal Warga');
  if (await promoHeading.isVisible()) {
     await page.screenshot({ path: '/home/jules/verification/login_promo_v2.png' });
  }

  await browser.close();
})();
