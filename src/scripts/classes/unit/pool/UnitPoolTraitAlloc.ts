import { Constants } from "../../../constants";
import { SEXGENDERS } from "../../../data/sexgenders";
import { TwineClass } from "../../_TwineClass";
import { type SexgenderKey } from "../../Settings";
import { TraitHelper } from "../../trait/Trait";
import type { ChancesWithMinMax } from "./UnitPoolHelper";

export interface TraitAllocEntry {
  chances: { [traitKey in TraitKey]?: number };
  min: number;
  max: number;
}

export interface TraitAlloc {
  [k: string]: TraitAllocEntry;
}
export class UnitPoolTraitAlloc extends TwineClass {
  /** How much does this pool prefers a certain trait. */
  trait_preferences: ChanceObject<TraitKey>;

  /** How much does this pool hates a certain trait. */
  trait_dispreferences: ChanceObject<TraitKey>;

  constructor(
    trait_preferences: { [k in TraitKey]?: number | string },
    trait_dispreferences: {
      [k in TraitKey]?: number | string;
    },
  ) {
    super();

    this.trait_preferences = trait_preferences as ChanceObject<TraitKey>;
    this.trait_dispreferences = trait_dispreferences as ChanceObject<TraitKey>;

    for (let [trait_key, value] of objectEntries(trait_preferences)) {
      if (!(trait_key in setup.trait))
        throw new Error(
          `[UnitPoolTraitAlloc] Unknown trait key in preference unit pool trait alloc: ${trait_key}`,
        );
      if (typeof value === "string") {
        const num = (Constants as any)[value];
        if (typeof num !== "number") {
          throw new Error(`Invalid constant "${value}"`);
        }
        trait_preferences[trait_key] = num;
        value = num;
      }
      if (typeof value !== "number")
        throw new Error(
          `[UnitPoolTraitAlloc] Found invalid value ${value} for trait ${trait_key} in trait alloc!`,
        );
    }

    // Log a warning for missing backgrounds (should be defined with 0)
    for (const trait of Object.values(setup.trait).filter((t) =>
      t.getTags().includes("bg"),
    )) {
      if (!(trait.key in trait_preferences)) {
        console.warn(
          `[UnitPoolTraitAlloc] Missing background trait '${trait.key}' in trait_preferences`,
        );
        //trait_preferences[trait.key] = 0;
      }
    }

    // check all bg traits are there
    //for (const trait of Object.values(setup.trait).filter((t) =>
    //  t.getTags().includes("bg"),
    //)) {
    //  if (!(trait.key in trait_preferences))
    //    throw new Error(
    //      `Missing background trait from unit pool trait alloc: ${trait.key}`,
    //    );
    //}

    for (let [trait_key, value] of objectEntries(trait_dispreferences)) {
      if (!(trait_key in setup.trait))
        throw new Error(
          `Unknown trait key in dispreference unit pool trait alloc: ${trait_key}`,
        );

      if (typeof value === "string") {
        const num = (Constants as any)[value];
        if (typeof num !== "number") {
          throw new Error(`Invalid constant "${value}"`);
        }
        trait_dispreferences[trait_key] = num;
        value = num;
      }
      if (typeof value !== "number")
        throw new Error(
          `Found invalid value ${value} for trait ${trait_key} in triat alloc!`,
        );
    }
  }

  _setupOneObj(
    prefs: Record<string, ChancesWithMinMax>,
    trait_tag: string,
  ): void {
    let found = null;
    for (const trait_key of objectKeys(this.trait_preferences)) {
      const trait = setup.trait[trait_key];
      if (trait.getTags().includes(trait_tag)) {
        if (found) {
          throw new Error(
            `Duplicate ${trait_tag} for unit pool trait alloc!: ${found.key}`,
          );
        }
        found = trait;
      }
    }
    if (!found)
      throw new Error(`Missing ${trait_tag} for unit pool trait alloc!`);
    prefs[trait_tag] = setup.UnitPoolHelper.getOneTraitObj(found);
  }

  _setupTaggedTraits(
    prefs: Record<string, ChancesWithMinMax>,
    tag: string,
    gender: Trait,
    must_be_one?: boolean,
  ): void {
    const trait_map: ChanceObject<TraitKey> = {};
    for (const [trait_key, value] of objectEntries(this.trait_preferences)) {
      const trait = setup.trait[trait_key];
      if (trait.getTags().includes(tag)) {
        if (!trait.isCompatibleWithGender(gender)) continue;
        trait_map[trait.key] = value;
      }
    }

    if (Object.keys(trait_map).length) {
      prefs[tag] = {
        chances: trait_map,
        min: must_be_one ? 1 : 0,
        max: must_be_one ? 1 : Object.keys(trait_map).length,
      };
    }
  }

