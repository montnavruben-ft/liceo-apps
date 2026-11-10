# Physioverse · Animaciones para redes sociales

Videos verticales 1080×1920 (9:16, 30 fps, sin audio) para Reels, TikTok y Stories, hechos a partir de capturas reales de la app.

| Archivo | Duración | Contenido |
|---|---|---|
| `videos/00_promo_completo.mp4` | 31 s | Intro + agenda/búsqueda + sesión + cierre |
| `videos/01_intro_teaser.mp4` | 5 s | Revelado del logo, título y lema |
| `videos/02_agenda_busqueda.mp4` | 14 s | Sesiones de hoy, anillo de avance, escritura en el buscador |
| `videos/03_sesion_clinica.mp4` | 16 s | Plan de intervención, recordatorio por WhatsApp, finalizar y cobrar |
| `videos/04_logo_galaxia.mp4` | 19 s | Intro cinemática: el logo gira como galaxia, recorre sus elementos en primer plano y cierra con la marca |

El teléfono del paciente está enmascarado (`663 ••• ••59`) y se quitó el indicador de grabación de pantalla.

## Regenerar
```bash
python3 preparar_assets.py splash.jpg inicio.jpg sesion.jpg   # capturas originales -> assets/
node render.js            # renderiza cada escena a build/*.mp4 (requiere Playwright + ffmpeg)
./armar_videos.sh         # une escenas -> videos/
```
Intro del logo: `logo_galaxia.html` (`node render.js galaxia`), usa `assets/logo_master.jpg` (logo en alta resolución).
Vista previa en navegador: `animacion.html?scene=sesion&play` (escenas: `intro`, `agenda`, `sesion`, `outro`).
Textos, tiempos y movimientos de cámara se editan en `animacion.html`.
