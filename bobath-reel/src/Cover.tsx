import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Glow, Plate } from "./components/Plate";
import { ANCHO_UTIL, PALETA, ZONA_SEGURA } from "./constants";
import { FUENTE_TEXTO, FUENTE_TITULO, useFontsReady } from "./fonts";

const LINES = ["¿TU CEREBRO", "PUEDE REAPRENDER", "A MOVERSE?"];
const MAX = 110;

/** Portada 1080x1920: cerebro arriba, título en 3 líneas, P1 caminando abajo. */
export const Cover: React.FC = () => {
  const ready = useFontsReady();
  const sizes = LINES.map((l) =>
    ready ? Math.min(MAX, Math.floor(fitText({ text: l, withinWidth: ANCHO_UTIL - 20, fontFamily: FUENTE_TITULO, fontWeight: "800" }).fontSize)) : MAX,
  );
  const brainMask = "radial-gradient(ellipse 520px 430px at 540px 1000px, black 60%, transparent 100%)";
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      {/* cerebro en el tercio superior */}
      <Plate src="e01/e01_composite.png" camera={{ scale: 0.82, y: -470, origin: [540, 1000] }} imgStyle={{ WebkitMaskImage: brainMask, maskImage: brainMask }}>
        <Glow x={540} y={1000} r={520} color={PALETA.cian} opacity={0.25} />
      </Plate>
      {/* P1 caminando, abajo */}
      <Img
        src={staticFile("e10/e10_p1.png")}
        style={{ position: "absolute", left: 540 - 1125 * 0.21 / 2, top: 1262, width: 1125 * 0.21, height: 2000 * 0.21, filter: "drop-shadow(0 0 30px rgba(34,211,238,0.45))" }}
      />
      <div style={{ position: "absolute", top: 770, left: ZONA_SEGURA.lados, width: ANCHO_UTIL, textAlign: "center" }}>
        {LINES.map((l, i) => (
          <div
            key={l}
            style={{
              fontFamily: FUENTE_TITULO,
              fontWeight: 800,
              fontSize: sizes[i],
              lineHeight: 1.06,
              color: PALETA.blanco,
              WebkitTextStroke: `3px ${PALETA.cian}`,
              paintOrder: "stroke fill",
              textShadow: "0 0 34px rgba(34,211,238,0.55), 0 8px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </div>
        ))}
        <div style={{ marginTop: 30, fontFamily: FUENTE_TITULO, fontWeight: 700, fontSize: 48, letterSpacing: "0.32em", color: PALETA.cian, textShadow: "0 0 18px rgba(34,211,238,0.6)" }}>
          EL MÉTODO BOBATH
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: ZONA_SEGURA.abajo + 20,
          width: "100%",
          textAlign: "center",
          fontFamily: FUENTE_TEXTO,
          fontWeight: 600,
          fontSize: 44,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        Reel informativo · 80 s
      </div>
    </AbsoluteFill>
  );
};
