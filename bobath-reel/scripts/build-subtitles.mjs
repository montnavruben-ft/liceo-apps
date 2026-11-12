// Genera src/data/subtitles.json a partir de src/data/narration.json.
// Cada escena reparte su ventana [startFrame, endFrame - 15] entre sus bloques
// (subtitleChunks) en proporción al número de caracteres. La última escena termina en endFrame.
// Si ya tienes la narración real y quieres afinar, edita subtitles.json a mano
// y ejecuta `npm run srt` para regenerar subtitles.srt.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const narration = JSON.parse(readFileSync(join(root, "src/data/narration.json"), "utf8"));
const GAP = 15; // 0,5 s de respiro entre escenas, igual que el SRT del guion
const last = narration.scenes[narration.scenes.length - 1].sceneId;

const cues = [];
for (const s of narration.scenes) {
  const winStart = s.startFrame;
  const winEnd = s.sceneId === last ? s.endFrame : s.endFrame - GAP;
  const total = s.subtitleChunks.reduce((a, c) => a + c.length, 0);
  let cursor = winStart;
  s.subtitleChunks.forEach((text, i) => {
    const isLast = i === s.subtitleChunks.length - 1;
    const len = Math.round(((winEnd - winStart) * text.length) / total);
    const end = isLast ? winEnd : cursor + len;
    cues.push({ id: cues.length + 1, sceneId: s.sceneId, startFrame: cursor, endFrame: end, text });
    cursor = end;
  });
}

writeFileSync(join(root, "src/data/subtitles.json"), JSON.stringify({ fps: 30, cues }, null, 2) + "\n");
console.log(`subtitles.json: ${cues.length} bloques`);
