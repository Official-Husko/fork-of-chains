import type { SubraceKey } from "../../classes/trait/Subrace";
import type {
  InlineTraitGroupDefinition,
  TraitOrGroupDefinition,
} from "../../classes/trait/Trait";
import type { TRAIT_GROUP_DEFINITIONS } from "./_traitgroups";
import type { PERK_DEFINTIONS } from "./perks/traits_perk";

import traits_skin_rabbitkin from "./skin/traits_skin_rabbitkin";
import traits_background from "./traits_background";
import traits_blessing from "./traits_blessing";
import traits_computed from "./traits_computed";
import traits_equipment from "./traits_equipment";
import traits_gender from "./traits_gender";
import traits_job from "./traits_job";
import traits_personality from "./traits_personality";
import traits_physical from "./traits_physical";
import traits_race from "./traits_race";
import traits_skill from "./traits_skill";
import traits_skin from "./traits_skin";
import traits_training from "./traits_training";
import traits_trauma from "./traits_trauma";

//
// Note:
//  Adding new traits may also entail editing:
//  default trait chance in unitpool.twee
//

// The order in which they're defined will also be
// the one in they appear in units.

export const TRAIT_DEFINITIONS = {
  ...traits_job,
  ...traits_gender,
  ...traits_race,
  ...traits_background,
  ...traits_physical,
  ...traits_personality,
  ...traits_skill,
  ...traits_training,
  ...traits_skin,
  ...traits_skin_rabbitkin,
  ...traits_equipment,
  ...traits_computed,
  ...traits_blessing,
  ...traits_trauma,
} satisfies Record<string, TraitOrGroupDefinition>;

type aux = typeof TRAIT_DEFINITIONS;

export type _PerkKey = keyof ReturnType<typeof PERK_DEFINTIONS>;

// Keys of top-level traits + traits nested inside trait groups sequences/pools
export type _TraitKey =
  | _PerkKey
  | { [k in SubraceKey]: `subrace_${k}` }[SubraceKey]
  | Exclude<
      {
        [k in keyof aux]: aux[k] extends InlineTraitGroupDefinition<infer G>
          ? G
          : k;
      }[keyof aux],
      "_"
    >;

// Keys of TRAIT_GROUP_DEFINITIONS + keys of groups in TRAIT_DEFINITIONS
export type _TraitGroupKey =
  | keyof typeof TRAIT_GROUP_DEFINITIONS
  | {
      [k in keyof aux]: aux[k] extends InlineTraitGroupDefinition<infer G>
        ? k extends `group:${infer k2}`
          ? k2
          : never
        : never;
    }[keyof aux];
