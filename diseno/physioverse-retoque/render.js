// Renderiza las maquetas del retoque: imagenes/retoque_<pantalla>.png (limpia) y _marcas.png (con números)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 2 });
  for (const p of ['inicio', 'agenda', 'expediente']) for (const m of ['', '&mk=1']) {
    await pg.goto('file://' + path.resolve(__dirname, 'mockup.html') + `?p=${p}${m}`);
    await pg.waitForLoadState('networkidle'); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: `imagenes/retoque_${p}${m ? '_marcas' : ''}.png` });
  }
  await b.close();
})();
