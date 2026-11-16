import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { breathe, Glow, Motes, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import type { SceneProps } from "../scenes/types";
import { clamp, ease } from "../utils";

// Zona de los dos pioneros en la ilustración (cuadro 1080x1920)
const FIG = { cx: 510, top: 690, bottom: 1400, rx: 300 };

const Year: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 110 } });
  const layers = Array.from({ length: 10 }, (_, i) => `0 ${i + 1}px 0 #0E7490`).join(", ");
  return (
    <div
      style={{
        position: "absolute",
        top: 560,
        width: "100%",
        textAlign: "center",
        fontFamily: FUENTE_TITULO,
        fontWeight: 800,
        fontSize: 130,
        color: PALETA.blanco,
        letterSpacing: "-0.02em",
        textShadow: `${layers}, 0 0 40px rgba(34,211,238,0.75), 0 22px 30px rgba(0,0,0,0.55)`,
        transform: `translateY(${(1 - k) * 60 + Math.sin(frame / 20) * 6}px) scale(${Math.max(0, k)}) perspective(800px) rotateX(18deg)`,
        opacity: Math.min(1, k * 1.5),
      }}
    >
      1940s
    </div>
  );
};

// Escena 3 — Origen: Londres en miniatura; los dos pioneros "emergen" de la sombra con un barrido
// de luz de abajo arriba; órbita simulada con desplazamiento lateral y zoom; año 1940s flotante.
export const E03Origen: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const x = ease(frame, [0, duration], [40, -40]);
  const scale = ease(frame, [0, duration], [1.08, 1.16]) * breathe(frame);
  // sombra sobre los pioneros que se retira de abajo hacia arriba
  const rise = interpolate(frame, [30, 95], [FIG.bottom + 80, FIG.top - 120], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const shadeWipe = `linear-gradient(to bottom, black ${rise - 120}px, transparent ${rise + 40}px)`;
  const ellipse = `radial-gradient(ellipse ${FIG.rx}px ${(FIG.bottom - FIG.top) / 2 + 60}px at ${FIG.cx}px ${(FIG.top + FIG.bottom) / 2}px, black 70%, transparent 100%)`;
  const lineOpacity = interpolate(frame, [30, 40, 90, 105], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Plate src="e03/e03_composite.png" camera={{ scale, x, origin: [540, 1050] }}>
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: ellipse, maskImage: ellipse }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8, 14, 28, 0.92)",
              WebkitMaskImage: shadeWipe,
              maskImage: shadeWipe,
            }}
          />
        </div>
        <Glow x={FIG.cx} y={rise} r={260} color={PALETA.cian} opacity={0.45 * lineOpacity} />
      </Plate>
      <Motes count={30} speed={0.8} opacity={0.5} />
      <TopShade />
      <Year />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
