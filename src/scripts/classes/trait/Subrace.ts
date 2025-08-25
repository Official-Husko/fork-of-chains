import type { Constants } from "../../constants";
import type { SUBRACE_DEFINITIONS } from "../../data/subraces/_index";
import { TwineClass } from "../_TwineClass";
import type { CompanyKey } from "../Company";
import type { SkillValuesInit } from "../Skill";
import type { UnitGroupKey } from "../unit/UnitGroup";
import type { TraitGroupKey } from "./TraitGroup";

export interface SubraceDefinition {
  /** @deprecated Unused */
  key?: string;

  name: string;
  noun: string;
  rare?: boolean;
  homeland_region?: string;
  company_key?: CompanyKey;

  /** How much does the trait pool for this race will prefer a certain trait. */
  trait_preferences: {
    [k in TraitKey]?: number | keyof typeof Constants;
  };

  /** How much does the trait pool for this race will hate a certain trait. */
  trait_dispreferences: {
    [k in TraitKey]?: number | keyof typeof Constants;
  };

  description: string;
  slave_value: number;
  skill_bonuses?: SkillValuesInit;
  rarity: string;
  race: string;
  icon?: string;

  lore?: string;
  unitgroups?: ChanceArray<UnitGroupKey>;
}

export type SubraceKey = keyof typeof SUBRACE_DEFINITIONS;

/**
 * Defines a Race/Subrace [static data].
 *
 * Also defines UnitPool / UnitGroup for the subrace.
 * For example if subrace key is "subrace_demon", it will define:
 *  - UnitPool `subrace_demon`
 *  - UnitGroup `subrace_demon`
 *  - UnitGroup `subrace_demon_male`
 *  - UnitGroup `subrace_demon_female`
 *
 */
export class Subrace extends TwineClass {
  key: SubraceKey;
  name: string;
  noun: string;
  homeland_region: string | undefined;
  company_key: CompanyKey | undefined;

  description: string;
  slave_value: number;
  skill_bonuses: SkillValuesInit | undefined;
  rarity: string;
  race: string;
  icon: string | undefined;
  lore: string | undefined;

  unitgroups: ChanceArray<UnitGroupKey> | undefined;

  constructor(key_: string, def: Readonly<SubraceDefinition>) {
    super();

    const key = key_ as SubraceKey;

    this.key = key;
    this.name = def.name;
    this.noun = def.noun;
    this.homeland_region = def.homeland_region;
    this.company_key = def.company_key as CompanyKey;

    this.description = def.description;
    this.slave_value = def.slave_value;
    this.skill_bonuses = def.skill_bonuses;
    this.rarity = def.rarity;
    this.race = def.race;
    this.lore = def.lore;
    this.icon = def.icon;
    this.unitgroups = def.unitgroups;

    if (key in setup.subrace) {
      throw new Error(`Subrace ${this.key} duplicated`);
    }
    setup.subrace[key] = this;

    const prefixed_key = `subrace_${this.key}`;

    //
    // Create the subrace trait
    //

    const subrace_trait = new setup.Trait(prefixed_key, {
      name: this.name.toLowerCase(),
      description: this.description,
      slave_value: this.slave_value,
      skill_bonuses: this.skill_bonuses,
      tags: ["subrace", this.race, this.rarity],
      icon_settings: {
        icon: this.icon,
        colors: true,
      },
    });

    setup.traitgroup["subrace" as TraitGroupKey]._addTrait(subrace_trait);

    //
    // Create Lore
    //
    if (this.lore) {
      const lore = new setup.Lore({
        key: prefixed_key.replace("subrace", "race"),
        name: this.name,
        tags: ["race"],
        text: this.lore,
      });
    }

    //
    // Create UnitPool
    //

    const pool_trait_alloc = new setup.UnitPoolTraitAlloc(
      def.trait_preferences,
      def.trait_dispreferences,
    );

    const unitpool = new setup.UnitPool(
      prefixed_key,
      this.name,
      pool_trait_alloc,
      setup.DEFAULT_INITIAL_SKILLS,
      [],
    );

    //
    // Create UnitGroups (any gender / male / female)
    //

    new setup.UnitGroup(
      `${prefixed_key}`,
      `${this.name}: Any Gender`,
      [[unitpool, 1]],
      0,
      [],
    );

    new setup.UnitGroup(
      `${prefixed_key}_male`,
      `${this.name}: Male`,
      [[unitpool, 1]],
      0,
      [],
      ["gender_male"],
    );

    new setup.UnitGroup(
      `${prefixed_key}_female`,
      `${this.name}: Female`,
      [[unitpool, 1]],
      0,
      [],
      ["gender_female"],
    );

    if (this.unitgroups) {
      for (const [unitgroup_key, value] of this.unitgroups) {
        setup.unitgroup[unitgroup_key]._appendUnitPool(unitpool.key, value);
      }
    }
  }

  static fromTrait(trait_or_key: Trait | TraitKey): Subrace {
    const trait_key = resolveKey(trait_or_key);

    // strip "subrace_" prefix from trait key to get the subrace key
    const subrace_key = trait_key.substring(8) as unknown as SubraceKey;
    return setup.subrace[subrace_key];
  }
}
