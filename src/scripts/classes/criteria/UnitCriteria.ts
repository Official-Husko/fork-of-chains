import type { CRITERIA_DEFINITIONS } from "../../data/criteria/_index";
import { isDefinitionArgs } from "../../util/TypeUtil";
import { TwineClass } from "../_TwineClass";
import type { Job } from "../job/Job";
import type { QuestDifficulty } from "../quest/QuestDifficulty";
import type { QuestInstance } from "../quest/QuestInstance";
import type { QuestOutcome } from "../quest/QuestTemplate";
import Job_ from "../restriction/unit/Job";
import You from "../restriction/unit/You";
import { Skill, type SkillValuesArray, type SkillValuesInit } from "../Skill";
import { Trait, TraitKey } from "../trait/Trait";
import type { Unit } from "../unit/Unit";

export interface UnitCriteriaDefinition {
  name: string;
  crit_traits: (Trait | TraitKey)[];
  disaster_traits: (Trait | TraitKey)[];
  restrictions: Restriction[];
  skill_multis: SkillValuesInit;
}

export type UnitCriteriaKey = keyof typeof CRITERIA_DEFINITIONS;

/**
 * This class instances exists in two forms:
 *  - Predefined instances with a non-null key, which reside at `setup.qu`
 *  - Transient instances with a null key (e.g. used in the SlaveOrderFlex cost)
 */
export class UnitCriteria extends TwineClass {
  readonly key: UnitCriteriaKey | null;
  readonly name: string;

  readonly crit_trait_map: { [traitKey in TraitKey]?: boolean };
  readonly disaster_trait_map: { [traitKey in TraitKey]?: boolean };
  readonly restrictions: Restriction[];
  readonly skill_multis: SkillValuesInit;

  constructor(
    key: string | null,
    ...args:
      | [
          name: string,
          crit_traits: UnitCriteriaDefinition["crit_traits"],
          disaster_traits: UnitCriteriaDefinition["disaster_traits"],
          restrictions: UnitCriteriaDefinition["restrictions"],
          skill_multis: UnitCriteriaDefinition["skill_multis"],
        ]
      | [Readonly<UnitCriteriaDefinition>]
  ) {
    super();

    let def: Readonly<UnitCriteriaDefinition>;
    if (isDefinitionArgs(args)) {
      def = args[0];
    } else {
      // prettier-ignore
      const [ name, crit_traits, disaster_traits, restrictions, skill_multis ] = args;
      // prettier-ignore
      def = { name, crit_traits, disaster_traits, restrictions, skill_multis };
    }

    // skill_multis: a skill where each skill is associated a multiplier, indicating
    // how important it is for this quest.

    // criteria can be keyless, i.e., for the dynamically generated ones.
    // e.g., one time use criterias or the ones used to generate slave order.
    this.key = key as UnitCriteriaKey;
    this.name = def.name;

    // translate trait effects to keys
    // crit_traits and disaster_traits are arrays (which may contain duplicates)
    // indicating the traits that are crit or disaster for this.
    const crit_traits = def.crit_traits.map((it) =>
      resolveObject(it, setup.trait),
    );
    crit_traits.sort(Trait.cmp);
    this.crit_trait_map = {};
    for (let i = 0; i < crit_traits.length; ++i) {
      if (!crit_traits[i])
        throw new Error(`Missing a crit trait for ${key} criteria`);
      if (!crit_traits[i].key)
        throw new Error(
          `No key in ${crit_traits[i]} in unit criteria for ${key}`,
        );
      this.crit_trait_map[crit_traits[i].key] = true;
    }

    const disaster_traits = def.disaster_traits.map((it) =>
      resolveObject(it, setup.trait),
    );
    disaster_traits.sort(Trait.cmp);
    this.disaster_trait_map = {};
    for (let i = 0; i < disaster_traits.length; ++i) {
      if (!disaster_traits[i])
        throw new Error(`Missing a disaster trait for ${key} criteria`);
      if (!disaster_traits[i].key)
        throw new Error(
          `No key in ${disaster_traits[i]} in unit disastereria for ${key}`,
        );
      this.disaster_trait_map[disaster_traits[i].key] = true;
    }

    this.restrictions = def.restrictions;

    this.skill_multis = def.skill_multis;
    Object.defineProperty(this, "skill_multis", { value: def.skill_multis });
    if (Array.isArray(def.skill_multis) && !def.skill_multis.length) {
      throw new Error(
        `Skill multis cannot be an empty array (you can use an empty object instead)`,
      );
    }

    if (key) {
      if (key in setup.qu)
        throw new Error(`Quest Criteria ${key} already exists`);
      setup.qu[key as UnitCriteriaKey] = this;
    }
  }

