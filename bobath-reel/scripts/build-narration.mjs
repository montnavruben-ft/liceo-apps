// Monta src/audio/narration-es-lat.mp3 (80 s) a partir de 10 clips TTS, uno por escena:
//   src/audio/narracion/escena-01.mp3 ... escena-10.mp3
// Cada clip se coloca exactamente en el startFrame de su escena (narration.json), se avisa si
// un clip es más largo que su ventana y el resultado se normaliza a -16 LUFS.
// Requiere ffmpeg/ffprobe en el PATH (o usa los de Remotion: npx remotion ffmpeg / ffprobe).
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const narration = JSON.parse(readFileSync(join(root, "src/data/narration.json"), "utf8"));
const FPS = 30;
const TOTAL = 80;

const clips = narration.scenes.map((s) => ({
  ...s,
  file: join(root, `src/audio/narracion/escena-${String(s.sceneId).padStart(2, "0")}.mp3`),
}));

const missing = clips.filter((c) => !existsSync(c.file));
if (missing.length) {
  console.error("Faltan clips de narración:\n" + missing.map((c) => "  " + c.file).join("\n"));
  process.exit(1);
}

for (const c of clips) {
  const dur = parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", c.file]).toString(),
  );
  const window = (c.endFrame - c.startFrame) / FPS - 0.5;
  const flag = dur > window ? "  <-- MÁS LARGO que la ventana, acelera el TTS o recorta silencios" : "";
  console.log(`Escena ${c.sceneId}: ${dur.toFixed(2)} s (ventana ${window.toFixed(2)} s)${flag}`);
}

const inputs = clips.flatMap((c) => ["-i", c.file]);
const delays = clips
  .map((c, i) => {
    const ms = Math.round((c.startFrame / FPS) * 1000);
    return `[${i}:a]aformat=sample_rates=44100:channel_layouts=mono,adelay=${ms}|${ms}[a${i}]`;
  })
  .join(";");
const mix = clips.map((_, i) => `[a${i}]`).join("") +
  `amix=inputs=${clips.length}:normalize=0,apad=whole_dur=${TOTAL},atrim=0:${TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;

execFileSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${delays};${mix}`, "-map", "[out]",
    "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "192k", join(root, "src/audio/narration-es-lat.mp3")],
  { stdio: "inherit" },
);
console.log("OK -> src/audio/narration-es-lat.mp3 (-16 LUFS, 80 s)");
