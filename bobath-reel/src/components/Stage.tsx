import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React from "react";
import { useVideoConfig } from "remotion";
import { PALETA } from "../constants";

type Vec3 = [number, number, number];

/**
 * Coloca la cámara en cada frame. Se ejecuta durante el render de React,
 * antes de que @remotion/three llame a advance(): no hay estado ni tiempo real.
 */
export const CameraRig: React.FC<{ position: Vec3; target: Vec3; fov?: number }> = ({ position, target, fov }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...position);
  camera.lookAt(...target);
  if (fov !== undefined && "fov" in camera && camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

/** Iluminación común: ambiente + luz principal + contraluz cian. */
export const Lights: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <>
    <ambientLight intensity={0.55 * intensity} />
    <hemisphereLight args={["#9ecbff", PALETA.fondo, 0.6 * intensity]} />
    <directionalLight position={[3, 5, 6]} intensity={2.2 * intensity} />
    <directionalLight position={[-3, 3, -5]} intensity={1.6 * intensity} color={PALETA.cian} />
  </>
);

/** Lienzo 3D a pantalla completa (o del tamaño indicado), fondo transparente. */
export const Stage: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  fov?: number;
  lights?: boolean;
  lightIntensity?: number;
}> = ({ children, width, height, fov = 40, lights = true, lightIntensity = 1 }) => {
  const config = useVideoConfig();
  const w = width ?? config.width;
  const h = height ?? config.height;
  return (
    <ThreeCanvas
      width={w}
      height={h}
      style={{ position: "absolute", left: 0, top: 0 }}
      camera={{ fov, position: [0, 0, 10], near: 0.05, far: 200 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      dpr={1}
    >
      {lights ? <Lights intensity={lightIntensity} /> : null}
      {children}
    </ThreeCanvas>
  );
};
