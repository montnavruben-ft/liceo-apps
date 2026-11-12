import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Avatar3D, BODY, walkPose } from "../components/Avatar3D";
import { OverlayText } from "../components/OverlayText";
import { Particles, Ripple } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { ease } from "../utils";
import type { SceneProps } from "./types";

// Escena 2 — ¿Qué es?: avatar sin rostro con sistema nervioso cian que se ilumina de arriba a abajo;
// halos señalan cerebro, médula y músculos; un paso lento; dolly-in lateral izq → der.
export const S02QueEs: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const nerves = ease(frame, [20, 150], [0, 1]);
  // un paso lento: medio ciclo de marcha en toda la escena
  const phase = ease(frame, [30, duration - 20], [0, Math.PI]);
  const z = ease(frame, [30, duration - 20], [0, 0.35]);
  const camX = ease(frame, [0, duration], [-2.6, 1.3]);
  const camZ = ease(frame, [0, duration], [6.4, 5.4]);

  const halos: { at: [number, number, number]; start: number }[] = [
    { at: [0, BODY.hipY + BODY.headY, z + 0.16], start: 40 },
    { at: [0, BODY.hipY + 0.3, z + 0.16], start: 85 },
    { at: [BODY.hipX, BODY.hipY - 0.25, z + 0.12], start: 130 },
  ];

  return (
    <AbsoluteFill>
      <SceneBackground />
      <Stage>
        <CameraRig position={[camX, 1.5, camZ]} target={[0, 1.25, z]} />
        <Particles count={140} size={0.04} opacity={0.5} center={[0, 1, -3]} />
        <Avatar3D pose={walkPose(phase, 0.55)} position={[0, 0, z]} nerves={nerves} rotationY={0} />
        {halos.map((h) =>
          [0, 40].map((off) => (
            <Ripple
              key={`${h.start}-${off}`}
              position={h.at}
              progress={((frame - h.start - off) % 80) / 60}
              color={PALETA.cian}
              maxRadius={0.32}
            />
          )),
        )}
        <gridHelper args={[12, 36, PALETA.cian, "#1B2A4A"]} position={[0, 0, 0]} />
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
