import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { breathe, DrawPath, LightLayer, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

// Trayectorias sobre el suelo, desde los pies hacia la cámara (cuadro 1080x1920)
const RECTA = "M 240 1500 L 240 1930";
const TORCIDA = "M 860 1480 C 960 1560, 760 1640, 880 1720 S 760 1860, 830 1940";

// Escena 5 — El problema: marcha fluida (trayectoria recta verde) frente a marcha con tono alterado
// (trayectoria torcida coral y tensión que vibra en brazo y pierna). Paneo horizontal izq. → der.
export const E05Problema: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const x = ease(frame, [0, duration], [30, -30]);
  const scale = 1.04 * breathe(frame, 0.008, 40);
  const trail = ease(frame, [20, 200], [0, 1]);
  const tension = 0.55 + 0.45 * Math.abs(Math.sin(frame / 5));
  const jitter = Math.sin(frame * 2.7) * 3;
  return (
    <AbsoluteFill>
      <Plate src="e05/e05_composite.png" camera={{ scale, x, y: 140, origin: [540, 1100] }}>
        <DrawPath d={RECTA} progress={trail} color={PALETA.verde} width={12} />
        <DrawPath d={TORCIDA} progress={trail} color={PALETA.coral} width={12} />
        <LightLayer src="e05/e05_tension.png" opacity={tension} style={{ transform: `translateX(${jitter}px)` }} />
      </Plate>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
