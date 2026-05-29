import type { DishId } from "@/i18n/translations";

export type Dietary = "V" | "VV" | "G" | "NF" | "SF";
export type Tag = "SIGNATURE" | "RAW";

export interface DishMeta {
  dietary: Dietary[];
  spice: 0 | 1 | 2 | 3;
  seasonal?: boolean;
  sharedGrill?: boolean;
  rawWarning?: boolean;
  tags?: Tag[];
}

// Per-dish metadata. Keep aligned with translations.ts DishId list.
export const dishMeta: Record<DishId, DishMeta> = {
  K01: { dietary: ["VV", "G", "NF"], spice: 0 },
  K02: { dietary: ["NF", "SF"], spice: 0, tags: ["SIGNATURE"] },
  K03: { dietary: ["G", "NF", "SF"], spice: 0, tags: ["SIGNATURE", "RAW"], rawWarning: true },
  K04: { dietary: ["VV", "G"], spice: 1, sharedGrill: true },
  K05: { dietary: ["VV", "G", "SF"], spice: 0 },
  K06: { dietary: ["NF", "SF"], spice: 1, rawWarning: true },
  K07: { dietary: ["NF", "SF"], spice: 0, tags: ["SIGNATURE"] },
  K08: { dietary: ["VV", "G", "SF"], spice: 0, seasonal: true },
  M01: { dietary: ["G", "NF", "SF"], spice: 2, tags: ["SIGNATURE"] },
  M02: { dietary: ["G"], spice: 0, tags: ["SIGNATURE"] },
  M03: { dietary: ["G", "NF", "SF"], spice: 0 },
  M04: { dietary: ["NF", "SF"], spice: 2, sharedGrill: true },
  M05: { dietary: ["G", "NF"], spice: 1, tags: ["SIGNATURE"] },
  M06: { dietary: ["G", "NF"], spice: 1 },
  M07: { dietary: ["G", "NF", "SF"], spice: 3, tags: ["SIGNATURE"] },
  M08: { dietary: ["G", "NF", "SF"], spice: 0 },
  M09: { dietary: ["NF", "SF"], spice: 0 },
  M10: { dietary: ["G", "NF"], spice: 1, tags: ["SIGNATURE"], seasonal: true },
  L01: { dietary: ["VV", "G", "NF", "SF"], spice: 2, tags: ["SIGNATURE"] },
  L02: { dietary: ["VV", "G", "NF", "SF"], spice: 0, tags: ["SIGNATURE"] },
  L03: { dietary: ["V", "G", "NF", "SF"], spice: 0 },
  L04: { dietary: ["VV", "G", "NF", "SF"], spice: 0 },
  L05: { dietary: ["VV", "G", "NF", "SF"], spice: 0 },
  L06: { dietary: ["VV", "G", "NF", "SF"], spice: 2 },
};