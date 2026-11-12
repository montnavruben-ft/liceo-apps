import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import whoosh from "../audio/sfx-whoosh.mp3";
import { PALETA, TRANSICION } from "../constants";
import { clamp } from "../utils";

const Fade: React.FC<{ fadeIn: boolean; children: React.ReactNode }> = ({ fadeIn, children }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn ? interpolate(frame, [0, TRANSICION], [0, 1], clamp) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Fondo azul noche con viñeta y oscurecido superior para que el texto respire. */
export const SceneBackground: React.FC<{ glow?: string; brightness?: number }> = ({ glow = "#14284A", brightness = 0 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 70% at 50% 45%, ${glow} 0%, ${PALETA.fondo} 62%)`,
    }}
  >
    {brightness > 0 ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 60% at 50% 55%, rgba(34,211,238,${0.45 * brightness}) 0%, rgba(11,18,32,0) 70%)`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);

export const TopShade: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0) 32%)" }} />
);

/**
 * Envuelve una escena: empieza exactamente en startFrame y se mantiene TRANSICION frames
 * más para que la siguiente escena haga crossfade encima. Reproduce un whoosh en cada corte.
 */
export const Scene: React.FC<{
  name: string;
  startFrame: number;
  endFrame: number;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
}> = ({ name, startFrame, endFrame, isFirst, isLast, children }) => {
  const duration = endFrame - startFrame + (isLast ? 0 : TRANSICION);
  return (
    <Sequence name={name} from={startFrame} durationInFrames={duration}>
      <Fade fadeIn={!isFirst}>{children}</Fade>
      {!isFirst ? <Audio src={whoosh} volume={0.8} /> : null}
    </Sequence>
  );
};
