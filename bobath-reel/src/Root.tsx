import React from "react";
import { Composition } from "remotion";
import { BobathReel, BobathReel3D } from "./BobathReel";
import { Cover } from "./Cover";
import { Prueba15s, PRUEBA_FRAMES } from "./Prueba15s";
import { DURACION, FPS, HEIGHT, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Reel vertical 9:16 — 1080x1920, 30 fps, 2400 frames = 80 s */}
    <Composition id="BobathReel" component={BobathReel} durationInFrames={DURACION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Versión anterior en 3D de primitivas, como referencia */}
    <Composition id="BobathReel3D" component={BobathReel3D} durationInFrames={DURACION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Prueba de 15 s con los clips de public/clips — npm run prueba */}
    <Composition id="Prueba15s" component={Prueba15s} durationInFrames={PRUEBA_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Portada (still) — npx remotion still Cover public/cover.png */}
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
