import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar3D, NEUTRAL, walkPose } from "../components/Avatar3D";
import { Brain3D } from "../components/Brain3D";
import { OverlayText } from "../components/OverlayText";
import { Particles } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { CANAL, PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import { clamp, ease } from "../utils";
import type { SceneProps } from "./types";

const WALK_END = 150;

// Escena 10 — Cierre: avatar camina 3 pasos hacia la cámara, el fondo se ilumina, cerebro y cuerpo
// se conectan con luz completa; texto final con scale-in; dolly-in frontal y fade suave a blanco.
export const S10Cierre: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ease(frame, [0, WALK_END], [0, 1], (x) => x);
  const phase = k * Math.PI * 3; // 3 pasos = 1,5 ciclos
  const settle = interpolate(frame, [WALK_END - 20, WALK_END], [1, 0], clamp);
  const z = ease(frame, [0, WALK_END], [-2.2, 0.5]);
  const nerves = ease(frame, [20, 130], [0, 1]);
  const light = ease(frame, [30, 170], [0, 1]);
  const camZ = ease(frame, [0, duration], [5.8, 3.9]);
  const brainIn = spring({ frame: frame - 90, fps, config: { damping: 200 }, durationInFrames: 40 });
  const white = interpolate(frame, [duration - 16, duration], [0, 1], clamp);
  const pose = settle > 0 ? walkPose(phase, settle) : NEUTRAL;
  const channelIn = spring({ frame: frame - 120, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill>
      <SceneBackground brightness={light} />
      <Stage lightIntensity={1 + 0.6 * light}>
        <CameraRig position={[0, 1.35, z + camZ]} target={[0, 1.15, z]} />
        <Particles count={200} size={0.05} opacity={0.4 + 0.4 * light} center={[0, 1, -3]} />
        <gridHelper args={[14, 42, PALETA.cian, "#1B2A4A"]} />
        <Avatar3D pose={pose} position={[0, 0, z]} nerves={nerves} />
        {/* cerebro que se une a la cabeza con luz */}
        <Brain3D position={[0, 2.25 - 0.18 * brainIn, z - 0.05]} scale={0.26 * Math.max(0.001, brainIn)} activation={light} rotationY={frame / 60} />
        {brainIn > 0.01 ? (
          <mesh position={[0, 2.0, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.35 * brainIn, 8]} />
            <meshBasicMaterial color={PALETA.cian} transparent opacity={0.9 * light} toneMapped={false} />
          </mesh>
        ) : null}
        <mesh position={[0, 1.2, z - 0.4]}>
          <circleGeometry args={[1.25, 64]} />
          <meshBasicMaterial color={PALETA.cian} transparent opacity={0.16 * light} depthWrite={false} toneMapped={false} />
        </mesh>
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} exit={false} delay={8} />
      {CANAL ? (
        <div
          style={{
            position: "absolute",
            top: 640,
            width: "100%",
            textAlign: "center",
            fontFamily: FUENTE_TITULO,
            fontWeight: 700,
            fontSize: 64,
            color: PALETA.blanco,
            opacity: channelIn,
            transform: `scale(${0.8 + 0.2 * channelIn})`,
          }}
        >
          {CANAL}
        </div>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: PALETA.blanco, opacity: white }} />
    </AbsoluteFill>
  );
};
