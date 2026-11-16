import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { Glow, Motes, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

const STEP = 55;
const FIRST = 18;
const C: [number, number] = [540, 1040]; // centro de la rueda
const R = 300;
const NODE = 200;
const PASOS = [
  { word: "OBSERVAR", icon: "e08/e08_observar.png" },
  { word: "ANALIZAR", icon: "e08/e08_analizar.png" },
  { word: "TRATAR", icon: "e08/e08_tratar.png" },
  { word: "REEVALUAR", icon: "e08/e08_reevaluar.png" },
];

// Escena 8 — El ciclo Bobath: rueda de 4 nodos (iconos) que gira 90° por paso; el nodo activo
// hace pop y se ilumina; flechas luminosas recorren el anillo en loop. Leve zoom-out.
export const E08Ciclo: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const activations = [0, 1, 2, 3, 4].map((k) => FIRST + k * STEP);
  const steps = activations.map((a) => spring({ frame: frame - a + 14, fps, config: { damping: 15, stiffness: 90 } }));
  // girar en sentido antihorario lleva el nodo siguiente (a la derecha) arriba
  const rotation = -steps.slice(1).reduce((a, s) => a + s, 0) * 90;
  const current = activations.filter((a) => frame >= a).length - 1;
  const active = current < 0 ? -1 : current % 4;
  const zoom = ease(frame, [0, duration], [1.08, 1.0]);

  return (
    <AbsoluteFill>
      <Plate src="e08/e08_fondo.png" camera={{ scale: zoom, origin: C }}>
        <Glow x={C[0]} y={C[1]} r={520} color={PALETA.cian} opacity={0.18} />
        <div
          style={{
            position: "absolute",
            left: C[0] - R,
            top: C[1] - R,
            width: R * 2,
            height: R * 2,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg width={R * 2} height={R * 2} style={{ position: "absolute", overflow: "visible" }}>
            <circle cx={R} cy={R} r={R} fill="none" stroke={PALETA.cian} strokeOpacity={0.45} strokeWidth={6} />
            {/* flechas en loop, sentido horario (observar → analizar → tratar → reevaluar) */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = ((i / 12) * 360 + frame * 1.4) % 360;
              const rad = ((a - 90) * Math.PI) / 180;
              const glow = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.2 - i));
              return (
                <path
                  key={i}
                  d="M -12 -14 L 14 0 L -12 14 Z"
                  fill={PALETA.cian}
                  opacity={glow}
                  transform={`translate(${R + Math.cos(rad) * R} ${R + Math.sin(rad) * R}) rotate(${a})`}
                />
              );
            })}
          </svg>
          {PASOS.map((p, i) => {
            const ang = (i * 90 - 90) * (Math.PI / 180); // arriba, derecha, abajo, izquierda
            const on = active === i;
            const lastOn = activations.filter((f, k) => k % 4 === i && frame >= f).pop();
            const pop = lastOn === undefined ? 0 : spring({ frame: frame - lastOn, fps, config: { damping: 7, stiffness: 180 } });
            const s = on ? 1.12 + 0.25 * Math.sin(Math.min(1, pop) * Math.PI) : 0.88;
            return (
              <div
                key={p.word}
                style={{
                  position: "absolute",
                  left: R + Math.cos(ang) * R - NODE / 2,
                  top: R + Math.sin(ang) * R - NODE / 2,
                  width: NODE,
                  height: NODE,
                  borderRadius: "50%",
                  background: on ? "rgba(34,211,238,0.18)" : "rgba(11,18,32,0.92)",
                  border: `5px solid ${on ? PALETA.cian : "rgba(34,211,238,0.35)"}`,
                  boxShadow: on ? `0 0 60px ${PALETA.cian}` : "none",
                  transform: `rotate(${-rotation}deg) scale(${s})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: on ? 1 : 0.7,
                }}
              >
                <Img src={staticFile(p.icon)} style={{ width: NODE * 0.78, height: NODE * 0.78 }} />
              </div>
            );
          })}
        </div>
      </Plate>
      <Motes count={30} speed={0.7} opacity={0.4} />
      {active >= 0 ? (
        <div
          style={{
            position: "absolute",
            top: C[1] - 45,
            width: "100%",
            textAlign: "center",
            fontFamily: FUENTE_TITULO,
            fontWeight: 800,
            fontSize: 66,
            color: PALETA.cian,
            textShadow: "0 0 24px rgba(34,211,238,0.6)",
            transform: `scale(${0.7 + 0.3 * spring({ frame: frame - activations[current], fps, config: { damping: 12 } })})`,
          }}
        >
          {PASOS[active].word}
        </div>
      ) : null}
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} maxSize={64} activeSegment={active >= 0 ? active : undefined} />
    </AbsoluteFill>
  );
};
