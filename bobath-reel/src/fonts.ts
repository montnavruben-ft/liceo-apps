import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

// Fuentes locales (public/fonts, licencia SIL OFL 1.1): el render no depende de internet.
// Archivos variables (subconjunto latino: incluye á é í ó ú ñ ¿ ¡ ·).
export const FUENTE_TITULO = "Montserrat"; // se usa con peso 800 (ExtraBold)
export const FUENTE_TEXTO = "Inter"; // 400 (Regular) para subtítulos, 600 para apoyos

const fontsReady = Promise.all([
  loadFont({ family: FUENTE_TITULO, url: staticFile("fonts/Montserrat-latin.woff2"), weight: "100 900", format: "woff2" }),
  loadFont({ family: FUENTE_TEXTO, url: staticFile("fonts/Inter-latin.woff2"), weight: "100 900", format: "woff2" }),
]);

/** Devuelve true cuando las fuentes ya cargaron; retiene el render hasta entonces. */
export const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(false);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Cargando Montserrat + Inter"));
  useEffect(() => {
    let alive = true;
    fontsReady.then(() => {
      if (alive) setReady(true);
      continueRender(handle);
    });
    return () => {
      alive = false;
    };
  }, [continueRender, handle]);
  return ready;
};
