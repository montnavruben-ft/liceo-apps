// Configuración de render de Remotion (CLI: `npx remotion studio`, `npx remotion render`).
// Formato del reel: vertical 9:16, 1080 x 1920 px, 30 fps, 2400 frames = 80 s.
// Las dimensiones y la duración viven en src/constants.ts y se aplican en src/Root.tsx
// (en Remotion se definen por <Composition>, no aquí).
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
// WebGL para @remotion/three. "angle" usa la GPU si existe; en servidores sin GPU
// cambia a "swangle" (software) con: npx remotion render ... --gl=swangle
Config.setChromiumOpenGlRenderer("angle");

// Opcional: usar un Chrome/Chromium ya instalado en lugar de descargar Chrome Headless Shell.
// Ejemplo: REMOTION_BROWSER=/ruta/a/chrome-headless-shell npx remotion render ...
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
