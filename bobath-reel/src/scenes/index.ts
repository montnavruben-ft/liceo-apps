import type React from "react";
import { S01Hook } from "./S01Hook";
import { S02QueEs } from "./S02QueEs";
import { S03Origen } from "./S03Origen";
import { S04Neuroplasticidad } from "./S04Neuroplasticidad";
import { S05Problema } from "./S05Problema";
import { S06Inhibir } from "./S06Inhibir";
import { S07Facilitar } from "./S07Facilitar";
import { S08Ciclo } from "./S08Ciclo";
import { S09ParaQuien } from "./S09ParaQuien";
import { S10Cierre } from "./S10Cierre";
import type { SceneProps } from "./types";

/** Componente por `key` de src/data/script.json. */
export const SCENE_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  hook: S01Hook,
  "que-es": S02QueEs,
  origen: S03Origen,
  neuroplasticidad: S04Neuroplasticidad,
  problema: S05Problema,
  inhibir: S06Inhibir,
  facilitar: S07Facilitar,
  ciclo: S08Ciclo,
  "para-quien": S09ParaQuien,
  cierre: S10Cierre,
};
