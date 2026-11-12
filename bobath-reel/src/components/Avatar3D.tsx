import React from "react";
import * as THREE from "three";
import { PALETA } from "../constants";
import { GlowOrb } from "./Primitives3D";

type Vec3 = [number, number, number];

// Proporciones del maniquí (unidades ≈ metros). Sin rostro: la cabeza es una esfera lisa.
export const BODY = {
  thigh: 0.44,
  shin: 0.44,
  foot: 0.06,
  hipY: 0.95,
  hipX: 0.1,
  shoulderY: 0.56,
  shoulderX: 0.22,
  upperArm: 0.28,
  foreArm: 0.26,
  headY: 0.8,
  seatHipY: 0.52,
};

/** Ángulos en radianes. Flexión positiva = hacia adelante (hombro/cadera) o doblar (codo/rodilla). */
export type Pose = {
  hipL: number;
  hipR: number;
  kneeL: number;
  kneeR: number;
  hipAbdL: number;
  hipAbdR: number;
  shoulderL: number;
  shoulderR: number;
  abdL: number;
  abdR: number;
  elbowL: number;
  elbowR: number;
  trunkLean: number; // adelante +
  trunkSide: number; // inclinación lateral
  bob: number; // desplazamiento vertical de pelvis
};

export const NEUTRAL: Pose = {
  hipL: 0,
  hipR: 0,
  kneeL: 0.04,
  kneeR: 0.04,
  hipAbdL: 0.02,
  hipAbdR: 0.02,
  shoulderL: 0.05,
  shoulderR: 0.05,
  abdL: 0.12,
  abdR: 0.12,
  elbowL: 0.2,
  elbowR: 0.2,
  trunkLean: 0,
  trunkSide: 0,
  bob: 0,
};

/** Ciclo de marcha fluida. phase en radianes (2π = un ciclo = 2 pasos). */
export const walkPose = (phase: number, amount = 1): Pose => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  return {
    ...NEUTRAL,
    hipL: 0.42 * s * amount,
    hipR: -0.42 * s * amount,
    kneeL: 0.08 + 0.65 * Math.max(0, c) * amount,
    kneeR: 0.08 + 0.65 * Math.max(0, -c) * amount,
    shoulderL: -0.32 * s * amount + 0.05,
    shoulderR: 0.32 * s * amount + 0.05,
    elbowL: 0.3 + 0.15 * Math.max(0, -s) * amount,
    elbowR: 0.3 + 0.15 * Math.max(0, s) * amount,
    bob: 0.025 * Math.abs(c) * amount,
    trunkLean: 0.04 * amount,
  };
};

/**
 * Patrón de marcha con tono alterado (hemiparesia ilustrativa): brazo afectado en flexión,
 * pierna rígida con circunducción y tronco inclinado. Solo con fines divulgativos.
 */
export const hemiPose = (phase: number, side: "L" | "R", tone = 1): Pose => {
  const base = walkPose(phase, 0.75);
  const s = Math.sin(phase);
  const swing = side === "L" ? s : -s;
  const affected: Partial<Pose> =
    side === "L"
      ? {
          shoulderL: 0.35 * tone + 0.05 * (1 - tone),
          abdL: 0.05,
          elbowL: 1.75 * tone + 0.25 * (1 - tone),
          kneeL: 0.04 + 0.08 * (1 - tone),
          hipL: 0.24 * s,
          hipAbdL: 0.02 + 0.28 * Math.max(0, swing) * tone,
        }
      : {
          shoulderR: 0.35 * tone + 0.05 * (1 - tone),
          abdR: 0.05,
          elbowR: 1.75 * tone + 0.25 * (1 - tone),
          kneeR: 0.04 + 0.08 * (1 - tone),
          hipR: -0.24 * s,
          hipAbdR: 0.02 + 0.28 * Math.max(0, swing) * tone,
        };
  return { ...base, ...affected, trunkSide: (side === "L" ? 0.1 : -0.1) * tone + 0.04 * Math.sin(phase * 2) * tone };
};

/** Posición de codo y mano (espacio local del avatar) para un brazo sin abducción. */
export const armFK = (side: "L" | "R", shoulderFlex: number, elbowFlex: number, hipY = BODY.hipY) => {
  const sx = (side === "L" ? 1 : -1) * BODY.shoulderX;
  const shoulder = new THREE.Vector3(sx, hipY + BODY.shoulderY, 0);
  const elbow = shoulder.clone().add(new THREE.Vector3(0, -Math.cos(shoulderFlex), Math.sin(shoulderFlex)).multiplyScalar(BODY.upperArm));
  const a = shoulderFlex + elbowFlex;
  const hand = elbow.clone().add(new THREE.Vector3(0, -Math.cos(a), Math.sin(a)).multiplyScalar(BODY.foreArm + 0.045));
  return { shoulder, elbow, hand };
};

