# Prompt de correcciones — imágenes del reel Método Bobath

Gracias por el prototipo: **la dirección artística es correcta y se mantiene** (porcelana mate, rostros sin rasgos, paleta azul noche, cian y coral; el terapeuta P4 con polo coral funciona muy bien). Ahora necesito una entrega corregida para poder armar el reel completo en Remotion.

Ya no te pido separar extremidades. El objetivo es más simple:
- **imágenes completas y limpias, a sangre;**
- **personajes recortados con transparencia real;**
- **capas de luz sobre negro puro.**

Las animaciones (zoom, paralaje, respiración, pulsos de luz, trazos) las hago yo.

Mantén las especificaciones del prompt anterior (`PROMPT-agente-imagenes-capas.md`): lienzo de 1350 x 2400 px, cero texto o logos, y título y subtítulos fuera de la zona del sujeto.

## 1. Reglas que la entrega anterior no cumplió (obligatorias)
1. **A sangre, sin recuadros:** la ilustración llena el lienzo completo. Ni rectángulo interior, ni marco, ni panel con otro tono de fondo detrás de las figuras. Hoy fallan e01, e02, e05 y e06.
2. **Recortes reales:** un personaje recortado lleva transparencia que sigue su silueta (pelo, dedos, ropa), con borde suave de 1–2 px. **No vale un rectángulo opaco con el fondo dentro.** Hoy `e05_p1_normal`, `e05_p1_afectado`, `e06_p1_cuerpo`, `e07_p1_cuerpo` y `e10_p1` son rectángulos.
3. **Ninguna capa vacía:** si una capa no se puede hacer, **no la entregues** y anótalo en la ficha. Hoy hay 18 PNG transparentes vacíos.
4. **Capas de luz sobre negro puro:** las capas que son solo luz (sinapsis, nervios, anillos, brillos, tensión, calma) van **sobre fondo negro puro #000000, opacas**, en lugar de transparencia. Yo las mezclo en modo "pantalla". Es más fácil de generar y queda mejor.
5. **Registro:** todas las capas de una escena salen de la misma imagen base, al mismo tamaño y alineadas.
6. **Fondo limpio:** cada `eXX_fondo.png` es la escena **sin los personajes**, con el hueco rellenado (inpainting), para que el personaje recortado pueda moverse un poco encima.

## 2. Correcciones por escena

### e01 — Hook
- `e01_composite.png`: el mismo cerebro, **a sangre, sin rectángulo**. El cerebro centrado entre y≈650 y y≈1650 del lienzo, entero y sin cortes a los lados.
- `e01_cerebro.png`: el cerebro recortado con transparencia y **sin** los puntos de luz.
- `e01_sinapsis.png`: solo los puntos y líneas de luz cian, **sobre negro puro**, alineados con el cerebro.

### e02 — ¿Qué es?
- `e02_composite.png`: P1 caminando, **a sangre, sin rectángulo**.
- `e02_fondo.png`: el fondo sin la figura.
- `e02_p1.png`: P1 recortado, **sin** el sistema nervioso iluminado (cuerpo liso).
- `e02_nervios.png`: solo el sistema nervioso cian (cerebro, médula y nervios de brazos y piernas), **sobre negro puro**, alineado con P1.
- `e02_anillo_1/2/3.png`: los anillos de cabeza, columna y muslo, **sobre negro puro**.

### e03 — Origen
- `e03_fondo.png`: la escena **sin P2 ni P3**, con el hueco rellenado.
- `e03_p2.png` y `e03_p3.png`: cada pionero recortado con transparencia.

### e04 — Neuroplasticidad
La imagen es muy buena. Solo:
- `e04_dano.png` y `e04_nodo_nuevo.png`: la luz coral del nodo dañado y la cian del nodo nuevo, **sobre negro puro** (hoy son recortes con fondo).
- `e04_fondo.png`: la red con esos dos nodos **apagados**, en el mismo azul que los demás.

### e05 — El problema
- `e05_composite.png`: las dos figuras sobre **un único suelo continuo**, sin los paneles rectangulares de fondo distinto detrás de cada una.
- `e05_fondo.png`: el suelo sin figuras.
- `e05_p1_normal.png` y `e05_p1_afectado.png`: recortes reales.
- `e05_tension.png`: el brillo coral del brazo y la pierna afectados, **sobre negro puro**.
- Los caminos verde y coral se pueden quedar como están.

