import type { UnitPoolKey } from "../../classes/unit/pool/UnitPool";
import type { UnitGroupDefinition } from "../../classes/unit/UnitGroup";

export const GLOBAL_UNITPOOL_CHANCES: Readonly<ChanceArray<UnitPoolKey>> = [
  ["subrace_humankingdom", 1],
  ["subrace_humanvale", 0.4],
  ["subrace_humandesert", 0.2],
  ["subrace_humansea", 0.05],
  ["subrace_neko", 0.4],
  ["subrace_werewolf", 0.1],
  ["subrace_foxkin", 0.05],
  ["subrace_elf", 0.4],
  ["subrace_drow", 0.05],
  ["subrace_orc", 0.15],
  ["subrace_kobold", 0.2],
  ["subrace_lizardkin", 0.04],
  ["subrace_dragonkin", 0.0015],
  ["subrace_demonkin", 0.03],
  ["subrace_demon", 0.0015],
  ["subrace_fairy", 0.0015],
];

export default definitions<UnitGroupDefinition>()({
  all: {
    name: "People from around the world",
    chances: [...GLOBAL_UNITPOOL_CHANCES],
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  city_all: {
    name: "Residents of the City of Lucgate",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([["subrace_humankingdom", 30]]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  forest_all: {
    name: "Residents of the Western Forests",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([
      ["subrace_neko", 15],
      ["subrace_elf", 15],
      ["subrace_fairy", 0.1],
    ]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  vale_all: {
    name: "Residents of the Northern Vale",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([
      ["subrace_humanvale", 24],
      ["subrace_werewolf", 6],
      ["subrace_foxkin", 6],
    ]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  desert_all: {
    name: "Residents of the Eastern Deserts",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([
      ["subrace_orc", 15],
      ["subrace_humandesert", 15],
      ["subrace_demonkin", 1],
    ]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  sea_all: {
    name: "Residents of the Southern Seas",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([
      ["subrace_humansea", 5],
      ["subrace_lizardkin", 3.5],
      ["subrace_dragonkin", 0.1],
    ]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },

  deep_all: {
    name: "Residents of the Deeprealm",
    chances: GLOBAL_UNITPOOL_CHANCES.concat([
      ["subrace_kobold", 22],
      ["subrace_drow", 7],
      ["subrace_demonkin", 1],
      ["subrace_demon", 0.1],
    ]),
    reuse_chance: 0,
    unit_post_process: [],
    make_gender_variants: true,
  },
});
