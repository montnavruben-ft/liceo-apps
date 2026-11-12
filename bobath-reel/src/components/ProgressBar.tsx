import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANCHO_UTIL, PALETA, ZONA_SEGURA } from "../constants";

/** Barra de progreso fina, justo por encima de la zona segura inferior. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: ZONA_SEGURA.lados,
        top: height - ZONA_SEGURA.abajo - 8,
        width: ANCHO_UTIL,
        height: 8,
        borderRadius: 4,
        background: "rgba(255,255,255,0.14)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          borderRadius: 4,
          background: `linear-gradient(90deg, ${PALETA.cian}, ${PALETA.coral})`,
          boxShadow: `0 0 12px ${PALETA.cian}`,
        }}
      />
    </div>
  );
};
