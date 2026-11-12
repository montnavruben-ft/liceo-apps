import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { GlowOrb, Particles } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import { ease } from "../utils";
import type { SceneProps } from "./types";

const STEP = 55;
const FIRST = 18;
const RING = 1.25;
const WORDS = ["OBSERVAR", "ANALIZAR", "TRATAR", "REEVALUAR"];

const NodeShape: React.FC<{ i: number }> = ({ i }) => {
  switch (i) {
    case 0:
      return <icosahedronGeometry args={[0.3, 1]} />;
    case 1:
      return <octahedronGeometry args={[0.34, 0]} />;
    case 2:
      return <dodecahedronGeometry args={[0.31, 0]} />;
    default:
      return <torusGeometry args={[0.22, 0.09, 10, 24]} />;
  }
};

// Escena 8 — El ciclo Bobath: rueda de 4 nodos que gira 90° por nodo; cada nodo hace pop al encenderse.
export const S08Ciclo: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // activaciones: 0,1,2,3 y vuelve a 0 (loop)
  const activations = [0, 1, 2, 3, 4].map((k) => FIRST + k * STEP);
  const steps = activations.map((a) => spring({ frame: frame - a, fps, config: { damping: 15, stiffness: 90 } }));
  const rotation = steps.slice(1).reduce((acc, s) => acc + s, 0) * (Math.PI / 2); // 90° por nodo
  const current = activations.filter((a) => frame >= a).length - 1;
  const active = current < 0 ? -1 : current % 4;

  const camZ = ease(frame, [0, duration], [7.4, 8.6]);

  return (
    <AbsoluteFill>
      <SceneBackground />
      <Stage>
        <CameraRig position={[0, -0.25, camZ]} target={[0, -0.05, 0]} />
        <Particles count={140} size={0.05} opacity={0.35} center={[0, 0, -4]} />
        <group position={[0, -0.55, 0]} rotation={[0.18, 0, rotation]}>
          <mesh>
            <torusGeometry args={[RING, 0.025, 8, 120]} />
            <meshBasicMaterial color={PALETA.cian} transparent opacity={0.45} toneMapped={false} />
          </mesh>
          {/* flechas en loop infinito, sentido horario */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = Math.PI / 2 - (i / 12) * Math.PI * 2 - frame * 0.025;
            const glow = 0.5 + 0.5 * Math.sin(frame * 0.2 - i);
            return (
              <mesh key={i} position={[Math.cos(a) * RING, Math.sin(a) * RING, 0]} rotation={[0, 0, a + Math.PI]}>
                <coneGeometry args={[0.06, 0.16, 12]} />
                <meshBasicMaterial color={PALETA.cian} transparent opacity={0.35 + 0.6 * glow} toneMapped={false} />
              </mesh>
            );
          })}
          {WORDS.map((w, i) => {
            const a = Math.PI / 2 - i * (Math.PI / 2); // arriba, derecha, abajo, izquierda
            const pops = activations.filter((_, k) => k % 4 === i).map((f) => spring({ frame: frame - f, fps, config: { damping: 7, stiffness: 180 } }));
            const pop = pops.reduce((m, p, k) => (frame >= activations[i + k * 4] ? p : m), 0);
            const on = active === i;
            const scale = 1 + (on ? 0.35 * Math.sin(Math.min(1, pop) * Math.PI) + 0.12 : 0);
            return (
              <group key={w} position={[Math.cos(a) * RING, Math.sin(a) * RING, 0]} scale={scale}>
                <mesh rotation={[frame / 50, frame / 40, 0]}>
                  <NodeShape i={i} />
                  <meshStandardMaterial
                    color={on ? PALETA.cian : "#1F3A63"}
                    emissive={on ? PALETA.cian : "#0B2545"}
                    emissiveIntensity={on ? 0.9 : 0.4}
                    flatShading
                  />
                </mesh>
                <GlowOrb radius={0.28} color={PALETA.cian} intensity={on ? 0.6 : 0} halo={1.8} />
              </group>
            );
          })}
        </group>
      </Stage>
      {/* palabra activa en el centro de la rueda */}
      {active >= 0 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 60 }}>
          <div
            style={{
              fontFamily: FUENTE_TITULO,
              fontWeight: 800,
              fontSize: 66,
              color: PALETA.cian,
              textShadow: "0 0 24px rgba(34,211,238,0.6)",
              transform: `scale(${0.7 + 0.3 * spring({ frame: frame - activations[current], fps, config: { damping: 12 } })})`,
            }}
          >
            {WORDS[active]}
          </div>
        </AbsoluteFill>
      ) : null}
      <TopShade />
      <OverlayText
        title={scene.onScreen.title}
        subtitle={scene.onScreen.subtitle}
        durationInFrames={duration}
        maxSize={64}
        activeSegment={active >= 0 ? active : undefined}
      />
    </AbsoluteFill>
  );
};
