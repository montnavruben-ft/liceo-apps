import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { breathe, Glow, Plate, Ring } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

// Puntos de la ilustración e06_composite (cuadro 1080x1920)
const HOMBRO: [number, number] = [585, 905]; // zona con tensión (brillo coral en la imagen)
const MANO_HOMBRO: [number, number] = [550, 800];
const MANO_CADERA: [number, number] = [600, 1310];

// Escena 6 — Paso 1 Inhibir: las manos del terapeuta en hombro y cadera; el brillo de tensión coral
// del hombro se calma y pasa a azul; ondas de calma salen de las manos. Primer plano con zoom-in lento.
export const E06Inhibir: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const scale = ease(frame, [0, duration], [1.0, 1.1]) * breathe(frame, 0.005, 60);
  const calm = ease(frame, [70, 200], [0, 1]); // 0 = tenso, 1 = calmado
  const tense = 1 - calm;
  const vib = Math.sin(frame * 2.7) * 4 * tense;
  // presión suave de las manos: un leve "latido" de la imagen en las zonas de contacto
  const press = 0.5 - 0.5 * Math.cos(Math.max(0, frame - 40) / 14);
  return (
    <AbsoluteFill>
      <Plate src="e06/e06_composite.png" camera={{ scale, y: 120, origin: [580, 1250] }}>
        {/* tensión: el brillo coral de la imagen se refuerza y vibra… */}
        <Glow x={HOMBRO[0] + vib} y={HOMBRO[1]} r={230} color={PALETA.coral} opacity={0.55 * tense * (0.7 + 0.3 * Math.sin(frame / 4))} />
        {/* …y se recolorea a azul al calmarse (modo "color" sobre la zona) */}
        <Glow x={HOMBRO[0]} y={HOMBRO[1]} r={260} color={PALETA.azulCalma} opacity={0.95 * calm} blend="color" core={0.4} />
        <Glow x={HOMBRO[0]} y={HOMBRO[1]} r={240} color={PALETA.azulCalma} opacity={0.45 * calm} />
        {/* contacto de las manos */}
        <Glow x={MANO_HOMBRO[0]} y={MANO_HOMBRO[1]} r={90} color={PALETA.blanco} opacity={0.18 * press} />
        <Glow x={MANO_CADERA[0]} y={MANO_CADERA[1]} r={90} color={PALETA.blanco} opacity={0.18 * press} />
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <Ring x={MANO_HOMBRO[0]} y={MANO_HOMBRO[1]} progress={(frame - 70 - i * 45) / 60} color={PALETA.azulCalma} maxR={260} />
            <Ring x={MANO_CADERA[0]} y={MANO_CADERA[1]} progress={(frame - 90 - i * 45) / 60} color={PALETA.cian} maxR={220} />
          </React.Fragment>
        ))}
      </Plate>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
