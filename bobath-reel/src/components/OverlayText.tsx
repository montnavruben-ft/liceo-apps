import { fitText } from "@remotion/layout-utils";
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANCHO_UTIL, PALETA, TEXTO_MIN_PX, ZONA_SEGURA } from "../constants";
import { FUENTE_TEXTO, FUENTE_TITULO, useFontsReady } from "../fonts";
import { clamp } from "../utils";

const Arrow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.8} height={size * 0.6} viewBox="0 0 40 30" style={{ display: "block", margin: `0 ${size * 0.12}px` }}>
    <path d="M2 15 H32 M22 5 L34 15 L22 25" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type OverlayTextProps = {
  title: string;
  subtitle?: string | null;
  /** duración nominal de la escena (frames); la salida hace fade en los últimos 10 */
  durationInFrames: number;
  top?: number;
  maxSize?: number;
  delay?: number;
  exit?: boolean;
  /** índice del segmento resaltado cuando el título usa "→" */
  activeSegment?: number;
};

/**
 * Texto grande en pantalla dentro de la zona segura. Entrada con spring, salida con fade.
 * El tamaño se ajusta para que la palabra más larga quepa en 920 px, nunca por debajo de 64 px.
 */
export const OverlayText: React.FC<OverlayTextProps> = ({
  title,
  subtitle,
  durationInFrames,
  top = ZONA_SEGURA.arriba + 110,
  maxSize = 104,
  delay = 4,
  exit = true,
  activeSegment,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ready = useFontsReady();

  const segments = title.split("→").map((s) => s.trim());
  const words = title.replace(/→/g, " ").split(/\s+/).filter(Boolean);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const fit = ready ? fitText({ text: longest, withinWidth: ANCHO_UTIL - 20, fontFamily: FUENTE_TITULO, fontWeight: "800" }).fontSize : maxSize;
  const size = Math.max(TEXTO_MIN_PX, Math.min(maxSize, Math.floor(fit * 0.97)));

  const enter = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
  const enterSub = spring({ frame: frame - delay - 8, fps, config: { damping: 16, stiffness: 120 } });
  const out = exit ? interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp) : 1;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: ZONA_SEGURA.lados,
        width: ANCHO_UTIL,
        textAlign: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          fontFamily: FUENTE_TITULO,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.04,
          color: PALETA.blanco,
          letterSpacing: "-0.01em",
          textShadow: `0 0 28px rgba(34,211,238,0.55), 0 6px 18px rgba(0,0,0,0.6)`,
          transform: `translateY(${(1 - enter) * 60}px) scale(${0.82 + 0.18 * enter})`,
          opacity: enter,
          wordBreak: "keep-all",
          overflowWrap: "normal",
        }}
      >
        {segments.length > 1 ? (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", rowGap: size * 0.1 }}>
          {segments.map((seg, i) => {
              const on = activeSegment === undefined || activeSegment === i;
              return [
                <span key={seg} style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      color: on ? PALETA.blanco : "rgba(255,255,255,0.38)",
                      textShadow: on && activeSegment !== undefined ? `0 0 30px ${PALETA.cian}` : undefined,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {seg}
                  </span>
                  {i < segments.length - 1 ? <Arrow size={size} color={PALETA.cian} /> : null}
                </span>,
                // 4 pasos: 2 filas de 2 para que ninguna flecha quede sola
                segments.length === 4 && i === 1 ? <div key="br" style={{ flexBasis: "100%", height: 0 }} /> : null,
              ];
            })}
          </div>
        ) : (
          title
        )}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 22,
            fontFamily: FUENTE_TEXTO,
            fontWeight: 600,
            fontSize: TEXTO_MIN_PX,
            lineHeight: 1.15,
            color: PALETA.cian,
            textShadow: "0 4px 14px rgba(0,0,0,0.75)",
            transform: `translateY(${(1 - enterSub) * 30}px)`,
            opacity: enterSub,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
