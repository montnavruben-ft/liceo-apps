import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import pulse from "../audio/sfx-pulse.mp3";
import { OverlayText } from "../components/OverlayText";
import { Edge, GlowOrb, Particles, TrailTube } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { clamp, ease, lerp, seeded } from "../utils";
import type { SceneProps } from "./types";

type V = [number, number, number];

const buildNetwork = () => {
  const rnd = seeded(42);
  const nodes: V[] = [];
  while (nodes.length < 38) {
    const p: V = [(rnd() - 0.5) * 4.4, (rnd() - 0.5) * 6.2, (rnd() - 0.5) * 2];
    if (nodes.every((n) => Math.hypot(n[0] - p[0], n[1] - p[1], n[2] - p[2]) > 0.75)) nodes.push(p);
  }
  // nodo dañado: el más cercano al centro
  const dist = (a: V, b: V) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const broken = nodes.reduce((best, n, i) => (dist(n, [0, 0, 0]) < dist(nodes[best], [0, 0, 0]) ? i : best), 0);
  const edges: [number, number][] = [];
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: dist(n, m) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    near.forEach(({ j }) => {
      if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) edges.push([i, j]);
    });
  });
  const neighbors = edges.filter(([a, b]) => a === broken || b === broken).map(([a, b]) => (a === broken ? b : a));
  // nodo reconectado: ligeramente desplazado del dañado
  const b = nodes[broken];
  const fresh: V = [b[0] + 0.45, b[1] + 0.3, b[2] + 0.35];
  // rutas nuevas: de cada vecino al nodo nuevo, con una curva que esquiva la lesión
  const routes = neighbors.map((ni, k) => {
    const n = nodes[ni];
    const mid: V = [lerp(n[0], fresh[0], 0.5) + 0.35 * Math.cos(k * 2.1), lerp(n[1], fresh[1], 0.5) + 0.35 * Math.sin(k * 2.1), lerp(n[2], fresh[2], 0.5) + 0.3];
    return [n, mid, fresh] as V[];
  });
  return { nodes, edges, broken, fresh, routes };
};

// Escena 4 — Neuroplasticidad: la red se rompe en un punto (línea roja tenue) y se reconecta con rutas cian nuevas.
export const S04Neuroplasticidad: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const net = useMemo(buildNetwork, []);

  // cámara: zoom-out lento (0-100) y luego push-in al nodo reconectado (110-230)
  const out = ease(frame, [0, 100], [8, 10]);
  const push = ease(frame, [110, duration - 10], [0, 1]);
  const camZ = lerp(out, net.fresh[2] + 3.4, push);
  const camX = lerp(0, net.fresh[0] * 0.9, push);
  const camY = lerp(-0.4, net.fresh[1] - 0.25, push);
  const target: [number, number, number] = [lerp(0, net.fresh[0], push), lerp(-0.4, net.fresh[1] - 0.15, push), lerp(0, net.fresh[2], push)];

  const breakT = interpolate(frame, [35, 75], [0, 1], clamp);
  const t = frame / 30;

  return (
    <AbsoluteFill>
      <SceneBackground glow="#101F3D" />
      <Stage>
        <CameraRig position={[camX, camY, camZ]} target={target} />
        <Particles count={160} size={0.05} opacity={0.35} center={[0, 0, -4]} />
        {net.edges.map(([a, b], i) => {
          const isBroken = a === net.broken || b === net.broken;
          if (!isBroken) return <Edge key={i} a={net.nodes[a]} b={net.nodes[b]} color={PALETA.cian} opacity={0.32} />;
          // arista dañada: se vuelve coral tenue y se abre un hueco cerca del nodo dañado
          const fromBroken = a === net.broken;
          const gap = 0.45 * breakT;
          return (
            <Edge
              key={i}
              a={net.nodes[a]}
              b={net.nodes[b]}
              color={breakT > 0.05 ? PALETA.coral : PALETA.cian}
              opacity={lerp(0.32, 0.28, breakT)}
              trimStart={fromBroken ? gap : 0}
              trimEnd={fromBroken ? 1 : 1 - gap}
            />
          );
        })}
        {net.nodes.map((n, i) => {
          if (i === net.broken) {
            return <GlowOrb key={i} position={n} radius={0.09} color={PALETA.coral} intensity={breakT * (0.4 + 0.3 * Math.sin(t * 6))} />;
          }
          const pulseK = Math.pow(0.5 + 0.5 * Math.sin(t * 3 - n[1] * 1.2 - n[0]), 6);
          return <GlowOrb key={i} position={n} radius={0.07} color={PALETA.cian} intensity={0.25 + 0.6 * pulseK} />;
        })}
        {net.routes.map((pts, k) => (
          <TrailTube key={k} points={pts} progress={ease(frame, [90 + k * 14, 160 + k * 14], [0, 1])} color={PALETA.cian} radius={0.028} />
        ))}
        <GlowOrb
          position={net.fresh}
          radius={0.12}
          color={PALETA.cian}
          intensity={interpolate(frame, [150, 175], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(t * 8))}
          halo={3}
        />
      </Stage>
      <Sequence from={160} durationInFrames={20}>
        <Audio src={pulse} volume={0.7} />
      </Sequence>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
