# Método Bobath — Reel informativo (Remotion 4)

Reel vertical **9:16, 1080 × 1920 px, 30 fps, 80 s (2400 frames)** sobre el Concepto Bobath, con animación 3D estilizada (`@remotion/three` + React Three Fiber), sin video real de pacientes ni rostros.

> **Video informativo. No sustituye la valoración de un profesional de la salud.**
>
> Fuente: https://www.fisioterapianeurologica.es/tratamientos/concepto-bobath/

Nota de formato: 1080 × 1920 es **9:16 vertical** (no 16:9).

## Instalar y abrir

```bash
npm install
npm run dev          # Remotion Studio en http://localhost:3000
```

## Renderizar

```bash
npx remotion render BobathReel out/bobath-reel.mp4   # o: npm run render  (MP4 H.264, yuv420p)
npx remotion still Cover public/cover.png            # o: npm run cover   (portada PNG 1080x1920)
npm run subtitles                                    # regenera subtitles.json + subtitles.srt
```

- **Sin GPU (servidor/CI):** añade `--gl=swangle` al render.
- **Sin acceso a internet para descargar Chrome Headless Shell:** usa un Chrome/Chromium ya instalado:
  `REMOTION_BROWSER=/ruta/a/chrome-headless-shell npx remotion render BobathReel out/bobath-reel.mp4 --gl=swangle`
- Las fuentes (Montserrat, Inter; SIL OFL 1.1) van incluidas en `public/fonts/`, así que el render no necesita internet.

## Estructura

```
bobath-reel/
  package.json · remotion.config.ts · tsconfig.json
  subtitles.srt                 # exportado desde src/data/subtitles.json
  DESCRIPCION-REEL.md           # texto de descripción con disclaimer y fuente
  public/cover.png              # portada exportada
  public/fonts/                 # Montserrat + Inter (woff2) y licencias OFL
  scripts/
    build-subtitles.mjs         # narration.json -> subtitles.json
    export-srt.mjs              # subtitles.json -> subtitles.srt
    build-narration.mjs         # 10 clips TTS -> narration-es-lat.mp3 (-16 LUFS)
  src/
    index.ts · Root.tsx         # Composiciones BobathReel (2400 f) y Cover (1 f)
    BobathReel.tsx · Cover.tsx
    constants.ts                # DURACION, FPS, PALETA, FUENTES, zona segura, CANAL
    fonts.ts · utils.ts
    data/script.json            # escenas: startFrame/endFrame, narración, textos, visual, cámara
    data/narration.json         # texto exacto por escena + bloques de subtítulo
    data/subtitles.json         # bloques con startFrame/endFrame para <Subtitles />
    components/                 # Scene, Brain3D, Avatar3D, OverlayText, Subtitles, ProgressBar,
                                # Stage (ThreeCanvas + cámara), Primitives3D, Hand3D
    scenes/                     # S01Hook … S10Cierre (una por escena del guion)
    audio/                      # placeholders en silencio + README de audio
```

## Guion y tiempos

| # | Frames | Tiempo | Texto en pantalla |
|---|---|---|---|
| 1 | 0–120 | 0:00–0:04 | ¿TU CEREBRO PUEDE REAPRENDER? |
| 2 | 120–360 | 0:04–0:12 | MÉTODO BOBATH / Rehabilitación neurológica |
| 3 | 360–600 | 0:12–0:20 | LONDRES, AÑOS 40 / Berta + Karel Bobath |
| 4 | 600–840 | 0:20–0:28 | NEUROPLASTICIDAD / El cerebro se reorganiza |
| 5 | 840–1110 | 0:28–0:37 | TONO ALTERADO / El movimiento se desvía |
| 6 | 1110–1380 | 0:37–0:46 | 1. INHIBIR / Calmar el tono anormal |
| 7 | 1380–1650 | 0:46–0:55 | 2. FACILITAR / Guiar el movimiento correcto |
| 8 | 1650–1920 | 0:55–1:04 | OBSERVAR → ANALIZAR → TRATAR → REEVALUAR |
| 9 | 1920–2190 | 1:04–1:13 | ¿PARA QUIÉN? / Ictus · Parálisis cerebral · Lesión medular · EM |
| 10 | 2190–2400 | 1:13–1:20 | MOVERSE ES VOLVER A VIVIR / Guarda este reel · Síguenos |

Cada escena empieza en su `startFrame` exacto; la siguiente entra con un crossfade de 12 frames.
Toda la animación usa `useCurrentFrame()`, `interpolate()` y `spring()` (sin animaciones CSS ni tiempo real).

## Personalizar

- **Narración, música, SFX:** ver `src/audio/README.md` (los archivos actuales son silencio).
- **Nombre del canal en el cierre:** `CANAL` en `src/constants.ts` (por defecto no se muestra).
- **Subtítulos:** edita `subtitleChunks` en `src/data/narration.json` y ejecuta `npm run subtitles`.

## Nota sobre subtítulos

El SRT del guion original tenía bloques de 3 líneas. Para cumplir “máximo 2 líneas” en móvil a 64 px, el mismo texto exacto se dividió en 24 bloques más cortos dentro de la ventana de cada escena.
