import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar3D, walkPose } from "./components/Avatar3D";
import { Brain3D } from "./components/Brain3D";
import { Particles } from "./components/Primitives3D";
import { SceneBackground } from "./components/Scene";
import { CameraRig, Stage } from "./components/Stage";
import { ANCHO_UTIL, PALETA, ZONA_SEGURA } from "./constants";
import { FUENTE_TEXTO, FUENTE_TITULO, useFontsReady } from "./fonts";

const LINES = ["¿TU CEREBRO", "PUEDE REAPRENDER", "A MOVERSE?"];
const MAX = 110;

/** Portada 1080x1920: cerebro 3D arriba, título en 3 líneas, avatar caminando abajo. */
export const Cover: React.FC = () => {
  const ready = useFontsReady();
  const sizes = LINES.map((l) =>
    ready ? Math.min(MAX, Math.floor(fitText({ text: l, withinWidth: ANCHO_UTIL - 20, fontFamily: FUENTE_TITULO, fontWeight: "800" }).fontSize)) : MAX,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <SceneBackground glow="#173057" />
      <Stage fov={40}>
        <CameraRig position={[0, 0, 10]} target={[0, 0, 0]} />
        <Particles count={260} opacity={0.6} />
        <Brain3D position={[0, 1.95, 0]} rotationY={-0.5} scale={1.2} activation={1} />
        <Avatar3D pose={walkPose(0.9)} position={[0, -2.55, 0]} rotationY={0.5} nerves={1} scale={0.7} />
        <mesh position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 48]} />
          <meshBasicMaterial color={PALETA.cian} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </Stage>
      <div style={{ position: "absolute", top: 800, left: ZONA_SEGURA.lados, width: ANCHO_UTIL, textAlign: "center" }}>
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
        <div
          style={{
            marginTop: 34,
            fontFamily: FUENTE_TITULO,
            fontWeight: 700,
            fontSize: 48,
            letterSpacing: "0.32em",
            color: PALETA.cian,
            textShadow: "0 0 18px rgba(34,211,238,0.6)",
          }}
        >
          EL MÉTODO BOBATH
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: ZONA_SEGURA.abajo + 40,
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
