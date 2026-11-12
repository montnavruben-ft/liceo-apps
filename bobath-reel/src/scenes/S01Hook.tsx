import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import pulse from "../audio/sfx-pulse.mp3";
import { Brain3D } from "../components/Brain3D";
import { OverlayText } from "../components/OverlayText";
import { Particles } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { clamp, ease } from "../utils";
import type { SceneProps } from "./types";

// Escena 1 — Hook: cerebro low-poly, oleada de sinapsis cian, push-in 1.0 → 1.15, rotación Y 0° → 45°.
export const S01Hook: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const zoom = ease(frame, [0, duration], [1, 1.15]);
  const rotY = ease(frame, [0, duration], [0, Math.PI / 4]);
  const activation = interpolate(frame, [6, 40], [0.15, 1], clamp);
  const floatY = Math.sin(frame / 18) * 0.06;
  return (
    <AbsoluteFill>
      <SceneBackground />
      <Stage>
        <CameraRig position={[0, 0, 9 / zoom]} target={[0, -0.2, 0]} />
        <Particles />
        <Brain3D position={[0, -0.25 + floatY, 0]} rotationY={rotY - 0.35} scale={1.25} activation={activation} />
      </Stage>
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
