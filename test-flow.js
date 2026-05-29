import puppeteer from 'puppeteer';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('./public'); // Save to public folder so it can be referenced in README

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // 1. Order Menu
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://fampam-restaurant.duc-toan-le.workers.dev/order', { waitUntil: 'networkidle0' });
  
  // Edge Case: Wait for dishes to load from DB
  await page.waitForSelector('h2.font-serif-display');
  
  console.log('Taking screenshot of Menu...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-menu.png') });

  // 2. Add to Cart & Drawer
  console.log('Testing "Add to Cart" flow...');
  // Find the first Add to Cart button and click it
  const addButtons = await page.$$('button');
  for (const btn of addButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Add to Cart')) {
      await btn.click();
      break;
    }
  }

  // Wait a moment for cart animation
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Cart FAB (it has aria-label starting with Open cart)
  const cartFab = await page.$('button[aria-label^="Open cart"]');
  if (cartFab) {
    await cartFab.click();
    await new Promise(r => setTimeout(r, 1000)); // wait for drawer animation
    console.log('Taking screenshot of Cart Drawer...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-cart-drawer.png') });
    
    // Click "Proceed to Checkout"
    const checkoutBtns = await page.$$('button');
    for (const btn of checkoutBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Proceed to Checkout')) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
          btn.click()
        ]);
        break;
      }
    }
  }

  // 3. Checkout Page
  console.log('Taking screenshot of Checkout...');
  // Fill in some guest details to test the edge case of Guest Checkout
  try {
    await page.type('input[placeholder="John Doe"]', 'Jane Doe');
    await page.type('input[placeholder="jane@example.com"]', 'jane@fampam.com');
  } catch(e) {}
  
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-checkout.png') });

  // 4. Admin Dashboard
  console.log('Navigating to Admin Dashboard...');
  await page.goto('https://fampam-restaurant.duc-toan-le.workers.dev/admin', { waitUntil: 'networkidle0' });
  
  // It redirects to /admin if localhost. Wait for Orders to load
  await new Promise(r => setTimeout(r, 1500));
  console.log('Taking screenshot of Admin...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-admin.png') });

  await browser.close();
  console.log('All screenshots captured successfully.');
})();
