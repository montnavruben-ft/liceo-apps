# Prompt para el agente de imágenes — ilustraciones en capas (escenas 1–10)

Actúa como director de arte e ilustrador 3D con IA. Necesito las imágenes de un reel vertical de 80 s sobre el Método Bobath (rehabilitación neurológica). **No quiero video.** Quiero **imágenes fijas separadas en capas** (PNG con transparencia). Yo las animo después en Remotion con movimientos ligeros:
- paralaje;
- extremidades que rotan sobre su articulación;
- respiración;
- luces que pulsan;
- líneas que se dibujan solas.

Por eso es clave que cada elemento que se mueve venga en su propia capa.

Adjunto como referencia de estilo y personajes: `hoja-personajes.png` y los fotogramas `clip-01_inicio.png`, `clip-02_inicio.png` y `clip-03_inicio.png`. Mantén exactamente ese estilo.

## ESTILO (igual que lo ya entregado)
- **Minimalismo humano:**
  - Figuras con proporciones anatómicas reales y manos de 5 dedos bien formadas.
  - Acabado 3D mate tipo porcelana o arcilla satinada y ropa lisa.
  - Rostros sin rasgos, no identificables.
  - Nada de cuerpos hechos de cilindros o esferas, ni maniquíes articulados.
- **Paleta:**
  - Fondo azul noche #0B1220, con gradiente a #13213D.
  - Cian #22D3EE para luz y sistema nervioso; coral #FF6B5E como acento y para "tensión"; blanco para brillos.
  - Figuras en azul pizarra (#2A3F66 a #5B6F94).
  - Para la "calma" se puede usar un azul #3B82F6, y dorado #FBBF24 solo para los puntos clave de la escena 7.
- **Luz:** principal suave frontal-alta y contraluz cian. La misma dirección de luz en todas las capas de una escena.
- **Personajes:**
  - **P1** protagonista (de la hoja de personajes).
  - **P2** fisioterapeuta de los años 40, coral.
  - **P3** médico de los años 40, cian.
  - **NUEVO P4** fisioterapeuta actual: adulto, polo o casaca clínica lisa en blanco hielo con detalles coral, sin logos, rostro sin rasgos. Agrégalo a la hoja de personajes (frente, perfil, 3/4 y primer plano de manos).

## REGLAS TÉCNICAS (obligatorias)
1. **Lienzo:** 1350 x 2400 px, vertical 9:16, un 25 % mayor que el video, para poder hacer zoom sin perder nitidez.
2. **Imagen a sangre:** debe llenar TODO el lienzo. **Prohibido** colocar la ilustración dentro de un rectángulo más pequeño o con marco (fue un defecto de la entrega anterior).
3. **Registro:** todas las capas de una escena tienen el mismo tamaño de lienzo y están alineadas. Apiladas en orden, reproducen la composición sin moverlas.
4. **Formato:**
   - **Fondos:** PNG opacos.
   - **Personajes, objetos y luces:** PNG RGBA con transparencia limpia, bordes suaves y sin halo blanco.
   - **Luces y brillos:** en capa aparte sobre transparente, porque los voy a hacer pulsar.
5. **Relleno de huecos:** cuando separes una extremidad o una figura, rellena (inpainting) lo que queda detrás en la capa de abajo, para que al moverla no aparezca un hueco.
6. **Cero texto, letras, números, logos o marcas de agua.**
7. **Composición en 1080x1920 (el centro del lienzo):**
   - Franja superior hasta y≈620: libre o de poco contraste (va el título).
   - Franja inferior desde y≈1280: nada importante (van los subtítulos).
   - Sujeto principal entre y≈600 y y≈1300.
8. **Pivotes:** por cada capa que deba rotar (brazo, antebrazo, pierna), entrega en `capas.json` el punto de pivote en píxeles del lienzo, por ejemplo: `{"e07_brazo": {"pivote": [702, 1105], "articulacion": "hombro"}}`.
9. **Vista previa:** entrega por escena un `eXX_composite.png` con todas las capas apiladas.
10. **Opcional, muy útil:** un mapa de profundidad en escala de grises por fondo (`eXX_fondo_depth.png`, blanco = cerca) para hacer paralaje 3D.

## ESCENAS 1–3 (rehacer en capas, mismo diseño que los clips entregados)
- **e01 Hook:**
  - `e01_fondo` (azul noche con partículas tenues).
  - `e01_cerebro` (el cerebro de porcelana azul, transparente alrededor y sin las luces).
  - `e01_sinapsis` (solo los puntos y líneas de luz cian, sobre transparente).
  - `e01_brillo_suelo`.
- **e02 ¿Qué es?:**
  - `e02_fondo` con suelo reflectante.
  - `e02_p1` (P1 caminando, cuerpo sin el sistema nervioso).
  - `e02_nervios` (solo el sistema nervioso cian: cerebro, médula y nervios de brazos y piernas, alineado con P1, sobre transparente).
  - `e02_anillos` (los 3 anillos de cabeza, columna y muslo, cada uno en capa propia).
- **e03 Origen:**
  - `e03_fondo` (cielo y ciudad lejana con la torre del reloj).
  - `e03_ciudad_media` (edificios y río).
  - `e03_suelo` (plano frontal con faroles).
  - `e03_p2` y `e03_p3` (cada pionero en capa propia).
  - `e03_arbustos_frente` (desenfocados, primer plano).

## ESCENAS NUEVAS 4–10

### e04 — Neuroplasticidad (0:20–0:28)
Red neuronal en un espacio oscuro: nodos esféricos de porcelana unidos por filamentos finos, con profundidad de campo.
- `e04_fondo`: red lejana desenfocada.
- `e04_red`: red principal enfocada, con un **hueco en el centro** donde falta una conexión.
- `e04_dano`: el nodo dañado y sus filamentos rotos, en coral tenue, sobre transparente.
- `e04_nodo_nuevo`: un nodo brillante cian ligeramente desplazado del dañado, sobre transparente.
- Las rutas nuevas que se dibujan las hago yo en Remotion; deja espacio libre alrededor del hueco.
> EN: "Minimalist neural network in deep navy space, smooth porcelain blue spherical neurons connected by thin glowing cyan filaments, shallow depth of field, one central gap where a connection is missing, soft cyan rim light, vertical, no text."

### e05 — El problema: tono alterado (0:28–0:37)
Dos figuras P1 lado a lado, caminando hacia la cámara.
- **Izquierda:** marcha fluida y natural.
- **Derecha:** el mismo P1 con patrón típico tras un ictus: brazo flexionado pegado al pecho, muñeca flexionada, pierna rígida en extensión con leve circunducción y tronco algo inclinado. **Representación respetuosa, nada caricaturesca.**

Capas:
- `e05_fondo`: suelo oscuro con rejilla tenue en perspectiva.
- `e05_p1_normal`: la figura de la izquierda.
- `e05_p1_afectado` (sin el brazo afectado) y `e05_p1_afectado_brazo` (el brazo flexionado, con pivote en el hombro).
- `e05_camino_verde` (línea recta) y `e05_camino_coral` (línea que se desvía), cada uno en capa propia, para que se dibujen.
- `e05_tension`: brillo coral sobre el bíceps y el hombro afectados, sobre transparente.

### e06 — Paso 1: Inhibir (0:37–0:46)
Primer plano de 3/4 del hombro y la pelvis de P1 (brazo afectado flexionado). P4 aplica las manos con suavidad: una sobre el hombro y otra sobre la pelvis.
- `e06_fondo`.
- `e06_p1_cuerpo` (sin el antebrazo).
- `e06_p1_antebrazo_flexionado` y `e06_p1_antebrazo_relajado` (misma longitud, pivote en el codo; los uso para pasar de tenso a relajado).
- `e06_mano_hombro` y `e06_mano_pelvis` (manos y antebrazos de P4, cada una en capa propia).
- `e06_tension_coral` y `e06_calma_azul`: brillos sobre la zona del hombro y el brazo, cada uno en capa propia; los cruzo en el tiempo.
- Las ondas circulares de calma las hago yo.

### e07 — Paso 2: Facilitar (0:46–0:55)
Plano medio en 3/4. P1 de pie alcanza un objeto luminoso (esfera cian pequeña) a la altura del hombro. P4 está a su lado y guía el brazo desde debajo del codo; su otra mano está en la pelvis de P1.
- `e07_fondo`.
- `e07_p1_cuerpo` (sin el brazo que alcanza).
- `e07_p1_brazo_bajo` y `e07_p1_brazo_alto` (el brazo en posición inicial, colgando, y final, extendido hacia el objeto; pivote en el hombro).
- `e07_p4` (terapeuta sin la mano guía) y `e07_p4_mano_guia`.
- `e07_objeto` (esfera cian).
- Los orbes dorados de pelvis, tronco, hombro y mano los pongo yo: indica en `capas.json` las coordenadas de esos 4 puntos.

### e08 — El ciclo Bobath (0:55–1:04)
La rueda la construyo yo en Remotion. Solo necesito:
- `e08_fondo`.
- **4 iconos ilustrados** de 700 x 700 px, sobre transparente, en el mismo estilo de porcelana con luz cian:
  - `e08_observar`: ojo estilizado mirando una silueta humana pequeña.
  - `e08_analizar`: silueta humana con líneas de análisis del movimiento.
  - `e08_tratar`: dos manos guiando un brazo.
  - `e08_reevaluar`: flecha circular alrededor de una silueta.

### e09 — ¿Para quién? (1:04–1:13)
Cuatro personajes de cuerpo entero, cada uno en un PNG de 900 x 1200 px sobre transparente, con dignidad y actitud activa (no lastimeros):
- `e09_nino`: niño de unos 7 años con parálisis cerebral, de pie con apoyo leve o andador infantil.
- `e09_mayor`: adulto mayor con bastón, tras un ictus.
- `e09_silla`: joven en silla de ruedas moderna (lesión medular).
- `e09_adulto`: adulto de pie (esclerosis múltiple), postura serena.

Agrega `e09_fondo`. Las tarjetas y los iconos los hago yo.

### e10 — Cierre (1:13–1:20)
P1 caminando de frente hacia la cámara, plano entero, seguro y sereno.
- `e10_fondo_oscuro` y `e10_fondo_iluminado` (el mismo fondo; el segundo con un resplandor cian y blanco detrás de la figura). Los cruzo para "iluminar".
- `e10_p1`.
- `e10_nervios` (sistema nervioso completo encendido, alineado con P1).
- `e10_cerebro_luz` (resplandor sobre la cabeza que conecta con la médula).

## PROHIBIDO
- Texto o logos.
- Pacientes reales o rostros reconocibles.
- Sangre, heridas o equipo médico de marca.
- Estética de terror y glitches.
- Manos deformes y cuerpos geométricos.
- Imágenes con marco o dentro de un rectángulo.

## ENTREGA
En la carpeta `bobath-reel/public/capas/` del repositorio (rama `claude/bobath-method-reel-q9ukd1`), con:
1. Una subcarpeta por escena (`e01/` … `e10/`) con las capas nombradas exactamente como arriba.
2. Un `eXX_composite.png` por escena.
3. `capas.json` con los pivotes y coordenadas pedidos.
4. La hoja de personajes actualizada con P4.
5. Una ficha corta con el modelo usado, los prompts, y qué capas se rellenaron con inpainting.

Prioridad si no da tiempo para todo: **e04, e05, e06, e07** (las escenas más importantes del método); luego e10, e09, e08, y al final rehacer e01–e03 en capas.
