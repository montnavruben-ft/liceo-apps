// Exporta subtitles.srt desde src/data/subtitles.json (misma fuente que <Subtitles />).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { fps, cues } = JSON.parse(readFileSync(join(root, "src/data/subtitles.json"), "utf8"));

const ts = (frame) => {
  const ms = Math.round((frame / fps) * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const r = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s},${r}`;
};

const srt = cues
  .map((c, i) => `${i + 1}\n${ts(c.startFrame)} --> ${ts(c.endFrame)}\n${c.text}\n`)
  .join("\n");
writeFileSync(join(root, "subtitles.srt"), srt);
console.log(`subtitles.srt: ${cues.length} bloques`);
