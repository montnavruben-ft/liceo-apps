import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { HEIGHT, PALETA, WIDTH } from "../constants";
import { seeded } from "../utils";

/**
 * Piezas para animar ilustraciones fijas sin video: todo se mueve con el frame actual
 * (interpolate/spring en cada escena), así que el render es nítido y determinista.
 *
 * Sistema de coordenadas: los hijos de <Plate> se posicionan en píxeles del cuadro 1080x1920
 * de la imagen ANTES del movimiento de cámara, así que se mueven pegados a la ilustración.
 */

export type Camera = { scale?: number; x?: number; y?: number; origin?: [number, number] };

/** Imagen a pantalla completa con "cámara" (zoom y desplazamiento) y capas encima. */
export const Plate: React.FC<{
  src: string;
  camera?: Camera;
  filter?: string;
  children?: React.ReactNode;
  imgStyle?: React.CSSProperties;
}> = ({ src, camera = {}, filter, children, imgStyle }) => {
  const { scale = 1, x = 0, y = 0, origin = [WIDTH / 2, HEIGHT / 2] } = camera;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: PALETA.fondo }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH,
          height: HEIGHT,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: `${origin[0]}px ${origin[1]}px`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: WIDTH, height: HEIGHT, objectFit: "cover", filter, ...imgStyle }} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Capa de luz entregada sobre negro puro: se mezcla en modo "pantalla". */
export const LightLayer: React.FC<{ src: string; opacity: number; style?: React.CSSProperties }> = ({ src, opacity, style }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, objectFit: "cover", mixBlendMode: "screen", opacity, ...style }}
  />
);

/** Resplandor radial (luz) centrado en x,y. */
export const Glow: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
  blend?: React.CSSProperties["mixBlendMode"];
  core?: number; // 0..1, dónde empieza a desvanecerse
}> = ({ x, y, r, color, opacity, blend = "screen", core = 0 }) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} ${core * 70}%, transparent 70%)`,
        mixBlendMode: blend,
        opacity,
        pointerEvents: "none",
      }}
    />
  );

/** Onda circular que se expande (progress 0..1). */
export const Ring: React.FC<{ x: number; y: number; progress: number; color: string; maxR: number; width?: number }> = ({
  x,
  y,
  progress,
  color,
  maxR,
  width = 5,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = 12 + progress * maxR;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `${width}px solid ${color}`,
        boxShadow: `0 0 24px ${color}, inset 0 0 18px ${color}`,
        opacity: (1 - progress) * 0.9,
      }}
    />
  );
};

/** Orbe brillante (puntos clave, nodos). intensity 0..1, pop = escala extra. */
export const Orb: React.FC<{ x: number; y: number; r: number; color: string; intensity: number; pop?: number }> = ({
  x,
  y,
  r,
  color,
  intensity,
  pop = 1,
}) => {
  if (intensity <= 0.01) return null;
  const s = r * pop;
  return (
    <>
      <Glow x={x} y={y} r={s * 3.2} color={color} opacity={0.55 * intensity} />
      <div
        style={{
          position: "absolute",
          left: x - s,
          top: y - s,
          width: s * 2,
          height: s * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${color} 45%, ${color} 100%)`,
          boxShadow: `0 0 ${s}px ${color}`,
          opacity: Math.min(1, intensity * 1.2),
        }}
      />
    </>
  );
};

/** Trazo SVG que se dibuja (progress 0..1). Coordenadas en el cuadro 1080x1920. */
export const DrawPath: React.FC<{
  d: string;
  progress: number;
  color: string;
  width?: number;
  opacity?: number;
  glow?: boolean;
}> = ({ d, progress, color, width = 8, opacity = 1, glow = true }) =>
  progress <= 0 ? null : (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - Math.min(1, progress)}
        opacity={opacity}
        style={glow ? { filter: `drop-shadow(0 0 ${width * 1.5}px ${color})` } : undefined}
      />
    </svg>
  );

/** Partículas finas que suben (polvo de luz). */
export const Motes: React.FC<{ count?: number; color?: string; seed?: number; speed?: number; opacity?: number }> = ({
  count = 45,
  color = PALETA.cian,
  seed = 3,
  speed = 1.2,
  opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const motes = useMemo(() => {
    const rnd = seeded(seed);
    return Array.from({ length: count }, () => ({ x: rnd() * WIDTH, y: rnd() * HEIGHT, s: 2 + rnd() * 5, v: 0.4 + rnd(), ph: rnd() * 6.28 }));
  }, [count, seed]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = (((m.y - frame * speed * m.v) % HEIGHT) + HEIGHT) % HEIGHT;
        const tw = 0.5 + 0.5 * Math.sin(frame / 14 + m.ph);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x + Math.sin(frame / 30 + m.ph) * 10,
              top: y,
              width: m.s,
              height: m.s,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${m.s * 3}px ${color}`,
              opacity: opacity * (0.3 + 0.7 * tw),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Ligera "respiración" de la imagen (escala cíclica muy sutil). */
export const breathe = (frame: number, amount = 0.006, period = 70) => 1 + amount * Math.sin((frame / period) * Math.PI * 2);
