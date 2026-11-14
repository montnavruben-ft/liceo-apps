// Renderiza las pantallas móviles (390x844 @3x) y una lámina con las cuatro
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  for (const p of ['inicio', 'agenda', 'expediente', 'sesion']) {
    await pg.goto('file://' + path.resolve(__dirname, 'movil.html') + `?p=${p}`);
    await pg.waitForLoadState('networkidle'); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: `imagenes/movil_${p}.png` });
  }
  await b.close();
})();
