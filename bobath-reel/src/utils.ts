import { Easing, interpolate } from "remotion";

/** PRNG determinista (mulberry32): mismo resultado en cada frame y en cada render. */
export const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** interpolate con clamp y ease in-out por defecto. */
export const ease = (frame: number, input: [number, number], output: [number, number], easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, input, output, { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
