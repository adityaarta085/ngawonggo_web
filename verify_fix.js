const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Use session storage to bypass splash/human verification for quick check
  await page.addInitScript(() => {
    sessionStorage.setItem('isVerified', 'true');
  });

  try {
    // Start dev server in background
    console.log('Starting dev server...');
    const { spawn } = require('child_process');
    const server = spawn('npm', ['start'], { env: { ...process.env, BROWSER: 'none', PORT: '3000' } });

    // Wait for server to be ready
    let serverReady = false;
    for (let i = 0; i < 30; i++) {
      try {
        await page.goto('http://localhost:3000');
        serverReady = true;
        break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (!serverReady) {
      console.error('Server failed to start');
      return;
    }

    console.log('Page loaded successfully');
    await page.screenshot({ path: 'verify_home.png', fullPage: true });

    const title = await page.title();
    console.log('Page title:', title);

    const errorHeading = await page.$('h2:has-text("Ups! Terjadi Kesalahan")');
    if (errorHeading) {
      console.log('Error Boundary is visible!');
    } else {
      console.log('No Error Boundary detected.');
    }

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
    // Kill any process on port 3000
    const { execSync } = require('child_process');
    try {
      execSync('kill $(lsof -t -i :3000)');
    } catch (e) {}
  }
})();
