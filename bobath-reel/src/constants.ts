import script from "./data/script.json";

// ---- Formato (vertical 9:16) -------------------------------------------------
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURACION = 2400; // frames = 80 s
export const TRANSICION = 12; // frames de crossfade entre escenas

// ---- Paleta -------------------------------------------------------------------
export const PALETA = {
  fondo: "#0B1220",
  fondoClaro: "#13213D",
  cian: "#22D3EE",
  coral: "#FF6B5E",
  blanco: "#FFFFFF",
  subtituloFondo: "rgba(0, 0, 0, 0.7)",
  // Acentos de apoyo pedidos por el guion visual (orbes dorados, trayectoria verde, calma azul)
  oro: "#FBBF24",
  verde: "#34D399",
  azulCalma: "#3B82F6",
  cuerpo: "#1F3A63",
  cuerpoOscuro: "#16294A",
  manos: "#DCE6F2",
} as const;

// ---- Tipografía y zona segura --------------------------------------------------
export const TEXTO_MIN_PX = 64;
export const ZONA_SEGURA = { arriba: 120, abajo: 120, lados: 80 } as const;
export const ANCHO_UTIL = WIDTH - ZONA_SEGURA.lados * 2; // 920 px

// Nombre del canal para el cierre (escena 10). Déjalo en null para no mostrar nada.
// Ejemplo: export const CANAL: string | null = "@tu_canal";
export const CANAL: string | null = null;

// ---- Escenas (fuente única: src/data/script.json) ------------------------------
export type SceneData = (typeof script.scenes)[number];
export const ESCENAS: SceneData[] = script.scenes;

// Validación temprana: si alguien edita script.json y rompe la continuidad, falla el bundle.
ESCENAS.forEach((s, i) => {
  const prevEnd = i === 0 ? 0 : ESCENAS[i - 1].endFrame;
  if (s.startFrame !== prevEnd) {
    throw new Error(`Escena ${s.id}: startFrame ${s.startFrame} debería ser ${prevEnd}`);
  }
});
if (ESCENAS[ESCENAS.length - 1].endFrame !== DURACION) {
  throw new Error(`La última escena debe terminar en el frame ${DURACION}`);
}
