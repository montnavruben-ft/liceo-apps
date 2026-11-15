# Entrega técnica — Método Bobath (prueba de 15 s)

**Tipo de generación:** imágenes generadas por IA, compuestas en clips mediante movimiento de cámara 2.5D con FFmpeg. **No son videos generativos 3D**, y no incluyen animación corporal, transformación anatómica del cerebro ni formación progresiva real del sistema nervioso.

**Modelo de imágenes:** OpenAI ImageGen. **Software de video:** FFmpeg libx264. **Seed:** no expuesta por el servicio de generación de imágenes; no disponible.

| Archivo | Resolución | FPS | Duración | Método |
|---|---|---|---|---|
| clip-01_hook.mp4 | 1080x1920 | 30 | 4,5 s | Zoom progresivo sobre cerebro con sinapsis ilustradas |
| clip-02_que-es.mp4 | 1080x1920 | 30 | 8,5 s | Acercamiento y desplazamiento lateral sobre P1 y sistema nervioso |
| clip-03_origen.mp4 | 1080x1920 | 30 | 8,5 s | Acercamiento y desplazamiento sobre Londres y pioneros simbólicos |
| Prueba15s.mp4 | 1080x1920 | 30 | 15,0 s | Montaje 4+8+3 s, sin audio |

## Prompts de referencia del documento original

### Clip 01
Minimalist stylized anatomical human brain, translucent blue porcelain material, floating centered on a deep navy #0B1220 background, slowly rotating 45 degrees, cyan synapse lights igniting in a wave from back to front, thin glowing neural lines, sparse rising light particles, soft cyan rim light, subtle bloom, slow push-in, vertical 9:16, clean negative space at top, no text.

### Clip 02
Minimalist human figure, realistic anatomical proportions, smooth matte slate-blue sculpted material, simple fitted sportswear, featureless non-identifiable face, standing in an empty deep navy space with a subtle reflective floor. Thin cyan nervous system lines (brain, spinal cord, peripheral nerves) glow progressively from head to feet beneath the surface. Soft cyan ring pulses at head, spine and thigh. The figure takes one slow natural step forward. Slow lateral dolly from left to right, soft key light, cyan rim light, vertical 9:16, no text.

### Clip 03
Minimalist miniature diorama of 1940s London, simplified slate-blue building blocks rising from the ground, winding river with cyan glow, generic clock tower, deep navy background. Two small stylized human figures in 1940s attire (a woman in coral tones, a man in a doctor's coat in cyan tones), realistic proportions, featureless faces, emerge from the center with ease-out and stand together. 45-degree high-angle camera slowly orbiting 30 degrees, empty space above the figures, vertical 9:16, no text.

## Control de calidad
- No se introdujo texto ni audio dentro de los videos.
- Los clips cumplen resolución vertical y FPS pedidos.
- La ficha distingue material visual ilustrativo de las animaciones que no se pudieron implementar.
- La hoja de personajes es una referencia visual no un turnaround completo de producción.
- La prueba no simula pasos reales, aparición de anillos ni crecimiento de edificios: esas acciones requieren un modelo de video o rig 3D adicional.
