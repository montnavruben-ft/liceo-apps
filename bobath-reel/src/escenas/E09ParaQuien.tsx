import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { ANCHO_UTIL, PALETA, ZONA_SEGURA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

const CARD_W = (ANCHO_UTIL - 30) / 2; // 445
const CARD_H = 360;
const GRID_TOP = 600;
const STAGGER = 0.15; // segundos

const PERSONAS = [
  { src: "e09/e09_mayor.png", icon: 0 }, // ictus
  { src: "e09/e09_nino.png", icon: 1 }, // parálisis cerebral
  { src: "e09/e09_silla.png", icon: 2 }, // lesión medular
  { src: "e09/e09_adulto.png", icon: 3 }, // esclerosis múltiple
];

const Icon: React.FC<{ kind: number }> = ({ kind }) => {
  const c = PALETA.coral;
  const common = { stroke: c, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={64} height={64} viewBox="0 0 64 64">
      <circle cx={32} cy={32} r={29} fill="rgba(11,18,32,0.75)" stroke={c} strokeWidth={3} />
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

// Escena 9 — ¿Para quién?: cuatro personas (adulto mayor tras un ictus, niño con parálisis cerebral,
// joven con lesión medular, adulto con esclerosis múltiple) en tarjetas flotantes; entrada en cascada
// desde abajo con stagger de 0,15 s; zoom-out suave.
export const E09ParaQuien: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = ease(frame, [0, duration], [1.07, 1.0]);
  return (
    <AbsoluteFill>
      <Plate src="e09/e09_fondo.png" camera={{ scale: zoom }} />
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
        {PERSONAS.map((p, i) => {
          const enter = spring({ frame: frame - 14 - i * STAGGER * fps, fps, config: { damping: 15, stiffness: 120 } });
          const float = Math.sin((frame + i * 20) / 22) * 8;
          const sway = Math.sin((frame + i * 13) / 35) * 1.2;
          return (
            <div
              key={p.src}
              style={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
                borderRadius: 36,
                overflow: "hidden",
                background: "linear-gradient(160deg, rgba(34,211,238,0.16), rgba(19,33,61,0.9))",
                border: "2px solid rgba(34,211,238,0.45)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.45), inset 0 0 40px rgba(34,211,238,0.08)",
                transform: `translateY(${(1 - enter) * 700 + float}px)`,
                opacity: Math.min(1, enter * 1.4),
              }}
            >
              <Img
                src={staticFile(p.src)}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -6,
                  height: CARD_H * 1.0,
                  transform: `translateX(-50%) rotate(${sway}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />
              <div style={{ position: "absolute", top: 16, left: 16 }}>
                <Icon kind={p.icon} />
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
