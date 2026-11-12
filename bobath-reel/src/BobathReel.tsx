import React from "react";
import { AbsoluteFill, Audio, interpolate, useVideoConfig } from "remotion";
import music from "./audio/music-bed.mp3";
import narration from "./audio/narration-es-lat.mp3";
import { ProgressBar } from "./components/ProgressBar";
import { Scene } from "./components/Scene";
import { Subtitles } from "./components/Subtitles";
import { ESCENAS, PALETA } from "./constants";
import { useFontsReady } from "./fonts";
import { SCENE_COMPONENTS } from "./scenes";

/**
 * Reel completo: 10 escenas con startFrame/endFrame exactos (src/data/script.json),
 * subtítulos sincronizados, barra de progreso, narración y música.
 *
 * Audio: los archivos se entregan ya normalizados (voz -16 LUFS, música -24 LUFS),
 * por eso ambos van a volumen 1; la música solo hace fade-in/out.
 */
export const BobathReel: React.FC = () => {
  useFontsReady();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      {ESCENAS.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.key];
        return (
          <Scene key={s.id} name={`${s.id}. ${s.name}`} startFrame={s.startFrame} endFrame={s.endFrame} isFirst={i === 0} isLast={i === ESCENAS.length - 1}>
            <Comp scene={s} duration={s.endFrame - s.startFrame} />
          </Scene>
        );
      })}
      <Subtitles />
      <ProgressBar />
      <Audio src={narration} volume={1} />
      <Audio
        src={music}
        volume={(f) => interpolate(f, [0, 30, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
