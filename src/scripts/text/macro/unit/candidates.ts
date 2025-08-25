/**
 * Candidate definitions and alias mappings for unit macros.
 *
 * `CANDIDATES` lists the shorthand identifiers used by the core unit macros
 * (for example `utorso`, `uhead`, `uwarrior`, etc.). These correspond to
 * functions provided under `Text.Unit.Trait` (or other Text.* helpers) and are
 * used to generate descriptive phrases about a unit's body parts, equipment,
 * or other characteristics.
 *
 * `ALIASES` provides backwards-compatible macro name mappings.
 */

export const CANDIDATES: readonly string[] = [
  "torso",
  "back",
  "head",
  "face",
  "mouth",
  "eyes",
  "ears",
  "cbreast",
  "breast",
  "neck",
  "wings",
  "arms",
  "hand",
  "hands",
  "legs",
  "cfeet",
  "clegs",
  "ctorso",
  "carms",
  "cneck",
  "ceyes",
  "cnipple",
  "ctail",
  "cmouth",
  "feet",
  "foot",
  "tail",
  "dick",
  "balls",
  "vagina",
  "anus",
  "genital",
  "cgenital",
  "ass",
  "nipple",
  "nipples",
  "hole",
  "tongue",
  "skin",
  "scent",
  "horns",
  "teeth",
  "belly",
  "waist",
  "dickorstrap",
  "cum",
  "cleavage",

  /* Furnitures / room props */
  "slaverbed",
  "slavebed",
  "foodtray",
  "drinktray",
  "punishment",
  "lighting",
  "tile",
  "object",
  "wall",
] as const;

/** Macros that are pure aliases of other macros (keeps compatibility) */
export const ALIASES: Record<string, string> = {
  ubody: "utorso",
  ubodyall: "utorsoall",
  ubreasts: "ubreast",
  ubreastsall: "ubreastall",
  ucbreasts: "ucbreast",
  ucbreastsall: "ucbreastall",
  ucdick: "ucgenital",
  ucnipples: "ucnipple",
};
