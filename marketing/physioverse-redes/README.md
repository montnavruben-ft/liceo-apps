# Physioverse · Animaciones para redes sociales

Videos verticales 1080×1920 (9:16, 30 fps, sin audio) para Reels, TikTok y Stories, hechos a partir de capturas reales de la app.

| Archivo | Duración | Contenido |
|---|---|---|
| `videos/00_promo_completo.mp4` | 31 s | Intro + agenda/búsqueda + sesión + cierre |
| `videos/01_intro_teaser.mp4` | 5 s | Revelado del logo, título y lema |
| `videos/02_agenda_busqueda.mp4` | 14 s | Sesiones de hoy, anillo de avance, escritura en el buscador |
| `videos/03_sesion_clinica.mp4` | 16 s | Plan de intervención, recordatorio por WhatsApp, finalizar y cobrar |
| `videos/04_logo_galaxia.mp4` | 19 s | Intro cinemática: el logo gira como galaxia, recorre sus elementos en primer plano y cierra con la marca |
| `videos/05_fernando_migracion.mp4` | 37 s | Historia de Fernando (plastilina): de expedientes en papel a importarlos en Physioverse |
| `videos/06_valoracion_completa.mp4` | 39 s | EVA, dermatomas, goniometría, fuerza (Daniels), escala de Berg, diagnóstico y tratamiento |
| `videos/07_informe_progreso.mp4` | 33 s | Informe PDF, aprobación, progreso del paciente y portal de Lucía |
| `videos/08_app_paciente.mp4` | 25 s | "Tus pacientes también tienen app": historia de Lucía con el portal del paciente |
| `videos/09_dermatomas_loop.mp4` | 12 s | Mapa de dermatomas: zonas, sensaciones y panel (pensado para repetirse en bucle) |

El teléfono del paciente está enmascarado (`663 ••• ••59`) y se quitó el indicador de grabación de pantalla.

## Regenerar
```bash
python3 preparar_assets.py splash.jpg inicio.jpg sesion.jpg   # capturas originales -> assets/
node render.js            # renderiza cada escena a build/*.mp4 (requiere Playwright + ffmpeg)
./armar_videos.sh         # une escenas -> videos/
```
Intro del logo: `logo_galaxia.html` (`node render.js galaxia`), usa `assets/logo_master.jpg` (logo en alta resolución).
Fernando: `python3 preparar_fernando.py <gif1> <gif2> <gif3> <expediente> <nuevo> <importar>` y luego `node render.js fernando` (`fernando.html`).
Valoración: `valoracion.html` (`node render.js valoracion`), capturas en `assets/valoracion/`.
Lucía: `python3 preparar_lucia.py <carpeta_uploads>` prepara clips y capturas (`assets/lucia/`, `assets/informe/`); video 3: `node render.js informe`; video 5: `node render.js paciente`; dermatomas: `node render.js dermatomas`.
Vista previa en navegador: `animacion.html?scene=sesion&play` (escenas: `intro`, `agenda`, `sesion`, `outro`).
Textos, tiempos y movimientos de cámara se editan en `animacion.html`.
