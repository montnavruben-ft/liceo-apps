import type React from "react";
import type { SceneProps } from "../scenes/types";
import { E01Hook } from "./E01Hook";
import { E02QueEs } from "./E02QueEs";
import { E03Origen } from "./E03Origen";
import { E04Neuroplasticidad } from "./E04Neuroplasticidad";
import { E05Problema } from "./E05Problema";
import { E06Inhibir } from "./E06Inhibir";
import { E07Facilitar } from "./E07Facilitar";
import { E08Ciclo } from "./E08Ciclo";
import { E09ParaQuien } from "./E09ParaQuien";
import { E10Cierre } from "./E10Cierre";

/** Escenas con ilustraciones (public/e01 … e10), por `key` de src/data/script.json. */
export const ESCENAS_IMAGEN: Record<string, React.FC<SceneProps>> = {
  hook: E01Hook,
  "que-es": E02QueEs,
  origen: E03Origen,
  neuroplasticidad: E04Neuroplasticidad,
  problema: E05Problema,
  inhibir: E06Inhibir,
  facilitar: E07Facilitar,
  ciclo: E08Ciclo,
  "para-quien": E09ParaQuien,
  cierre: E10Cierre,
};
