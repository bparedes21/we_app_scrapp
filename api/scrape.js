const express = require("express");
const cors = require("cors");
const creaper = require("creaper");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
let corsOptions = {
  origin: ["http://localhost:3000", "https://humanscape-team5a.netlify.app"],
};

app.use(cors(corsOptions));

// Función para realizar el scraping usando `creaper.js`
async function scrapeDolarData() {
  try {
    // Usamos `creaper` para obtener los datos de la página web
    const browser = await creaper.launch({ headless: true });
    const page = await browser.newPage();
    const url = "https://www.ambito.com/contenidos/dolar.html";
    
    // Navegamos a la página
    await page.goto(url);

    // Extraemos los valores de compra y venta del dólar
    const compra = await page.$eval(".variation-max-min__value.data-valor.data-compra", el => el.textContent);
    const venta = await page.$eval(".variation-max-min__value.data-valor.data-venta", el => el.textContent);

    await browser.close();
    
    return {
      compra: compra.trim(),
      venta: venta.trim(),
      timestamp: new Date().toISOString() // Añadimos un timestamp
    };
  } catch (error) {
    console.error("Error al hacer scraping:", error);
    throw new Error("Error al obtener los datos del dólar");
  }
}

// Endpoint para obtener los datos del dólar
app.get("/", async (req, res) => {
  try {
    const textQuery = req.query.searchText || ""; // Parámetro opcional para búsqueda
    const numOfRowsQuery = req.query.numOfRows || 10; // Número de resultados opcionales

    if (!textQuery) {
      return res.status(400).json({ error: "searchText is required" });
    }

    // Realizar scraping y obtener los valores
    const dolarData = await scrapeDolarData();

    // Enviar los datos de la cotización al cliente
    res.json(dolarData);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al obtener los datos" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
