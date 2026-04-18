const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting React development server...');
const server = require('child_process').spawn('npm', ['start'], {
  env: { ...process.env, BROWSER: 'none' }
});

let serverReady = false;
const checkServer = setInterval(() => {
  try {
    execSync('curl -s http://localhost:3000');
    console.log('Server is ready!');
    serverReady = true;
    clearInterval(checkServer);

    console.log('Running Playwright test...');
    try {
      execSync('npx playwright test verify_down_page.spec.js', { stdio: 'inherit' });
      console.log('Test completed successfully.');
    } catch (error) {
      console.error('Test failed:', error.message);
    } finally {
      server.kill();
      process.exit(0);
    }
  } catch (e) {
    console.log('Waiting for server...');
  }
}, 2000);

setTimeout(() => {
  if (!serverReady) {
    console.error('Server timed out.');
    server.kill();
    process.exit(1);
  }
}, 60000);
