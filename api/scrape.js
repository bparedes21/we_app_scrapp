const { chromium } = require('playwright');  // Importamos Playwright

module.exports = async (req, res) => {
  try {
    // Lanzamos el navegador (en Vercel se usa headless=true por defecto)
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // URL a scrappear
    const url = 'https://www.ambito.com/contenidos/dolar.html';
    await page.goto(url);
    
    // Esperamos a que los elementos necesarios estén disponibles
    await page.waitForSelector('.variation-max-min__value.data-valor.data-compra');
    
    // Extraemos el valor de compra y venta
    const compra = await page.locator('.variation-max-min__value.data-valor.data-compra').textContent();
    
    page.waitForSelector('.variation-max-min__value.data-valor.data-venta');
    const venta = await page.locator('.variation-max-min__value.data-valor.data-venta').textContent();
    
    // Cerramos el navegador
    await browser.close();
    
    // Respondemos con los datos extraídos
    res.status(200).json({ compra, venta });
  } catch (error) {
    console.error('Error durante el scraping:', error);
    res.status(500).json({ error: 'Error durante el scraping' });
  }
};
