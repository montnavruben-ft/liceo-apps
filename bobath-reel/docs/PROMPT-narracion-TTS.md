# Prompt para generar la narración TTS — Reel Método Bobath

Genera la narración en audio de un reel informativo de 80 s sobre el Método Bobath (rehabilitación neurológica). El video ya está montado y los tiempos son fijos: **cada clip tiene que caber en su ventana**. Entrega **10 archivos, uno por escena**, no un único audio largo. Yo los coloco en su tiempo exacto.

## VOZ
- **Idioma:** español latino **neutro** (es-MX neutro), sin regionalismos ni modismos, con seseo natural y sin voseo.
- **Timbre:** cálido, cercano y claro. Femenino o masculino; elige una voz y úsala igual en los 10 clips (misma voz, ajustes y volumen).
- **Tono:** divulgación científica para redes, con curiosidad y energía contenida. No es un anuncio, ni un noticiero, ni un tono médico frío. Que suene humano, nada robótico.
- **Ritmo:** el que pida cada clip (ver la tabla). Pausas breves en comas y dos puntos; nada de pausas largas al inicio ni al final.
- **Énfasis suave** en las palabras **en negrita** del texto.

## PRONUNCIACIÓN
- **Bobath** → "BÓ-bat" (acento en la primera sílaba; la "th" suena como "t").
- **Berta** → "BÉR-ta".
- **Karel** → "KÁ-rel".
- **ictus** → "ÍC-tus".
- **hemiparesias** → "e-mi-pa-RE-sias" (h muda).
- **esclerosis múltiple** → "es-cle-RÓ-sis MÚL-ti-ple".
- **reorganizarse** → "re-or-ga-ni-ZAR-se", sin cortar entre "re" y "or".
- **años cuarenta** → se dice "cuarenta", no "40".

## TEXTOS (literales, sin cambiar ni añadir palabras)

| Archivo | Duración máxima | Ritmo orientativo | Texto |
|---|---|---|---|
| `escena-01.mp3` | **3,5 s** | rápido, ~135 ppm, intriga | ¿Y si tu **cerebro** pudiera **reaprender** a moverse? |
| `escena-02.mp3` | **7,5 s** | ágil, ~140 ppm | Eso es el **Método Bobath**: una forma de rehabilitar el movimiento después de una lesión del sistema nervioso. |
| `escena-03.mp3` | **7,5 s** | pausado, ~100 ppm | Nació en **Londres**, en los años cuarenta, con **Berta y Karel Bobath**. |
| `escena-04.mp3` | **7,5 s** | ~105 ppm, revelación | Su idea era **revolucionaria**: el cerebro no está roto para siempre, **puede reorganizarse**. |
| `escena-05.mp3` | **8,5 s** | ~115 ppm, serio | Tras un ictus o una parálisis cerebral, el **tono** se altera y el movimiento sale **torcido**. |
| `escena-06.mp3` | **8,5 s** | ~100 ppm, calmado | Primero, el terapeuta **inhibe** ese tono anormal, con sus **manos** y con la **postura**. |
| `escena-07.mp3` | **8,5 s** | ~105 ppm | Después **facilita** el movimiento correcto, guiando desde **puntos clave** como la pelvis o el hombro. |
| `escena-08.mp3` | **8,5 s** | ~80 ppm, enumerando | **Observar**, **analizar**, **tratar** y volver a **evaluar**. Así, repetición tras repetición. |
| `escena-09.mp3` | **8,5 s** | ~100 ppm, claro | Se usa en hemiparesias, parálisis cerebral, traumatismos, lesiones medulares y esclerosis múltiple, entre otras. |
| `escena-10.mp3` | **7,0 s** | ~125 ppm, inspirador, cierre | El objetivo no es solo moverse. Es **volver a vivir** con la mayor **independencia** posible. |

Notas sobre el ritmo:
- Las escenas **1, 2 y 10** son las más justas. Si no caben, sube la velocidad de esos clips un 5–10 %, sin que suenen atropellados.
- La escena **8** tiene espacio de sobra: deja una pausa breve entre los cuatro verbos (observar… analizar… tratar… volver a evaluar).
- No se acortan textos. Si un clip no cabe ni acelerado, avísame y decidimos juntos.

## FORMATO DE ENTREGA
- **Audio:** MP3, 44,1 kHz, 192 kbps o más, mono. También sirve WAV de 44,1 kHz y 16 bits.
- **Contenido:** solo voz, sin música, sin efectos y sin reverberación.
- **Silencios:** como máximo 0,1 s al inicio y 0,2 s al final de cada clip.
- **Nivel:** volumen consistente entre clips. No hace falta normalizar a −16 LUFS: lo hace el script del proyecto.
- **Nombres:** exactamente `escena-01.mp3` … `escena-10.mp3`.
- **Dónde:** en `bobath-reel/src/audio/narracion/` (rama `claude/bobath-method-reel-q9ukd1`), o adjuntos.
- **Ficha:** una línea por clip con su duración real en segundos, más la herramienta y la voz usadas (nombre y ajustes de velocidad y estabilidad).

## SI LA HERRAMIENTA ADMITE SSML
Puedes usar `<prosody rate="…">` por clip y `<break time="200ms"/>` en las pausas de la escena 8. No uses `<emphasis level="strong">`: el énfasis debe ser sutil.

## CONTROL DE CALIDAD ANTES DE ENTREGAR
- Cada clip dura **menos** que su duración máxima.
- No falta ni sobra ninguna palabra; "Bobath" suena igual en las escenas 2 y 3.
- No hay respiraciones fuertes, chasquidos ni ruido de fondo.
- La voz y el volumen son iguales en los 10 clips.
