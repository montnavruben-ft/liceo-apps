# Physioverse · Retoque visual (propuesta)

Maquetas del retoque sobre tres pantallas actuales: Inicio, Agenda y Expediente.
- `imagenes/comparacion_*.png`: antes y después lado a lado.
- `imagenes/retoque_*_marcas.png`: cada cambio numerado (ver la lista en la conversación).
- `mockup.html` (`?p=inicio|agenda|expediente&mk=1`) y `node render.js` regeneran las imágenes.
Los tokens de color y radios están al inicio de `mockup.html` (`:root`), listos para copiar a la app.

## Versión móvil
`movil.html?p=inicio|agenda|sesion|expediente` y `node render_movil.js` generan `imagenes/movil_*.png` y la lámina `imagenes/movil_lamina.png` (390×844 @3x, con la barra inferior flotante de la app).
