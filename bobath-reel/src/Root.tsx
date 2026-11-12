import React from "react";
import { Composition } from "remotion";
import { BobathReel } from "./BobathReel";
import { Cover } from "./Cover";
import { DURACION, FPS, HEIGHT, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Reel vertical 9:16 — 1080x1920, 30 fps, 2400 frames = 80 s */}
    <Composition id="BobathReel" component={BobathReel} durationInFrames={DURACION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Portada (still) — npx remotion still Cover public/cover.png */}
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
