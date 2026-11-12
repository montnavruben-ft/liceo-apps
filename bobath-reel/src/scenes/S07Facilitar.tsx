import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { armFK, Avatar3D, BODY, NEUTRAL } from "../components/Avatar3D";
import { Hand3D } from "../components/Hand3D";
import { OverlayText } from "../components/OverlayText";
import { GlowOrb, TrailTube } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { clamp, lerp } from "../utils";
import type { SceneProps } from "./types";

const REACH_START = 70;
const REACH_LEN = 120;
const ROT_Y = 0.7;

// Escena 7 — Paso 2 Facilitar: orbes dorados en pelvis → tronco → hombro → mano; el terapeuta
// guía el brazo en un alcance hacia un objeto con trayectoria cian. Plano 3/4 con tilt-up.
export const S07Facilitar: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reachAt = (f: number) => spring({ frame: f - REACH_START, fps, config: { damping: 200 }, durationInFrames: REACH_LEN });
  const angles = (r: number) => ({ sh: lerp(0.1, 1.4, r), el: lerp(0.95, 0.08, r) });
  const r = reachAt(frame);
  const { sh, el } = angles(r);
  const { elbow } = armFK("L", sh, el);

  const trail = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = angles(reachAt(REACH_START + (i / 29) * REACH_LEN));
        const h = armFK("L", a.sh, a.el).hand;
        return [h.x, h.y, h.z] as [number, number, number];
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const trailProgress = interpolate(frame, [REACH_START, REACH_START + REACH_LEN], [0, 1], clamp);
  const final = armFK("L", 1.4, 0.08).hand;

  const orb = (start: number) => {
    const pop = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 160 } });
    return frame < start ? 0 : Math.min(1, 0.55 * pop + 0.45 * (0.6 + 0.4 * Math.sin((frame - start) / 6)));
  };
  const orbs = { side: "L" as const, pelvis: orb(18), trunk: orb(42), shoulder: orb(66), hand: orb(90) };

  const lookY = interpolate(frame, [REACH_START - 10, REACH_START + REACH_LEN], [1.15, 1.6], clamp);

  return (
    <AbsoluteFill>
      <SceneBackground glow="#16284D" />
      <Stage fov={40}>
        <CameraRig position={[2.3, 1.45, 3.4]} target={[0.35, lookY, 0.1]} />
        <gridHelper args={[10, 30, "#1E3A5F", "#16294A"]} />
        <group rotation={[0, ROT_Y, 0]}>
          <Avatar3D pose={{ ...NEUTRAL, shoulderL: sh, abdL: 0.02, elbowL: el }} orbs={orbs} />
          <TrailTube points={trail} progress={trailProgress} color={PALETA.cian} radius={0.012} />
          {/* objeto a alcanzar */}
          <mesh position={[final.x, final.y, final.z + 0.09]} rotation={[frame / 40, frame / 30, 0]}>
            <icosahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial color={PALETA.cian} emissive={PALETA.cian} emissiveIntensity={0.7} flatShading />
          </mesh>
          <GlowOrb position={[final.x, final.y, final.z + 0.09]} radius={0.06} color={PALETA.cian} intensity={0.4 + 0.6 * trailProgress} />
          {/* manos del terapeuta: una en la pelvis, otra guiando bajo el codo */}
          <Hand3D position={[BODY.hipX + 0.2, BODY.hipY + 0.02, 0.0]} rotation={[0, 1.45, 0.1]} />
          <Hand3D position={[elbow.x + 0.02, elbow.y - 0.08, elbow.z + 0.02]} rotation={[-1.2 + sh * 0.3, -0.6, 0]} />
        </group>
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
