import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar3D, NEUTRAL, walkPose, Wheelchair } from "../components/Avatar3D";
import { OverlayText } from "../components/OverlayText";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { ANCHO_UTIL, PALETA, ZONA_SEGURA } from "../constants";
import { ease } from "../utils";
import type { SceneProps } from "./types";

const CARD_W = (ANCHO_UTIL - 30) / 2; // 445
const CARD_H = 360;
const GRID_TOP = 600;
const STAGGER = 0.15; // segundos

const Icon: React.FC<{ kind: number }> = ({ kind }) => {
  const c = PALETA.coral;
  const common = { stroke: c, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={64} height={64} viewBox="0 0 64 64">
      <circle cx={32} cy={32} r={29} fill="rgba(255,107,94,0.14)" stroke={c} strokeWidth={3} />
      {kind === 0 ? <path d="M36 12 L22 35 H32 L28 52 L43 28 H33 Z" {...common} strokeWidth={4} /> : null}
      {kind === 1 ? <path d="M32 14 L37 27 L51 27 L40 36 L44 50 L32 42 L20 50 L24 36 L13 27 L27 27 Z" {...common} strokeWidth={4} /> : null}
      {kind === 2 ? (
        <>
          <circle cx={32} cy={34} r={14} {...common} />
          <circle cx={32} cy={34} r={3} fill={c} />
          <path d="M32 20 V14" {...common} />
        </>
      ) : null}
      {kind === 3 ? (
        <>
          <path d="M18 22 L32 34 L46 20 M32 34 L30 50 M32 34 L48 42" {...common} strokeWidth={3} />
          {[
            [18, 22],
            [46, 20],
            [30, 50],
            [48, 42],
            [32, 34],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={c} />
          ))}
        </>
      ) : null}
    </svg>
  );
};

const CardScene: React.FC<{ kind: number }> = ({ kind }) => {
  const frame = useCurrentFrame();
  const spin = Math.sin(frame / 40) * 0.5;
  return (
    <Stage width={CARD_W} height={CARD_H} fov={34}>
      <CameraRig position={[0, 1.0, 3.3]} target={[0, 0.82, 0]} />
      <gridHelper args={[4, 16, "#1E3A5F", "#16294A"]} />
      {kind === 0 ? <Avatar3D pose={walkPose(frame * 0.12, 0.6)} scale={0.66} rotationY={spin} color="#2B4C7E" /> : null}
      {kind === 1 ? (
        <Avatar3D pose={{ ...walkPose(frame * 0.08, 0.35), trunkLean: 0.22, shoulderR: 0.3, elbowR: 0.15 }} rotationY={spin - 0.3} cane color="#3A4E73" />
      ) : null}
      {kind === 2 ? (
        <group rotation={[0, spin + 0.5, 0]}>
          <Wheelchair spin={frame / 25} />
          <Avatar3D pose={{ ...NEUTRAL, shoulderL: 0.5, shoulderR: 0.5, elbowL: 0.6, elbowR: 0.6 }} seated position={[0, 0.02, 0.02]} color="#2B4C7E" />
        </group>
      ) : null}
      {kind === 3 ? <Avatar3D pose={walkPose(frame * 0.12, 0.8)} rotationY={spin + 0.3} color="#2B4C7E" /> : null}
    </Stage>
  );
};

// Escena 9 — ¿Para quién?: mosaico de 4 avatares (niño, adulto mayor, joven en silla, adulto)
// en tarjetas flotantes con icono; entrada en cascada desde abajo con stagger 0.15 s; zoom-out suave.
export const S09ParaQuien: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = ease(frame, [0, duration], [1.07, 1.0]);
  return (
    <AbsoluteFill>
      <SceneBackground />
      <div
        style={{
          position: "absolute",
          left: ZONA_SEGURA.lados,
          top: GRID_TOP,
          width: ANCHO_UTIL,
          display: "grid",
          gridTemplateColumns: `${CARD_W}px ${CARD_W}px`,
          gap: 30,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 40%",
        }}
      >
        {[0, 1, 2, 3].map((i) => {
          const enter = spring({ frame: frame - 14 - i * STAGGER * fps, fps, config: { damping: 15, stiffness: 120 } });
          const float = Math.sin((frame + i * 20) / 22) * 8;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
                borderRadius: 36,
                overflow: "hidden",
                background: "linear-gradient(160deg, rgba(34,211,238,0.14), rgba(19,33,61,0.85))",
                border: "2px solid rgba(34,211,238,0.45)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.45), inset 0 0 40px rgba(34,211,238,0.08)",
                transform: `translateY(${(1 - enter) * 700 + float}px)`,
                opacity: Math.min(1, enter * 1.4),
              }}
            >
              {frame >= 10 + i * STAGGER * fps ? <CardScene kind={i} /> : null}
              <div style={{ position: "absolute", top: 18, left: 18 }}>
                <Icon kind={i} />
              </div>
            </div>
          );
        })}
      </div>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