### e06 — Paso 1: Inhibir
- Se mantiene al paciente **sentado en la camilla** (está bien).
- Corrección del guion: P4 debe tener **una mano sobre el hombro afectado y la otra sobre la pelvis o cadera** del mismo lado, con un contacto suave y claro.
- **A sangre, sin recuadro.**
- Capas:
  - `e06_fondo.png`: la sala y la camilla, sin personas.
  - `e06_p1.png`: el paciente recortado.
  - `e06_p4.png`: el terapeuta recortado, con sus manos.
  - `e06_tension_coral.png` y `e06_calma_azul.png`: brillos sobre el hombro y el brazo del paciente, **sobre negro puro**.
- **Opcional, muy valioso:** `e06_composite_relajado.png`. Es **idéntica** a `e06_composite.png` en todo (encuadre, luz, terapeuta, cuerpo, fondo), excepto que el brazo afectado del paciente pasa de flexionado a **relajado, extendido junto al cuerpo**. Lo uso para que el brazo "se relaje".

### e07 — Paso 2: Facilitar
- Cambia el cono naranja por **una esfera cian luminosa pequeña** sobre la mesita.
- Capas: `e07_fondo.png`, `e07_p1.png` y `e07_p4.png` (recortados) y `e07_objeto.png`.
- Indica en `capas.json` las coordenadas en píxeles de pelvis, tronco, hombro y mano del paciente, para poner los puntos dorados.
- **Opcional, muy valioso:** `e07_composite_inicio.png`. Es **idéntica** a `e07_composite.png` excepto que el brazo del paciente está todavía abajo, en reposo; P4 lo sostiene bajo el codo.

### e08 — El ciclo Bobath
Los iconos planos se aceptan. Solo pido que el trazo sea un poco más grueso y que los 4 compartan el mismo grosor y el mismo tamaño visual.

### e09 — ¿Para quién? (rehacer completo)
Los pictogramas de círculos y rectángulos no sirven. Quiero **cuatro personajes en el mismo estilo humano de porcelana mate** que P1 a P4 (proporciones reales, manos de 5 dedos, ropa lisa, rostro sin rasgos), cada uno en un PNG de 900 x 1200 px recortado con transparencia, de cuerpo entero, con dignidad y actitud activa:
- `e09_nino.png`: niño de unos 7 años con parálisis cerebral, de pie con un andador infantil ligero, sonriendo con el cuerpo (postura abierta).
- `e09_mayor.png`: adulto mayor con bastón, tras un ictus, caminando erguido.
- `e09_silla.png`: joven en silla de ruedas moderna y deportiva (lesión medular), con postura segura.
- `e09_adulto.png`: adulto de pie (esclerosis múltiple), postura serena.

Colores: cuerpos en azul pizarra, con un acento coral o cian distinto en la ropa de cada uno para diferenciarlos.

### e10 — Cierre
La imagen del paseo hacia el amanecer es muy buena; **guárdala** como `e10_composite_alt.png`.
- **Versión principal según el guion:** `e10_composite.png` con P1 **caminando de frente, hacia la cámara**, sobre el mismo camino luminoso, con el amanecer detrás.
- Capas:
  - `e10_fondo_oscuro.png` y `e10_fondo_iluminado.png` (el mismo camino, sin figura).
  - `e10_p1.png`, recortado.
  - `e10_nervios.png`: el sistema nervioso encendido, alineado con P1, **sobre negro puro**.

### Hoja de personajes
P4 aparece como siluetas planas: rehaz su parte con frente, perfil, 3/4 y primer plano de manos, en el mismo estilo que el P4 de e06 y e07.

## 3. Cómo voy a verificar la entrega (para que la revises antes de subirla)
- Ningún PNG vacío.
- Ningún recorte cuya transparencia sea un rectángulo: la silueta debe ocupar menos del 85 % de su caja.
- Ninguna composición con bordes de recuadro.
- Las capas de luz, sobre negro puro.
- Los nombres de archivo exactamente como arriba.

## 4. Entrega
- Sube los archivos a las mismas carpetas, `bobath-reel/public/e01/` … `e10/`, **reemplazando** los anteriores con el mismo nombre, en la rama `claude/bobath-method-reel-q9ukd1`.
- Borra los placeholders vacíos que no reemplaces.
- Actualiza `capas.json` y añade una ficha corta que diga qué se entregó, qué no, y por qué.

**Prioridad si no hay tiempo para todo:**
1. e09 (rehacer), y e01, e02, e05 y e06 sin recuadros.
2. Los recortes reales y las capas de luz sobre negro.
3. Las versiones opcionales de e06 y e07 (brazo en dos posiciones), y e10 de frente.