  validate(): string | null {
    const skills = this.getSkillMultis().reduce((a, b) => a + b, 0);
    if (this.getJob() != setup.job.slaver) {
      if (skills) {
        return "Non-slaver criteria cannot have any skill! Please add a slaver restriction to this role.";
      }
    }
    if (skills && Math.abs(skills - 3.0) > 0.00001) {
      return `Sum of skills must be exactly 3.0, but found ${skills} instead!`;
    }
    return null;
  }

  getName(): string {
    return this.name;
  }

  getRestrictions(): readonly Restriction[] {
    return this.restrictions;
  }

  isCanAssign(unit: Unit): boolean {
    // checks if unit does not violate any requirement
    let restrictions = this.getRestrictions();
    if (!setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, restrictions))
      return false;
    return true;
  }

  getSkillMultis(): SkillValuesArray {
    return Skill.translate(this.skill_multis);
  }

  getCritTraits(): Trait[] {
    return objectKeys(this.crit_trait_map).map((key) => setup.trait[key]);
  }

  getDisasterTraits(): Trait[] {
    return objectKeys(this.disaster_trait_map).map((key) => setup.trait[key]);
  }

  getMatchingTraits(
    unit: Unit,
    ignore_extra_traits?: boolean,
  ): { crit: Trait[]; disaster: Trait[] } {
    // return number of crit / disaster traits that matches.
    let unit_traits;
    if (ignore_extra_traits) {
      unit_traits = unit.getTraits();
    } else {
      unit_traits = unit.getAllTraits();
    }

    // remove disaster traits if unit has any relevant perks
    const perks = unit.getAllTraitsWithTag("perk");
    const disabled: Trait[] = [];
    for (const perk of perks) {
      disabled.push(...perk.getPerkNullTraits());
    }

    const unit_traits_for_disaster = unit_traits.filter(
      (trait) => !disabled.includes(trait),
    );

    const crits = [];
    for (const trait of unit_traits) {
      if (trait.key in this.crit_trait_map) {
        crits.push(trait);
      }
    }

    const disasters = [];
    for (const trait of unit_traits_for_disaster) {
      if (trait.key in this.disaster_trait_map) {
        disasters.push(trait);
      }
    }

    return {
      crit: crits,
      disaster: disasters,
    };
  }

  computeSuccessModifiers(
    unit: Unit,
    ignore_extra_traits?: boolean,
  ): {
    crit: number;
    success: number;
    failure: number;
    disaster: number;
  } {
    // compute success modifiers if this unit fills in this criteria.
    // returns {'crit': x, 'success': y, 'failure': z, 'disaster': xyz}

    // idea: correct skill give success. Crit trait give crit, disaster trait give disaster.

    const matches = this.getMatchingTraits(unit, ignore_extra_traits);
    const crits = matches.crit.length;
    const disasters = matches.disaster.length;

    let stat_mod_plus = 0;
    let stat_mod_neg = 0;
    let unit_skills = unit.getSkills();
    const skill_multis = this.getSkillMultis();
    for (let i = 0; i < skill_multis.length; ++i) {
      if (skill_multis[i] > 0) {
        stat_mod_plus += skill_multis[i] * unit_skills[i];
      }
      if (skill_multis[i] < 0) {
        stat_mod_neg -= skill_multis[i] * unit_skills[i];
      }
    }

    return {
      crit: crits,
      success: stat_mod_plus,
      failure: stat_mod_neg,
      disaster: disasters,
    };
  }

  _computeScore(
    unit: Unit,
    difficulty: QuestDifficulty,
    multipliers: { [k in QuestOutcome]?: number },
  ) {
    const obj = this.computeSuccessModifiers(unit);
    const multis = setup.QuestDifficulty.convertSuccessModifierToChances(
      obj,
      difficulty,
    );
    let score = 0;
    for (const [key, value] of objectEntries(multipliers)) {
      score += multis[key] * value;
    }
    return score;
  }

  /**
   * Compute a rough score of having this unit in this role
   * The score is roughly proportionate to the amount of reward
   */
  computeScore(unit: Unit, difficulty: QuestDifficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 2,
      success: 1,
      disaster: -2,
    });
  }

  /**
   * Computes score based on crit chance only, ignoring all else
   */
  computeScoreCrit(unit: Unit, difficulty: QuestDifficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 10000,
      success: 0.0001,
      disaster: -1,
    });
  }

  /**
   * Computes score based on success+crit chance only, ignoring all else
   */
  computeScoreSuccess(unit: Unit, difficulty: QuestDifficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 1,
      success: 1,
      disaster: -0.0001,
    });
  }

  /**
   * Computes score based on success+crit+failure chance only, ignoring all else
   */
  computeScoreFailure(unit: Unit, difficulty: QuestDifficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 1,
      success: 1,
      disaster: -10000,
    });
  }

  getEligibleUnits(quest?: QuestInstance): Unit[] {
    return State.variables.company.player
      .getUnits({})
      .filter((unit) => unit.isAvailable() && this.isCanAssign(unit));
  }

  getEligibleUnitsSorted(difficulty: QuestDifficulty) {
    const can = this.getEligibleUnits();
    can.sort(
      (a, b) =>
        this.computeScore(b, difficulty) - this.computeScore(a, difficulty),
    );
    return can;
  }

  /**
   * Get job restriction, if any
   */
  getJob(): Job | null {
    const restrictions = this.getRestrictions();
    for (const restriction of restrictions) {
      if (restriction instanceof Job_) {
        return setup.job[restriction.job_key];
      }
      if (restriction instanceof You) {
        return setup.job.slaver;
      }
    }
    return null;
  }

  /**
   * Gives a representation of this actor, together with which matching traits/skills it have.
   */
  repActor(unit: Unit, difficulty: QuestDifficulty): string {
    const skills = unit.getSkills();

    let text = "";

    const skillmultis = this.getSkillMultis();
    const skilltexts = [];
    for (const skill of setup.skill) {
      let skillval = skillmultis[skill.key];
      if (skillval) {
        if (skillval != 1) {
          let skilltext = skillval.toFixed(0);
          if (skillval % 1) skilltext = skillval.toFixed(1);
          skilltexts.push(`${skilltext} x ${skills[skill.key]} ${skill.rep()}`);
        } else {
          skilltexts.push(`${skills[skill.key]} ${skill.rep()}`);
        }
      }
    }
    if (skilltexts.length) {
      text += `[${skilltexts.join(" + ")}]`;
    }

    const matches = this.getMatchingTraits(unit);

    for (const crit_trait of this.getCritTraits()) {
      if (matches.crit.includes(crit_trait)) {
        text += crit_trait.rep();
      }
    }

    for (const disaster_trait of this.getDisasterTraits()) {
      if (matches.disaster.includes(disaster_trait)) {
        text += disaster_trait.repNegative();
      }
    }

    if (difficulty) {
      const score = 100 * this.computeScore(unit, difficulty);
      text += ` (Score: ${score.toFixed(1)})`;
    }

    return text;
  }
}
