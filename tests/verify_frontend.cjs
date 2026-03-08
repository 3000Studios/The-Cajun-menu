const { chromium } = require('playwright');
const http = require('http');
const handler = require('serve-handler');

(async () => {
  // Start server
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: 'dist',
      rewrites: [
        { source: '/planner', destination: '/project-planner.html' }
      ]
    });
  });

  server.listen(3000, async () => {
    console.log('Server running at http://localhost:3000');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Test planner route
      console.log('Testing /planner route...');
      await page.goto('http://localhost:3000/planner');
      await page.waitForLoadState('networkidle');

      // Verify planner specific content (e.g., the title)
      const title = await page.title();
      if (!title.includes('Project Plan Dashboard')) {
        throw new Error(`Expected Project Plan Dashboard title, got: ${title}`);
      }

      await page.screenshot({ path: 'tests/planner-screenshot.png' });
      console.log('Successfully loaded planner and took screenshot.');

      // Test React app routing (Home)
      console.log('Testing / route...');
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'tests/home-screenshot.png' });
      console.log('Successfully loaded home and took screenshot.');

    } catch (e) {
      console.error('Test failed:', e);
      process.exit(1);
    } finally {
      await browser.close();
      server.close();
    }
  });
})();