export type SpringConfig = { side: "L" | "R"; color: string; tension: number; jitter: number };
export type OrbsConfig = { pelvis?: number; trunk?: number; shoulder?: number; hand?: number; side?: "L" | "R" };

export type Avatar3DProps = {
  pose?: Pose;
  position?: Vec3;
  rotationY?: number;
  scale?: number;
  color?: string;
  /** 0..1: el sistema nervioso se ilumina de arriba (cerebro) a abajo (pies). null = oculto */
  nerves?: number | null;
  nerveColor?: string;
  spring?: SpringConfig;
  orbs?: OrbsConfig;
  seated?: boolean;
  cane?: boolean;
  opacity?: number;
  emissive?: number;
};

const Limb: React.FC<{ length: number; radius: number; mat: React.ReactNode; nerve?: number | null; nerveColor: string }> = ({
  length,
  radius,
  mat,
  nerve,
  nerveColor,
}) => (
  <>
    <mesh position={[0, -length / 2, 0]}>
      <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 6, 12]} />
      {mat}
    </mesh>
    {nerve !== null && nerve !== undefined ? (
      <mesh position={[0, -length / 2, radius * 0.92]}>
        <capsuleGeometry args={[0.011, length * 0.82, 2, 6]} />
        <meshBasicMaterial color={nerveColor} transparent opacity={0.12 + 0.88 * nerve} toneMapped={false} />
      </mesh>
    ) : null}
  </>
);

// Nivel (0 = cerebro, 1 = pies) en que se enciende cada segmento.
const LEVEL = { head: 0, spine: 0.12, upperArm: 0.3, foreArm: 0.45, thigh: 0.5, shin: 0.72, foot: 0.9 };

