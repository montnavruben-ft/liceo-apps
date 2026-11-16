import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import pulse from "../audio/sfx-pulse.mp3";
import { OverlayText } from "../components/OverlayText";
import { DrawPath, Glow, Motes, Orb, Plate, Ring } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { clamp, ease, lerp } from "../utils";

// Neuronas de la ilustración e04_fondo (cuadro 1080x1920)
// (centros medidos sobre la imagen)
const N = {
  a: [133, 1003],
  b: [918, 1126],
  d: [265, 1279], // neurona dañada
  big: [768, 1345],
  g: [390, 1110],
  low: [180, 1654],
} as const;
const NUEVO: [number, number] = [470, 1150]; // nodo reconectado, junto al dañado

// conexiones que se rompen (salen del nodo dañado)
const ROTAS = [N.a, N.g, N.low];
// rutas nuevas que crecen hacia el nodo reconectado, rodeando la lesión
const RUTAS = [
  `M ${N.a[0]} ${N.a[1]} C 260 960, 420 980, ${NUEVO[0]} ${NUEVO[1]}`,
  `M ${N.big[0]} ${N.big[1]} C 700 1240, 600 1160, ${NUEVO[0]} ${NUEVO[1]}`,
  `M ${N.b[0]} ${N.b[1]} C 800 1040, 620 1060, ${NUEVO[0]} ${NUEVO[1]}`,
  `M ${N.low[0]} ${N.low[1]} C 330 1500, 420 1330, ${NUEVO[0]} ${NUEVO[1]}`,
];

// Escena 4 — Neuroplasticidad: una neurona se daña (coral tenue, conexiones rotas) y la red se
// reorganiza con rutas cian nuevas. Cámara: zoom-out lento y luego push-in al nodo reconectado.
export const E04Neuroplasticidad: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const out = ease(frame, [0, 100], [1.18, 1.0]);
  const push = ease(frame, [110, duration - 5], [0, 1]);
  const scale = lerp(out, 1.45, push);
  const breakT = interpolate(frame, [35, 75], [0, 1], clamp);
  const t = frame / 30;

  return (
    <AbsoluteFill>
      <Plate src="e04/e04_fondo.png" camera={{ scale, origin: NUEVO }}>
        {/* conexiones del nodo dañado: se tiñen de coral y se cortan */}
        {ROTAS.map(([x, y], i) => {
          const gap = 0.45 * breakT;
          return (
            <DrawPath
              key={i}
              d={`M ${x} ${y} L ${N.d[0]} ${N.d[1]}`}
              progress={1 - gap}
              color={PALETA.coral}
              width={5}
              opacity={breakT * 0.75}
            />
          );
        })}
        <Glow x={N.d[0]} y={N.d[1]} r={210} color={PALETA.coral} opacity={breakT * (0.55 + 0.2 * Math.sin(t * 6))} />
        <Orb x={N.d[0]} y={N.d[1]} r={30} color={PALETA.coral} intensity={breakT * 0.9} />
        {/* rutas nuevas */}
        {RUTAS.map((d, k) => (
          <DrawPath key={k} d={d} progress={ease(frame, [90 + k * 14, 165 + k * 14], [0, 1])} color={PALETA.cian} width={7} />
        ))}
        <Orb
          x={NUEVO[0]}
          y={NUEVO[1]}
          r={26}
          color={PALETA.cian}
          intensity={interpolate(frame, [150, 175], [0, 1], clamp)}
          pop={1 + 0.15 * Math.sin(t * 8)}
        />
        {[0, 1, 2].map((i) => (
          <Ring key={i} x={NUEVO[0]} y={NUEVO[1]} progress={(frame - 170 - i * 22) / 45} color={PALETA.cian} maxR={140} width={4} />
        ))}
      </Plate>
      <Motes count={35} speed={0.6} opacity={0.45} />
      <Sequence from={160} durationInFrames={20}>
        <Audio src={pulse} volume={0.7} />
      </Sequence>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
