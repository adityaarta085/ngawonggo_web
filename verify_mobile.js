const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Tunggu splash screen selesai (minimal 20 detik sesuai AGENTS.md)
    console.log('Waiting for SplashScreen to finish...');
    await page.waitForTimeout(25000);

    // Klik verifikasi jika ada
    const verifyBtn = page.locator('button:has-text("Lanjutkan ke Situs")');
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
      await page.waitForTimeout(2000);
    }

    // Scroll down to check Ramadan section on mobile
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'verification/mobile_ramadan.png', fullPage: true });
    console.log('Screenshot saved to verification/mobile_ramadan.png');

    // Check for PWA banner - it might require triggering the event,
    // but we can check if the component is rendered (even if hidden or waiting for event)
    // Actually, in our code it only shows if deferredPrompt is set.
    // We can manually trigger the event in the browser console for testing.
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      event.prompt = () => console.log('Prompted');
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification/mobile_pwa_banner.png' });
    console.log('Mobile PWA banner screenshot saved.');

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();
