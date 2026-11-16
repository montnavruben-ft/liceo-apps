import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { Glow, Motes, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { CANAL, PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import type { SceneProps } from "../scenes/types";
import { clamp, ease } from "../utils";

// Las imágenes de e10 miden 1125x2000; la figura ocupa de y≈71 (cabeza) a y≈1957 (pies).
const IMG_W = 1125;
const IMG_H = 2000;
const WALK_END = 150;

// Escena 10 — Cierre: P1 camina hacia la cámara (escala creciente con balanceo de pasos); el fondo
// se ilumina; el sistema nervioso se enciende como en rayos X (cerebro y cuerpo conectados);
// texto final con scale-in; fundido suave a blanco.
export const E10Cierre: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ease(frame, [0, WALK_END], [0, 1], (t) => t);
  const walking = frame < WALK_END;
  const phase = k * Math.PI * 3; // 3 pasos
  const bob = walking ? Math.abs(Math.sin(phase)) * -10 : 0;
  const sway = walking ? Math.sin(phase) * 1.4 : 0;
  const figScale = ease(frame, [0, WALK_END], [0.42, 0.62]);
  const feetY = ease(frame, [0, WALK_END], [1500, 1790]);
  const light = ease(frame, [30, 170], [0, 1]);
  const xray = interpolate(frame, [70, 100, 140, 175], [0, 1, 1, 0.35], clamp);
  const camZoom = ease(frame, [0, duration], [1.0, 1.08]);
  const white = interpolate(frame, [duration - 16, duration], [0, 1], clamp);
  const channelIn = spring({ frame: frame - 120, fps, config: { damping: 14 } });

  // contenedor de la figura: origen en los pies, que avanzan hacia la cámara
  const figW = IMG_W * figScale;
  const figH = IMG_H * figScale;
  return (
    <AbsoluteFill>
      <Plate src="e10/e10_fondo_oscuro.png" camera={{ scale: camZoom, origin: [540, 1300] }}>
        <Img src={staticFile("e10/e10_fondo_iluminado.png")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", opacity: light }} />
        <Glow x={540} y={1150} r={620} color={PALETA.cian} opacity={0.35 * light} />
        <div
          style={{
            position: "absolute",
            left: 540 - figW / 2,
            top: feetY - figH * (1957 / IMG_H) + bob,
            width: figW,
            height: figH,
            transform: `rotate(${sway}deg)`,
            transformOrigin: "50% 98%",
          }}
        >
          <Img src={staticFile("e10/e10_p1.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: `brightness(${1 - 0.45 * xray})` }} />
          {/* sistema nervioso: misma escala que la figura (cabeza y pies alineados) */}
          <Img
            src={staticFile("e10/e10_nervios.png")}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              mixBlendMode: "screen",
              opacity: xray,
              transformOrigin: "0 0",
              transform: `translate(${(-370 / IMG_W) * 100}%, ${(-686 / IMG_H) * 100}%) scale(1.61)`,
            }}
          />
        </div>
        {/* el cerebro se enciende */}
        <Glow x={540} y={feetY - figH * 0.92} r={140 * figScale * 2} color={PALETA.cian} opacity={0.6 * xray} />
      </Plate>
      <Motes count={45} speed={1.1} opacity={0.35 + 0.45 * light} />
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
