# Prompt para el agente de video — clips base de la prueba de 15 s

Actúa como director de arte y generador de video con IA. Necesito clips cortos verticales que servirán de base visual para una **prueba de render de los primeros 15 segundos** de un reel informativo sobre el Método Bobath (rehabilitación neurológica). Yo uniré los clips en Remotion y añadiré encima los títulos, subtítulos, barra de progreso y audio. **Por eso los clips no deben llevar ningún texto.**

La prueba cubre 0:00–0:15: la escena 1 completa, la escena 2 completa y los primeros 3 s de la escena 3.

## ESTILO VISUAL — "minimalismo humano"
- **Minimalista:** fondos limpios, pocos elementos, mucho espacio negativo, gradientes suaves, sin ruido visual.
- **Figuras humanas creíbles, no geométricas:** proporciones anatómicas reales; hombros, cuello, cintura y manos con 5 dedos bien formados; postura natural y transferencia de peso al caminar. **Prohibido:** maniquí con articulaciones esféricas, cuerpos hechos de cilindros, cápsulas o esferas, robots y figuras de palitos.
- **Acabado:** 3D estilizado tipo escultura mate (porcelana o arcilla satinada), sombreado suave, sin textura de piel realista, ropa lisa y sencilla.
- **Rostros no identificables:** volúmenes apenas sugeridos (nariz y cejas), sin ojos detallados ni boca, o en contraluz. Ningún parecido con personas reales.
- **Paleta estricta:**
  - Fondo azul noche #0B1220, con gradiente a #13213D.
  - Cian #22D3EE para la luz y el sistema nervioso.
  - Coral #FF6B5E solo como acento puntual.
  - Blanco #FFFFFF para los brillos.
  - Figuras en azul pizarra desaturado (#2A3F66 a #5B6F94), para que el cian resalte.
- **Iluminación:** luz principal suave frontal-alta, contraluz cian por detrás y un leve bloom en las luces cian. Partículas de luz finas y escasas.
- **Movimiento:** lento y fluido, cámara estable, sin cortes dentro del clip y sin cámara en mano.

## ESPECIFICACIONES TÉCNICAS (obligatorias)
- **Formato:** vertical 9:16 a 1080x1920. Si el modelo no llega a esa resolución, el mínimo es 720x1280 e indícalo. 30 fps (si son 24 fps, indícalo). MP4 H.264, sin audio.
- **Sin texto:** nada de letras, números, logos, marcas de agua, subtítulos ni interfaz.
- **Composición en 1080x1920:**
  - **Título (120–620 px de altura):** fondo limpio o con elementos de poco contraste.
  - **Subtítulos (1280–1920 px):** nada importante en esa franja. Pueden asomar pies, pero no caras ni manos protagonistas.
  - **Sujeto principal:** centrado entre 600 y 1300 px de altura, con márgenes laterales de 80 px.
- **Duración:** cada clip dura su tiempo indicado más 0,5 s de margen al final, para el crossfade.
- **Coherencia:** genera primero la hoja de personajes y úsala como referencia en todos los clips. El protagonista se reutilizará en escenas futuras.

## PERSONAJES (hoja de referencia antes de los clips)
- **P1 "Protagonista":** adulto de unos 35 años, complexión media, ropa deportiva lisa y ajustada en gris azulado, pelo corto esculpido sin detalle de mechones, rostro no identificable. Vistas frontal, de perfil, 3/4 y de espalda, en pose neutra.
- **P2 "Fisioterapeuta, años 40":** mujer con silueta de época (falda midi, blusa, pelo recogido) y acabado coral suave.
- **P3 "Médico, años 40":** hombre con traje de época y bata, acabado cian suave.

P2 y P3 representan a los pioneros del método de forma simbólica: son siluetas genéricas, sin buscar parecido con personas reales.

## LISTA DE PLANOS

### Clip 01 — Hook — 4,5 s (se usa de 0:00 a 0:04)
- **Sujeto:** cerebro humano anatómico estilizado y minimalista, con hemisferios y surcos con forma real (no una esfera genérica). Acabado de porcelana azul translúcida, flotando en el centro.
- **Animación:** rotación lenta sobre el eje vertical, de 0° a 45°. Las sinapsis son puntos de luz cian que se encienden en oleada de atrás hacia adelante, unidos por líneas finas de red neuronal. Partículas que suben despacio.
- **Cámara:** frontal, con push-in suave (escala de 1.0 a 1.15).

> EN: "Minimalist stylized anatomical human brain, translucent blue porcelain material, floating centered on a deep navy #0B1220 background, slowly rotating 45 degrees, cyan synapse lights igniting in a wave from back to front, thin glowing neural lines, sparse rising light particles, soft cyan rim light, subtle bloom, slow push-in, vertical 9:16, clean negative space at top, no text."

### Clip 02 — ¿Qué es? — 8,5 s (se usa de 0:04 a 0:12)
- **Sujeto:** P1 de pie, cuerpo entero, en un espacio vacío azul noche con suelo reflectante sutil.
- **Sistema nervioso:** cerebro, médula y nervios de brazos y piernas visibles como líneas cian finas bajo la superficie. Se iluminan de la cabeza a los pies durante los primeros 5 s.
- **Acentos:** tres anillos cian suaves pulsan en la cabeza, la columna y el muslo, en ese orden.
- **Acción:** P1 da un único paso lento hacia adelante.
- **Cámara:** plano entero a medio, dolly lateral de izquierda a derecha con un ligero acercamiento.
- **Si el modelo no llega a 8,5 s:** entrega 02a (0–4,5 s) y 02b, que continúa desde el último fotograma de 02a.

> EN: "Minimalist human figure, realistic anatomical proportions, smooth matte slate-blue sculpted material, simple fitted sportswear, featureless non-identifiable face, standing in an empty deep navy space with a subtle reflective floor. Thin cyan nervous system lines (brain, spinal cord, peripheral nerves) glow progressively from head to feet beneath the surface. Soft cyan ring pulses at head, spine and thigh. The figure takes one slow natural step forward. Slow lateral dolly from left to right, soft key light, cyan rim light, vertical 9:16, no text."

### Clip 03 — Origen — 8,5 s (para la prueba solo se usan los 3 primeros s, de 0:12 a 0:15)
- **Sujeto:** maqueta en miniatura y minimalista de Londres en los años 40: bloques de edificios simplificados en azul pizarra, un río sinuoso con brillo cian y una torre de reloj genérica.
- **Animación:** en el primer segundo los edificios crecen desde el suelo. Del centro de la maqueta emergen P2 y P3, a escala de miniatura, con ease-out, y quedan de pie juntos.
- **Cámara:** cenital inclinada 45°, con una órbita lenta de 30° (de −15° a +15°).
- **Espacio para postproducción:** deja vacío el área sobre el grupo; ahí añadiré "1940s". El clip va sin texto.

> EN: "Minimalist miniature diorama of 1940s London, simplified slate-blue building blocks rising from the ground, winding river with cyan glow, generic clock tower, deep navy background. Two small stylized human figures in 1940s attire (a woman in coral tones, a man in a doctor's coat in cyan tones), realistic proportions, featureless faces, emerge from the center with ease-out and stand together. 45-degree high-angle camera slowly orbiting 30 degrees, empty space above the figures, vertical 9:16, no text."

## PROHIBIDO
- Texto de cualquier tipo y logos.
- Pacientes reales o rostros reconocibles.
- Sangre o heridas, y equipo médico de marca.
- Estética de terror y glitches.
- Manos o dedos deformes, y cuerpos hechos de primitivas geométricas.

## ENTREGA
1. Hoja de personajes en PNG.
2. Los clips con estos nombres exactos: `clip-01_hook.mp4`, `clip-02_que-es.mp4` (o `clip-02a` y `clip-02b`) y `clip-03_origen.mp4`.
3. El primer y el último fotograma de cada clip, en PNG.
4. Una ficha por clip con el modelo usado, el prompt final, la seed, la resolución, los fps y la duración real.
5. Control de calidad antes de entregar: regenera cualquier toma con texto visible, manos deformes, rostro detallado o figura geométrica. Como máximo 2 variantes por clip; marca la recomendada.

## CÓMO SE VAN A USAR
- Los clips van en `bobath-reel/public/clips/` y se componen con `<OffthreadVideo>` detrás de los títulos, los subtítulos y la barra de progreso.
- La composición de prueba se llama `Prueba15s`: 450 fotogramas, 15 s a 30 fps.
- Los tiempos del guion son fijos: si un clip no coincide, se recorta, no se estira. Respetar las duraciones mínimas es lo más importante.
