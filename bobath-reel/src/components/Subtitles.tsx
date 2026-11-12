import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import subtitles from "../data/subtitles.json";
import { ANCHO_UTIL, PALETA, TEXTO_MIN_PX, ZONA_SEGURA } from "../constants";
import { FUENTE_TEXTO } from "../fonts";
import { clamp } from "../utils";

// Distancia al borde inferior: deja libre la franja de botones/descripción de Reels y TikTok
// (~380 px) y mantiene el bloque dentro del tercio inferior (y > 1280).
const BOTTOM = 400;

/** Subtítulos quemados, sincronizados al frame desde src/data/subtitles.json. Máximo 2 líneas. */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = subtitles.cues.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cue) return null;
  const local = frame - cue.startFrame;
  const opacity = interpolate(local, [0, 4], [0, 1], clamp) * interpolate(frame, [cue.endFrame - 3, cue.endFrame], [1, 0], clamp);
  const y = interpolate(local, [0, 6], [14, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: ZONA_SEGURA.lados,
        width: ANCHO_UTIL,
        bottom: BOTTOM,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          background: PALETA.subtituloFondo,
          borderRadius: 26,
          padding: "16px 30px 20px",
          maxWidth: ANCHO_UTIL,
          fontFamily: FUENTE_TEXTO,
          fontWeight: 400,
          fontSize: TEXTO_MIN_PX,
          lineHeight: 1.18,
          color: PALETA.blanco,
          textAlign: "center",
          // sin cortar palabras: solo se parte entre palabras
          wordBreak: "normal",
          overflowWrap: "normal",
          hyphens: "none",
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
