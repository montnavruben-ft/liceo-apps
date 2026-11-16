import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame } from "remotion";
import pulse from "../audio/sfx-pulse.mp3";
import { OverlayText } from "../components/OverlayText";
import { breathe, Glow, Motes, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

// Escena 1 — Hook: cerebro de porcelana, oleada de luz que recorre las sinapsis, push-in 1.0 → 1.15.
export const E01Hook: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const zoom = ease(frame, [0, duration], [1, 1.15]) * breathe(frame);
  const pulseK = 0.5 + 0.5 * Math.sin(frame / 6);
  // oleada: un foco de luz que cruza el cerebro de atrás (izq.) hacia adelante (der.)
  const waveX = ease(frame, [0, duration], [180, 920]);
  return (
    <AbsoluteFill>
      <Plate
        src="e01/e01_composite.png"
        camera={{ scale: zoom, origin: [540, 1020] }}
        filter={`brightness(${1 + 0.1 * pulseK}) saturate(${1 + 0.15 * pulseK})`}
      >
        <Glow x={waveX} y={1000} r={330} color={PALETA.cian} opacity={0.32} />
      </Plate>
      <Motes count={40} speed={1.4} />
      {[10, 50, 90].map((f) => (
        <Sequence key={f} from={f} durationInFrames={20}>
          <Audio src={pulse} volume={0.6} />
        </Sequence>
      ))}
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} delay={2} />
    </AbsoluteFill>
  );
};
