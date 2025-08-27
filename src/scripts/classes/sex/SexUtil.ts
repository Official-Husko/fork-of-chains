import type { TraitKey } from "../trait/Trait";
import type { SexInstance } from "./engine/SexInstance";

import text from "./action/text";
import text_resist from "./action/text_resist";
import util from "./action/util";

namespace SexUtil_ {
  /**
   * @param sex Optional, to replace some extra commands
   */
  export function convert(
    options: string | string[],
    unit_map: ActorUnitMap,
    sex: SexInstance,
  ): string {
    let chosen;
    if (Array.isArray(options)) {
      chosen = setup.rng.choice(options);
    } else {
      chosen = options;
    }

    // replace sex macros
    if (sex) {
      const macro_map: Record<string, (unit: Unit) => string> = {
        a_moan: (unit) => {
          return setup.Article(setup.SexText.moan(unit, sex));
        },
        A_moan: (unit) => {
          return setup.Article(setup.SexText.moan(unit, sex), true);
        },
        moans: (unit) => {
          return `${setup.SexText.moan(unit, sex)}s`;
        },
        // moan: (unit) => {},
        // moaning: (unit) => {},
        // Moaning: (unit) => {},

        a_sob: (unit) => {
          return setup.Article(setup.SexText.sob(unit, sex));
        },
        A_sob: (unit) => {
          return setup.Article(setup.SexText.sob(unit, sex), true);
        },
        sobs: (unit) => {
          return `${setup.SexText.sob(unit, sex)}s`;
        },
        // sob: (unit) => {}
        // sobbing: (unit) => {},
        // Sobbing: (unit) => {},

        eagerly: (unit) => {
          return sex.getPace(unit).repAdverb(unit, sex);
        },
        Eagerly: (unit) => {
          return setup.capitalize(sex.getPace(unit).repAdverb(unit, sex));
        },
      };

      chosen = chosen.replace(
        /(\w+)\|([\w_]+)/g,
        (match, unitname, unitverb) => {
          if (unitverb in macro_map) {
            const unit = unit_map[unitname];
            if (unit) {
              return macro_map[unitverb](unit);
            }
          }
          return `${unitname}|${unitverb}`;
        },
      );
    }

    return setup.Text.replaceUnitMacros(chosen, unit_map);
  }

  export function sumTraitMultipliers(
    unit: Unit,
    trait_effects: { [k in TraitKey]?: number } & {
      default?: number;
    },
  ): number {
    // sanity check
    for (const trait_key in trait_effects) {
      if (trait_key != "default" && !(trait_key in setup.trait)) {
        throw new Error(
          `Unknown trait in calculateTraitMultiplier: ${trait_key}`,
        );
      }
    }

    let found = false;
    let multiplier = 0;
    for (const [trait_key, value] of objectEntries(trait_effects)) {
      if (trait_key == "default") continue;
      if (!(trait_key in setup.trait))
        throw new Error(`unknown trait: ${trait_key}`);
      if (unit.isHasTraitExact(trait_key)) {
        found = true;
        multiplier += value;
      }
    }

    if (!found && "default" in trait_effects)
      multiplier += trait_effects.default!;

    return multiplier;
  }

  export function calculateTraitMultiplier(
    unit: Unit,
    trait_effects: { [k in TraitKey]?: number },
  ): number {
    const multiplier = SexUtil.sumTraitMultipliers(unit, trait_effects) + 1.0;
    return Math.max(multiplier, 0);
  }

  /**
   * Gets a trait-based option from the list.
   * @param trait_choices (e.g., {tough_nimble: ['run', 'dash', ], tough_tough: ['walk', 'trudge'], default: ['a']})
   */
  export function traitSelect<T>(
    unit: Unit,
    trait_choices: { [k in TraitKey]?: T } & {
      default?: T;
    },
  ): T {
    let chosen = trait_choices.default;

    for (const [trait_key, value] of objectEntries(trait_choices)) {
      if (trait_key !== "default" && unit.isHasTraitExact(trait_key)) {
        return value;
      }
    }

    if (!chosen) throw new Error(`Missing "default" in trait_choices!`);
    return chosen;
  }

  /**
   * TraitSelect but returns a random element out of the options.
   * @param trait_choices (e.g., {tough_nimble: ['run', 'dash', ], tough_tough: ['walk', 'trudge'], default: ['a']})
   */
  export function traitSelectArray<T>(
    unit: Unit,
    trait_choices: {
      [k in TraitKey]?: T[];
    } & { default?: T[] },
  ): T {
    const chosen = SexUtil.traitSelect(unit, trait_choices);
    if (!chosen.length)
      throw new Error(`No selection for traitselectarray for unit ${unit.key}`);
    return setup.rng.choice(chosen);
  }
}

export const SexUtil = {
  ...SexUtil_,
  ...util,
  ...text,
  ...text_resist,
};
