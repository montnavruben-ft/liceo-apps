import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { breathe, Plate, Ring } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { HEIGHT, PALETA, WIDTH } from "../constants";
import type { SceneProps } from "../scenes/types";
import { clamp, ease } from "../utils";

const SRC = "e02/e02_composite.png";
// Coordenadas (cuadro 1080x1920) de los anillos dibujados en la ilustración
const HALOS = [
  { x: 534, y: 480, start: 40 }, // cerebro
  { x: 534, y: 844, start: 85 }, // médula
  { x: 596, y: 1154, start: 130 }, // músculos (muslo)
];

// Escena 2 — ¿Qué es?: el sistema nervioso se enciende de la cabeza a los pies; halos en
// cerebro, médula y músculos; dolly lateral de izquierda a derecha.
export const E02QueEs: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const x = ease(frame, [0, duration], [45, -45]);
  const scale = ease(frame, [0, duration], [1.04, 1.08]) * breathe(frame);
  // barrido de encendido: copia apagada debajo, copia normal revelada de arriba abajo
  const reveal = interpolate(frame, [20, 150], [380, 1700], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const wipe = `linear-gradient(to bottom, black ${reveal - 160}px, transparent ${reveal}px)`;
  return (
    <AbsoluteFill>
      <Plate src={SRC} camera={{ scale, x, y: 200, origin: [540, 1000] }} filter="brightness(0.5) saturate(0.35)">
        <Img
          src={staticFile(SRC)}
          style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, objectFit: "cover", WebkitMaskImage: wipe, maskImage: wipe }}
        />
        {HALOS.map((h) =>
          [0, 40].map((off) => (
            <Ring key={`${h.start}-${off}`} x={h.x} y={h.y} progress={((frame - h.start - off) % 80) / 60} color={PALETA.cian} maxR={150} />
          )),
        )}
      </Plate>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
