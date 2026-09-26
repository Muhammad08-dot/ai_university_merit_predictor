const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Users\\hp\\.cache\\puppeteer\\chrome\\win64-154.0.8037.57\\chrome-win64\\chrome.exe",
    headless: "new"
  });
  const page = await browser.newPage();
  
  // Set viewport for a nice desktop view
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Take Hero Screenshot
  console.log('Taking hero screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'readme_hero_preview.png') });

  // 2. Scroll to Calculator
  console.log('Scrolling to calculator...');
  await page.evaluate(() => {
    document.querySelector('#calculator').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // 3. Take Step 1 Screenshot
  console.log('Taking Step 1 screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'step1.png') });

  // Fill Step 1 and proceed to Step 2
  await page.type('input[placeholder="e.g. 1050"]', '1050');
  await page.type('input[placeholder="e.g. 1100"]', '1100');
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[placeholder="e.g. 1050"]');
    inputs[1].value = '1000';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    const totals = document.querySelectorAll('input[placeholder="e.g. 1100"]');
    totals[1].value = '1100';
    totals[1].dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.textContent.includes('Select Programs'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 4. Take Step 2 Screenshot
  console.log('Taking Step 2 screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'step2.png') });

  // Select a program and proceed to Step 3
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const csBtn = btns.find(b => b.textContent.includes('BS Computer Science'));
    if (csBtn) csBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.textContent.includes('Select Universities'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 5. Take Step 3 Screenshot
  console.log('Taking Step 3 screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'step3.png') });

  // Select a university and proceed to Step 4
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nustBtn = btns.find(b => b.textContent.includes('NUST'));
    if (nustBtn) nustBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.textContent.includes('Enter Test Scores'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 6. Take Step 4 Screenshot
  console.log('Taking Step 4 screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'step4.png') });

  // Calculate Merit
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const calcBtn = btns.find(b => b.textContent.includes('Calculate My Merit'));
    if (calcBtn) calcBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 7. Take Results Screenshot
  console.log('Taking Results screenshot...');
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'results.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
