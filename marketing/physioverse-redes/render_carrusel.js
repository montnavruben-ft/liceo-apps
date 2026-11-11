// Renderiza los carruseles de carrusel.html a PNG 1080x1350 (Instagram 4:5).
// Uso: node render_carrusel.js [agenda expediente informe]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const decks = process.argv.slice(2).length ? process.argv.slice(2) : ['agenda', 'expediente', 'informe'];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const c of decks) {
    const dir = path.resolve(__dirname, 'carruseles', c); fs.mkdirSync(dir, { recursive: true });
    let i = 1, n = 1;
    do {
      await page.goto('file://' + path.resolve(__dirname, 'carrusel.html') + `?c=${c}&i=${i}`);
      await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready);
      n = await page.evaluate(() => window.N);
      await page.screenshot({ path: path.join(dir, `${String(i).padStart(2, '0')}.png`) });
      i++;
    } while (i <= n);
    console.log(c, n, 'slides');
  }
  await browser.close();
})();
