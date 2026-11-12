import React from "react";
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar3D, BODY, hemiPose } from "../components/Avatar3D";
import { Hand3D } from "../components/Hand3D";
import { OverlayText } from "../components/OverlayText";
import { Ripple } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { ease } from "../utils";
import type { SceneProps } from "./types";

// Escena 6 — Paso 1 Inhibir: manos del terapeuta sobre hombro y pelvis; el resorte rojo tenso
// se afloja y pasa a azul; onda de calma circular. Primer plano con zoom-in lento.
export const S06Inhibir: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const approach = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 40 });
  // presión suave (~2 cm) y lenta
  const press = 0.02 * (0.5 - 0.5 * Math.cos(Math.max(0, frame - 50) / 14));
  const tone = 1 - ease(frame, [70, 200], [0, 1]);
  const springColor = interpolateColors(tone, [0, 1], [PALETA.azulCalma, PALETA.coral]);
  const jitter = Math.sin(frame * 2.7) * 0.012 * tone;
  const camZ = ease(frame, [0, duration], [3.6, 2.9]);

  const shoulder: [number, number, number] = [BODY.shoulderX + 0.1, BODY.hipY + BODY.shoulderY + 0.02, 0.02];
  const pelvis: [number, number, number] = [0.17, BODY.hipY + 0.02, 0.1];
  const off = (1 - approach) * 0.35;

  return (
    <AbsoluteFill>
      <SceneBackground glow="#16284D" />
      <Stage fov={40}>
        <CameraRig position={[0.7, 1.3, camZ]} target={[0.12, 1.12, 0]} />
        <Avatar3D
          pose={{ ...hemiPose(0, "L", tone), hipAbdL: 0.02 }}
          rotationY={-0.15}
          spring={{ side: "L", color: springColor, tension: tone, jitter }}
        />
        {/* mano sobre el hombro (desde arriba-afuera) */}
        <Hand3D position={[shoulder[0] + 0.03 + off - press, shoulder[1] - 0.02 + off * 0.4, shoulder[2] + 0.02]} rotation={[0, 1.45, 0.35]} scale={1.1} />
        {/* mano sobre la pelvis (desde afuera) */}
        <Hand3D position={[pelvis[0] + 0.1 + off - press, pelvis[1] + 0.02, pelvis[2] - 0.04]} rotation={[0, 1.45, -0.1]} scale={1.1} />
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <Ripple position={[shoulder[0], shoulder[1], 0.16]} progress={(frame - 70 - i * 45) / 60} color={PALETA.azulCalma} maxRadius={0.5} />
            <Ripple position={[pelvis[0], pelvis[1], 0.2]} progress={(frame - 85 - i * 45) / 60} color={PALETA.cian} maxRadius={0.45} />
          </React.Fragment>
        ))}
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
