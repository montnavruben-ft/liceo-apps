// Renderiza las escenas de animacion.html a MP4 (1080x1920, 30 fps).
// Uso: node render.js [escena ...]   |   node render.js --still escena t salida.png
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FPS = 30;
const page_url = (s) => s === 'galaxia' ? 'file://' + path.resolve(__dirname, 'logo_galaxia.html') : 'file://' + path.resolve(__dirname, 'animacion.html') + '?scene=' + s;

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  if (args[0] === '--still') {
    await page.goto(page_url(args[1])); await page.waitForLoadState('networkidle');
    await page.evaluate(t => window.render(t), parseFloat(args[2]));
    await page.screenshot({ path: args[3] }); await browser.close(); return;
  }
  const scenes = args.length ? args : ['intro', 'agenda', 'sesion', 'outro'];
  for (const s of scenes) {
    await page.goto(page_url(s)); await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const dur = await page.evaluate(() => window.DUR);
    const n = Math.round(dur * FPS);
    const out = path.resolve(__dirname, 'build', s + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('ok', s, n, 'frames');
  }
  await browser.close();
})();