export const Avatar3D: React.FC<Avatar3DProps> = ({
  pose = NEUTRAL,
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  color = PALETA.cuerpo,
  nerves = null,
  nerveColor = PALETA.cian,
  spring,
  orbs,
  seated = false,
  cane = false,
  opacity = 1,
  emissive = 0.25,
}) => {
  const lit = (level: number) => (nerves === null ? null : Math.max(0, Math.min(1, (nerves - level) / 0.14)));
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emissive}
      roughness={0.45}
      metalness={0.1}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
  const headGlow = nerves === null ? 0 : lit(LEVEL.head)!;
  const hipY = seated ? BODY.seatHipY : BODY.hipY;
  const p = seated
    ? { ...pose, hipL: Math.PI / 2, hipR: Math.PI / 2, kneeL: Math.PI / 2, kneeR: Math.PI / 2, bob: 0 }
    : pose;

  const leg = (side: "L" | "R") => {
    const sgn = side === "L" ? 1 : -1;
    const hip = side === "L" ? p.hipL : p.hipR;
    const knee = side === "L" ? p.kneeL : p.kneeR;
    const abd = side === "L" ? p.hipAbdL : p.hipAbdR;
    return (
      <group key={side} position={[sgn * BODY.hipX, -0.03, 0]} rotation={[-hip, 0, sgn * abd]}>
        <Limb length={BODY.thigh} radius={0.075} mat={mat} nerve={lit(LEVEL.thigh)} nerveColor={nerveColor} />
        <group position={[0, -BODY.thigh, 0]} rotation={[knee, 0, 0]}>
          <Limb length={BODY.shin} radius={0.06} mat={mat} nerve={lit(LEVEL.shin)} nerveColor={nerveColor} />
          <mesh position={[0, -BODY.shin - 0.01, 0.06]}>
            <boxGeometry args={[0.1, BODY.foot, 0.24]} />
            {mat}
          </mesh>
        </group>
      </group>
    );
  };

  const arm = (side: "L" | "R") => {
    const sgn = side === "L" ? 1 : -1;
    const sh = side === "L" ? p.shoulderL : p.shoulderR;
    const el = side === "L" ? p.elbowL : p.elbowR;
    const abd = side === "L" ? p.abdL : p.abdR;
    const hasSpring = spring && spring.side === side;
    const orbHere = orbs && (orbs.side ?? "L") === side;
    return (
      <group key={side} position={[sgn * BODY.shoulderX, BODY.shoulderY, 0]} rotation={[-sh, 0, sgn * abd]}>
        <mesh>
          <sphereGeometry args={[0.07, 12, 10]} />
          {mat}
        </mesh>
        <Limb length={BODY.upperArm} radius={0.055} mat={mat} nerve={lit(LEVEL.upperArm)} nerveColor={nerveColor} />
        {hasSpring ? <Spring3D {...spring} length={BODY.upperArm} offsetX={sgn * 0.1} /> : null}
        {orbHere && orbs.shoulder !== undefined ? <GlowOrb position={[0, 0, 0.09]} radius={0.045} color={PALETA.oro} intensity={orbs.shoulder} /> : null}
        <group position={[0, -BODY.upperArm, 0]} rotation={[-el, 0, 0]}>
          <Limb length={BODY.foreArm} radius={0.045} mat={mat} nerve={lit(LEVEL.foreArm)} nerveColor={nerveColor} />
          <mesh position={[0, -BODY.foreArm - 0.03, 0]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            {mat}
          </mesh>
          {orbHere && orbs.hand !== undefined ? (
            <GlowOrb position={[0, -BODY.foreArm - 0.03, 0.05]} radius={0.04} color={PALETA.oro} intensity={orbs.hand} />
          ) : null}
          {cane && side === "R" ? (
            <mesh position={[0, -BODY.foreArm - 0.45, 0.02]}>
              <cylinderGeometry args={[0.014, 0.014, 0.85, 8]} />
              <meshStandardMaterial color={PALETA.coral} emissive={PALETA.coral} emissiveIntensity={0.3} />
            </mesh>
          ) : null}
        </group>
      </group>
    );
  };

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <group position={[0, hipY + p.bob, 0]}>
        {/* pelvis */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.12, 0.16, 6, 12]} />
          {mat}
        </mesh>
        {orbs?.pelvis !== undefined ? <GlowOrb position={[0, 0, 0.15]} radius={0.05} color={PALETA.oro} intensity={orbs.pelvis} /> : null}
        {leg("L")}
        {leg("R")}
        {/* tronco */}
        <group rotation={[p.trunkLean, 0, p.trunkSide]}>
          <mesh position={[0, 0.3, 0]} scale={[1.3, 1, 0.8]}>
            <capsuleGeometry args={[0.15, 0.3, 6, 14]} />
            {mat}
          </mesh>
          {/* médula espinal */}
          {nerves !== null ? (
            <mesh position={[0, 0.36, 0.125]}>
              <capsuleGeometry args={[0.014, 0.62, 2, 6]} />
              <meshBasicMaterial color={nerveColor} transparent opacity={0.15 + 0.85 * lit(LEVEL.spine)!} toneMapped={false} />
            </mesh>
          ) : null}
          {orbs?.trunk !== undefined ? <GlowOrb position={[0, 0.32, 0.14]} radius={0.05} color={PALETA.oro} intensity={orbs.trunk} /> : null}
          {/* cuello y cabeza (sin rostro) */}
          <mesh position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.045, 0.055, 0.12, 10]} />
            {mat}
          </mesh>
          <mesh position={[0, BODY.headY, 0]} scale={[0.92, 1.06, 1]}>
            <sphereGeometry args={[0.12, 20, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={nerves === null ? color : nerveColor}
              emissiveIntensity={nerves === null ? emissive : emissive + 0.9 * headGlow}
              roughness={0.4}
              transparent={opacity < 1}
              opacity={opacity}
            />
          </mesh>
          {arm("L")}
          {arm("R")}
        </group>
      </group>
    </group>
  );
};

/** Resorte (helicoide): visualiza la tensión muscular. tension 1 = comprimido y vibrando. */
export const Spring3D: React.FC<SpringConfig & { length: number; offsetX?: number; frameJitter?: number }> = ({
  color,
  tension,
  jitter,
  length,
  offsetX = 0.1,
}) => {
  const geometry = React.useMemo(() => {
    const turns = 9;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.045, -t, Math.sin(a) * 0.045));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.008, 6, false);
  }, []);
  const sy = length * (1 - 0.32 * tension);
  const r = 1 + 0.35 * tension;
  return (
    <mesh geometry={geometry} position={[offsetX + jitter, -length * 0.08, 0]} scale={[r, sy, r]}>
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

/** Silla de ruedas estilizada para la tarjeta "lesión medular". */
export const Wheelchair: React.FC<{ position?: Vec3; rotationY?: number; scale?: number; spin?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  spin = 0,
}) => {
  const metal = <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />;
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.3, 0.32, -0.05]} rotation={[spin, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.022, 8, 32]} />
            <meshStandardMaterial color={PALETA.cian} emissive={PALETA.cian} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[s * 0.22, 0.06, 0.32]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.06, 0.015, 6, 16]} />
            {metal}
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.45, 0.02]}>
        <boxGeometry args={[0.46, 0.04, 0.42]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.72, -0.2]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.46, 0.5, 0.03]} />
        {metal}
      </mesh>
    </group>
  );
};
