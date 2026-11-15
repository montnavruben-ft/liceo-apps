import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narration from "./audio/narration-es-lat.mp3";
import { OverlayText } from "./components/OverlayText";
import { ProgressBar } from "./components/ProgressBar";
import { Scene, TopShade } from "./components/Scene";
import { Subtitles } from "./components/Subtitles";
import { DURACION, ESCENAS, PALETA } from "./constants";
import { FUENTE_TITULO, useFontsReady } from "./fonts";
import { clamp } from "./utils";

/**
 * Prueba de render de los primeros 15 s (450 frames) usando como fondo los clips
 * generados por IA en public/clips/. Mismo guion, tiempos, títulos y subtítulos que BobathReel.
 */
export const PRUEBA_FRAMES = 450;

// ---------------------------------------------------------------------------
// Los clips 01 y 02 traen la imagen dentro de un rectángulo más pequeño que el cuadro,
// con bordes duros, que crece con el zoom de la cámara. Estas claves (medidas sobre los
// clips entregados) describen ese rectángulo en el tiempo para difuminar sus bordes.
// ---------------------------------------------------------------------------
type Rect = { f: number; l: number; t: number; r: number };
const RECT_CLIP_01: Rect[] = [
  { f: 0, l: 187, t: 481, r: 895 },
  { f: 134, l: 147, t: 422, r: 935 },
];
const RECT_CLIP_02: Rect[] = [
  { f: 0, l: 192, t: 521, r: 895 },
  { f: 120, l: 162, t: 507, r: 887 },
  { f: 254, l: 168, t: 494, r: 916 },
];

const rectAt = (keys: Rect[], frame: number) => {
  const fs = keys.map((k) => k.f);
  const v = (k: keyof Omit<Rect, "f">) => interpolate(frame, fs, keys.map((x) => x[k]), clamp);
  const l = v("l");
  const r = v("r");
  const t = v("t");
  const b = t + ((r - l) * 16) / 9; // la imagen interior es 9:16
  return { l, r, t, b };
};

/** Máscara con bordes difuminados que oculta el borde duro del rectángulo interior. */
const featherMask = (keys: Rect[], frame: number, feather = 95): React.CSSProperties => {
  const { l, r, t, b } = rectAt(keys, frame);
  const inset = 6;
  const h = `linear-gradient(to right, transparent ${l + inset}px, black ${l + feather}px, black ${r - feather}px, transparent ${r - inset}px)`;
  const v = `linear-gradient(to bottom, transparent ${t + inset}px, black ${t + feather + 30}px, black ${b - feather}px, transparent ${b - inset}px)`;
  return {
    WebkitMaskImage: `${h}, ${v}`,
    maskImage: `${h}, ${v}`,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
};

const Clip: React.FC<{ file: string; style?: React.CSSProperties }> = ({ file, style }) => (
  <OffthreadVideo src={staticFile(`clips/${file}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
);

// ---------------------------------------------------------------------------
// Escena 1 — Hook (0–120)
// ---------------------------------------------------------------------------
const P01: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const s = ESCENAS[0];
  // pulso de luz sobre las sinapsis (el clip es una imagen fija con zoom)
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <AbsoluteFill style={featherMask(RECT_CLIP_01, frame)}>
        <Clip file="clip-01_hook.mp4" style={{ filter: `brightness(${1 + 0.12 * pulse}) saturate(${1 + 0.15 * pulse})` }} />
      </AbsoluteFill>
      <TopShade />
      <OverlayText title={s.onScreen.title} subtitle={s.onScreen.subtitle} durationInFrames={duration} delay={2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Escena 2 — ¿Qué es? (120–360). El sistema nervioso "se enciende" de arriba abajo:
// una copia apagada del clip debajo y la copia normal revelada por una máscara que baja.
// ---------------------------------------------------------------------------
const P02: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const s = ESCENAS[1];
  const { t, b } = rectAt(RECT_CLIP_02, frame);
  const reveal = interpolate(frame, [20, 150], [t, b + 60], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const wipe = `linear-gradient(to bottom, black ${reveal - 140}px, transparent ${reveal}px)`;
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <AbsoluteFill style={featherMask(RECT_CLIP_02, frame)}>
        <AbsoluteFill>
          <Clip file="clip-02_que-es.mp4" style={{ filter: "brightness(0.55) saturate(0.35)" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ WebkitMaskImage: wipe, maskImage: wipe }}>
          <Clip file="clip-02_que-es.mp4" />
        </AbsoluteFill>
      </AbsoluteFill>
      <TopShade />
      <OverlayText title={s.onScreen.title} subtitle={s.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Escena 3 — Origen (360–600; la prueba muestra hasta el frame 450)
// ---------------------------------------------------------------------------
const Year: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: frame - 28, fps, config: { damping: 12, stiffness: 110 } });
  const layers = Array.from({ length: 10 }, (_, i) => `0 ${i + 1}px 0 #0E7490`).join(", ");
  return (
    <div
      style={{
        position: "absolute",
        top: 585,
        width: "100%",
        textAlign: "center",
        fontFamily: FUENTE_TITULO,
        fontWeight: 800,
        fontSize: 150,
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

const P03: React.FC<{ duration: number }> = ({ duration }) => {
  const s = ESCENAS[2];
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <Clip file="clip-03_origen.mp4" />
      <TopShade />
      <Year />
      <OverlayText title={s.onScreen.title} subtitle={s.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};

const PARTS = [P01, P02, P03];

export const Prueba15s: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      {ESCENAS.slice(0, 3).map((s, i) => {
        const Comp = PARTS[i];
        return (
          <Scene key={s.id} name={`${s.id}. ${s.name}`} startFrame={s.startFrame} endFrame={s.endFrame} isFirst={i === 0} isLast={i === 2}>
            <Comp duration={s.endFrame - s.startFrame} />
          </Scene>
        );
      })}
      <Subtitles />
      <ProgressBar total={DURACION} />
      <Audio src={narration} volume={1} />
    </AbsoluteFill>
  );
};
