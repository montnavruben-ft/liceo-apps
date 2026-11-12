import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar3D, NEUTRAL } from "../components/Avatar3D";
import { OverlayText } from "../components/OverlayText";
import { Particles, Text3D } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { ease, seeded } from "../utils";
import type { SceneProps } from "./types";

// Río estilizado que cruza la ciudad en S (inspirado en el Támesis).
const RIVER: [number, number, number][] = [
  [-3.2, 0.02, 0.9],
  [-1.8, 0.02, 0.2],
  [-0.6, 0.02, 0.9],
  [0.6, 0.02, 0.4],
  [1.6, 0.02, -0.6],
  [3.2, 0.02, -0.2],
];

const City: React.FC<{ grow: number }> = ({ grow }) => {
  const { mesh, items } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(RIVER.map((p) => new THREE.Vector3(...p)));
    const samples = curve.getPoints(80);
    const rnd = seeded(1940);
    const list: { x: number; z: number; h: number; w: number; d: number; delay: number }[] = [];
    for (let x = -2.8; x <= 2.8; x += 0.32) {
      for (let z = -2.8; z <= 2.8; z += 0.32) {
        const jx = x + (rnd() - 0.5) * 0.08;
        const jz = z + (rnd() - 0.5) * 0.08;
        const dist = Math.min(...samples.map((s) => Math.hypot(s.x - jx, s.z - jz)));
        if (dist < 0.42 || Math.hypot(jx, jz) > 3.1 || rnd() < 0.12) continue;
        // hueco central para las siluetas
        if (Math.hypot(jx - 0, jz - 1.6) < 0.7) continue;
        list.push({ x: jx, z: jz, h: 0.1 + Math.pow(rnd(), 2) * 0.55, w: 0.18 + rnd() * 0.08, d: 0.18 + rnd() * 0.08, delay: rnd() });
      }
    }
    const m = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: "#1E3354", emissive: "#0B2545", emissiveIntensity: 0.6, roughness: 0.6, flatShading: true }),
      list.length,
    );
    return { mesh: m, items: list };
  }, []);

  const mtx = new THREE.Matrix4();
  items.forEach((b, i) => {
    const g = Math.max(0.001, Math.min(1, grow * 1.6 - b.delay * 0.6));
    const h = b.h * g;
    mtx.compose(new THREE.Vector3(b.x, 0.05 + h / 2, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, h, b.d));
    mesh.setMatrixAt(i, mtx);
  });
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

export const S03Origen: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const az = ease(frame, [0, duration], [-15, 15]) * (Math.PI / 180);
  const el = Math.PI / 4;
  const R = 11;
  const target: [number, number, number] = [0, 1.05, 0.4];
  const cam: [number, number, number] = [target[0] + R * Math.cos(el) * Math.sin(az), target[1] + R * Math.sin(el), target[2] + R * Math.cos(el) * Math.cos(az)];
  const grow = ease(frame, [0, 60], [0, 1]);
  const riseA = spring({ frame: frame - 45, fps, config: { damping: 200 }, durationInFrames: 50 });
  const riseB = spring({ frame: frame - 60, fps, config: { damping: 200 }, durationInFrames: 50 });
  const yearIn = spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 110 } });
  const river = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(RIVER.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 120, 0.22, 8, false);
  }, []);

  return (
    <AbsoluteFill>
      <SceneBackground />
      <Stage fov={38}>
        <CameraRig position={cam} target={target} />
        <Particles count={120} size={0.05} opacity={0.4} center={[0, 3, -3]} />
        {/* base del mapa: el agujero central lo tapa el propio suelo, las siluetas emergen desde abajo */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[3.3, 3.4, 0.2, 64]} />
          <meshStandardMaterial color="#0F1B33" emissive="#0B1A33" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.22, 3.3, 96]} />
          <meshBasicMaterial color={PALETA.cian} toneMapped={false} />
        </mesh>
        <mesh geometry={river} scale={[1, 0.12, 1]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#1D4ED8" emissive={PALETA.cian} emissiveIntensity={0.45} />
        </mesh>
        <City grow={grow} />
        {/* torre del reloj genérica */}
        <group position={[-1.2, 0.05, -0.55]} scale={[1, ease(frame, [10, 60], [0.01, 1]), 1]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.2, 1.2, 0.2]} />
            <meshStandardMaterial color="#27406A" emissive="#0B2545" emissiveIntensity={0.6} flatShading />
          </mesh>
          <mesh position={[0, 1.33, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.17, 0.3, 4]} />
            <meshStandardMaterial color={PALETA.cian} emissive={PALETA.cian} emissiveIntensity={0.4} flatShading />
          </mesh>
          <mesh position={[0, 1.0, 0.105]}>
            <circleGeometry args={[0.07, 24]} />
            <meshBasicMaterial color={PALETA.oro} toneMapped={false} />
          </mesh>
        </group>
        {/* siluetas: fisioterapeuta (coral) y médico (cian), sin rostro */}
        <group position={[0, 0.05, 1.6]}>
          <Avatar3D pose={{ ...NEUTRAL, abdL: 0.15, abdR: 0.15 }} position={[-0.32, (riseA - 1) * 2.2, 0]} rotationY={0.25} color={PALETA.coral} emissive={0.35} scale={0.78} />
          <Avatar3D pose={NEUTRAL} position={[0.32, (riseB - 1) * 2.2, 0]} rotationY={-0.25} color={PALETA.cian} emissive={0.3} scale={0.84} />
        </group>
        {/* año flotante */}
        <group
          position={[0, 1.75 + Math.sin(frame / 20) * 0.08, 0.5]}
          rotation={[-0.35, az, 0]}
          scale={Math.max(0.001, yearIn)}
        >
          <Text3D text="1940s" height={1.0} color={PALETA.blanco} sideColor="#0E7490" />
        </group>
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