  _applyModifiers(prefs: Record<string, ChancesWithMinMax>): void {
    // add positive modifiers
    for (const [trait_key, value] of objectEntries(this.trait_preferences)) {
      const trait = setup.trait[trait_key];
      let found = false;
      for (const trait_tag in prefs) {
        if (trait.getTags().includes(trait_tag)) {
          if (found)
            throw new Error(
              `Double positive trait for ${trait_key} in unit pool alloc.`,
            );
          if (!(trait_key in prefs[trait_tag].chances))
            throw new Error(
              `Missing positive trait: ${trait_key} in unit pool alloc for tag ${trait_tag}`,
            );
          prefs[trait_tag].chances[trait_key]! += value;
        }
      }

      // can be not found for skin, race, bg traits
    }

    // add negative modifiers
    for (const [trait_key, value] of objectEntries(this.trait_dispreferences)) {
      const trait = setup.trait[trait_key];
      let found = false;
      for (const trait_tag in prefs) {
        if (trait.getTags().includes(trait_tag)) {
          if (found)
            throw new Error(
              `Double negative trait for ${trait_key} in unit pool alloc.`,
            );
          if (!(trait_key in prefs[trait_tag].chances))
            throw new Error(
              `Missing negative trait: ${trait_key} in unit pool alloc for tag ${trait_tag}`,
            );
          prefs[trait_tag].chances[trait_key]! /= value;
        }
      }

      // can be not found for skin, race, bg traits
    }
  }

  computePreferences(sexgender: SexgenderKey) {
    const gender_trait = setup.trait[SEXGENDERS[sexgender].gender_trait_key];

    const prefs = setup.UnitPoolTraitAlloc.getBaseTraitPreferences(sexgender);

    // apply modifiers
    this._applyModifiers(prefs);

    // setup basic ones
    this._setupOneObj(prefs, "subrace");

    // setup skin traits and bg traits
    this._setupTaggedTraits(prefs, "skin", gender_trait);
    this._setupTaggedTraits(
      prefs,
      "bg",
      gender_trait,
      /* must_be_one = */ true,
    );

    return prefs;
  }

  static getBaseTraitPreferences(sexgender: SexgenderKey): {
    gender: ChancesWithMinMax;
    per: ChancesWithMinMax;
    skill: ChancesWithMinMax;
  } {
    const gender_trait = setup.trait[SEXGENDERS[sexgender].gender_trait_key];

    const prefs: ReturnType<typeof this.getBaseTraitPreferences> = {
      // setup gender
      gender: setup.UnitPoolHelper.getOneTraitObj(gender_trait),

      // setup basic personality traits
      per: setup.UnitPoolHelper.getTraitChanceObj(
        [
          [
            TraitHelper.getAllTraitsOfTags(["per", "common"]),
            setup.UNIT_POOL_PER_TRAITS_AVERAGE_COMMON,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["per", "medium"]),
            setup.UNIT_POOL_PER_TRAITS_AVERAGE_MEDIUM,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["per", "rare"]),
            setup.UNIT_POOL_PER_TRAITS_AVERAGE_RARE,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["per", "unicorn"]),
            setup.UNIT_POOL_PER_TRAITS_AVERAGE_UNICORN,
          ],
        ],
        setup.UNIT_POOL_PER_TRAITS_MIN,
        setup.UNIT_POOL_PER_TRAITS_MAX,
      ),

      // setup skill traits
      skill: setup.UnitPoolHelper.getTraitChanceObj(
        [
          [
            TraitHelper.getAllTraitsOfTags(["skill", "common"]),
            setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_COMMON,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["skill", "medium"]),
            setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_MEDIUM,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["skill", "rare"]),
            setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_RARE,
          ],
          [
            TraitHelper.getAllTraitsOfTags(["skill", "unicorn"]),
            setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_UNICORN,
          ],
        ],
        setup.UNIT_POOL_SKILL_TRAITS_MIN,
        setup.UNIT_POOL_SKILL_TRAITS_MAX,
      ),
    };

    // physical traits
    setup.UnitPoolHelper.physHelperSexgender(prefs, sexgender);

    return prefs;
  }
}
