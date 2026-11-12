# Audio — placeholders

Todos los archivos de esta carpeta son **silencio** (placeholders válidos). El render funciona tal cual; no se inventó ninguna voz ni música.

| Archivo | Qué es | Duración | Nivel objetivo |
|---|---|---|---|
| `narration-es-lat.mp3` | Narración completa, español latino neutro (es-MX) | 80 s | **-16 LUFS** integrado |
| `music-bed.mp3` | Música de fondo electrónica suave, licencia libre | 80 s (o más, se corta) | **-24 LUFS** |
| `sfx-whoosh.mp3` | Whoosh en cada transición (9 cortes) | ~0,5 s | a gusto |
| `sfx-pulse.mp3` | Pulso suave en escenas de cerebro (1 y 4) | ~0,5 s | a gusto |

Para reemplazar: guarda tu archivo con **el mismo nombre** y vuelve a renderizar. Nada más.

## Narración con TTS (recomendado: un clip por escena)

1. Genera 10 clips con una voz es-MX cálida y natural (no robótica), ~105 palabras/min, con el texto **exacto** de `src/data/narration.json` (campo `text`). Ejemplos de voces: Azure `es-MX-DaliaNeural` / `es-MX-JorgeNeural`, ElevenLabs con una voz latina neutra, Google Cloud `es-US` Neural2.
2. Guárdalos como `src/audio/narracion/escena-01.mp3` … `escena-10.mp3`.
3. Ejecuta `npm run narration`. El script:
   - coloca cada clip exactamente en el `startFrame` de su escena,
   - avisa si algún clip dura más que su ventana (si pasa, acelera el TTS un 5-10 % o recorta silencios),
   - mezcla y normaliza a -16 LUFS → `src/audio/narration-es-lat.mp3`.

Requiere `ffmpeg` y `ffprobe` en el PATH.

## Normalizar música (-24 LUFS)

```bash
ffmpeg -i mi-musica.mp3 -af loudnorm=I=-24:TP=-2:LRA=11 -ar 44100 src/audio/music-bed.mp3
```

## Subtítulos y sincronía

Los subtítulos (`src/data/subtitles.json`) se reparten dentro de la ventana de cada escena. Con la narración real, revisa en `npm run dev` que cada bloque coincide con la voz; si alguno se desfasa más de 2 frames, ajusta su `startFrame`/`endFrame` en `subtitles.json` y regenera el SRT con `npm run srt`.
