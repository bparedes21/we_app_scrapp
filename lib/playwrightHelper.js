const { chromium } = require('playwright');

async function launchBrowser() {
  const browser = await chromium.launch();
  return browser;
}

async function closeBrowser(browser) {
  await browser.close();
}

module.exports = { launchBrowser, closeBrowser };
