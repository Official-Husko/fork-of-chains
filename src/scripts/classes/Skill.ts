import { Constants, type NumericConstant } from "../constants";
import type { SKILL_DEFINITIONS } from "../data/skills";
import { TwineClass } from "./_TwineClass";
import { Unit } from "./unit/Unit";

export interface SkillDefinition {
  name: string;
  description: string;
}

export type SkillKeyword = keyof typeof SKILL_DEFINITIONS;

export type SkillKey = BrandedType<number, "SkillKey">;

export type SkillValuesArray<T = number> = T[];

export type SkillValuesInit<T = number> =
  | readonly T[]
  | Readonly<{ [k in SkillKey | SkillKeyword]?: T }>;

export class Skill extends TwineClass {
  /** Skill numeric key (its index) */
  key: SkillKey;
  /** Skill string key */
  keyword: SkillKeyword;

  name: string;
  description: string;

  constructor(keyword: string, def: Readonly<SkillDefinition>) {
    super();

    this.key = setup.skill.length as SkillKey;
    this.keyword = keyword as SkillKeyword;
    this.name = def.name;
    this.description = def.description;

    if (keyword in setup.skill) throw new Error(`Duplicate role ${keyword}`);
    (setup.skill as any)[keyword] = this;
    setup.skill.push(this);
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getImage() {
    // Apparently ad-block does not like social.png, so this had to be renamed.
    if (this.keyword == "social") {
      return `img/role/sc.svg`;
    } else {
      return `img/role/${this.keyword}.svg`;
    }
  }

  getImageRep() {
    return setup.repImgIcon(this.getImage());
  }

  rep() {
    return setup.repImgIcon(this.getImage(), `<<tooltipskill '${this.key}'>>`);
  }

  repPositive() {
    return `<span class='skillcardglow'>${this.rep()}</span>`;
  }

  static translate<T>(
    array_or_obj: Readonly<SkillValuesInit<T>>,
  ): SkillValuesArray<T> {
    // translates array or object skill into array
    // e.g., [1, 2, 3, 4, 5, ...] or {'brawn': 1}
    if (Array.isArray(array_or_obj)) {
      if (array_or_obj.length != setup.skill.length)
        throw new Error(
          `Skill values array length not correct: ${array_or_obj}`,
        );
      return array_or_obj;
    }
    let result = Array(setup.skill.length).fill(0);
    for (const [key, value] of Object.entries(array_or_obj)) {
      if (!(key in setup.skill)) throw new Error(`Unrecognized skill: ${key}`);
      let skill = setup.skill[key as unknown as number];
      result[skill.key] = value;
    }
    return result;
  }

  static translateAndResolveConstants<T>(
    array_or_obj: Readonly<SkillValuesInit<number | NumericConstant>>,
  ): SkillValuesArray<number> {
    const values = this.translate(array_or_obj);
    return values.map((x) => (typeof x === "string" ? Constants[x] : x));
  }

  static makeEmptySkills(): SkillValuesArray {
    return Array(setup.skill.length).fill(0);
  }

  static cmp(skill1: Skill, skill2: Skill): number {
    if (skill1.key < skill2.key) return -1;
    if (skill1.key > skill2.key) return 1;
    return 0;
  }

  // gives a score check between unit a and unit b in skill c.
  // return 2 for crit win for a, 1 for win for a, -1, for lose for a, -2 for crit lose for a
  // cannot draw
  static skillCheckCompare(unit1: Unit, unit2: Unit, skill: Skill) {
    let skill1 = unit1.getSkill(skill);
    let skill2 = unit2.getSkill(skill);
    let rolls = 3;
    let wins = 0;
    for (let i = 0; i < rolls; ++i) {
      let score1 = skill1 / 2 + Math.random() * (skill1 / 2);
      let score2 = skill2 / 2 + Math.random() * (skill2 / 2);
      if (score1 > score2) wins += 1;
    }
    if (wins == 3) return 2;
    if (wins == 2) return 1;
    if (wins == 1) return -1;
    return -2;
  }
}

export namespace SkillHelper {
  /**
   * Given [0, 1, 2, 4, ...] explain it.
   */
  export function explainSkillMods(
    skill_mod_array_raw: number[],
    is_hide_skills?: boolean,
    is_no_mult?: boolean,
  ) {
    let skill_array = setup.Skill.translate(skill_mod_array_raw);
    let texts = [];
    let mid = " × ";
    if (is_no_mult) mid = " ";
    for (let i = 0; i < skill_array.length; ++i) {
      if (skill_array[i]) {
        let image_rep = setup.skill[i].rep();
        if (is_hide_skills) {
          image_rep = setup.skill[i].getName();
        }
        let sign = "";
        if (skill_array[i] > 0) sign = "+";
        let percent = Math.round(skill_array[i] * 100);
        let fixed = 1;
        if (percent % 10) fixed = 2;
        let vtext = `${sign}${(percent / 100).toFixed(fixed)}`;
        if (!is_hide_skills) {
          if (sign == "+") {
            vtext = setup.DOM.toString(setup.DOM.Text.successlite(vtext));
          } else if (vtext.startsWith("-")) {
            vtext = setup.DOM.toString(setup.DOM.Text.dangerlite(vtext));
          }
        }
        texts.push(`${vtext}${mid}${image_rep}`);
      }
    }
    return texts.join("║");
  }

  /**
   * Given [0, 1, 2, 4, ...] explain it.
   */
  export function explainSkillModsShort(
    skill_mod_array_raw: number[],
    is_hide_skills?: boolean,
    unit?: Unit,
  ): string {
    let skill_array = setup.Skill.translate(skill_mod_array_raw);
    let texts = [];
    for (let i = 0; i < skill_array.length; ++i) {
      if (skill_array[i]) {
        let image_rep = setup.skill[i].rep();
        if (is_hide_skills) {
          image_rep = setup.skill[i].getName();
        }
        if (unit && unit.getSkillFocuses().includes(setup.skill[i])) {
          image_rep = `${setup.skill[i].repPositive()}`;
        }
        texts.push(`${image_rep}`);
        for (let j = 2; j <= skill_array[i] + 0.0000001; ++j) {
          texts.push(`${image_rep}`);
        }
      }
    }
    return texts.join("");
  }

  export function explainSkillWithAdditive(unit: Unit, skill: Skill): string {
    const image_rep = skill.rep();
    const innate_add = State.variables.skillboost.getBoosts(unit)[skill.key];
    const val = unit.getSkillsBase()[skill.key];
    const add = unit.getSkillsAdd()[skill.key];

    let val_text;
    if (innate_add) {
      val_text = setup.DOM.toString(setup.DOM.Text.infolite(`${val}`));
    } else {
      val_text = `${val}`;
    }

    let add_text = "";
    if (add > 0) {
      add_text += setup.DOM.toString(setup.DOM.Text.successlite(`+${add}`));
    } else if (add < 0) {
      add_text += setup.DOM.toString(setup.DOM.Text.dangerlite(`-${-add}`));
    }

    const tooltip = `<<unitskillcard "${unit.key}" ${skill.key}>>`;
    let text = "";
    if (!State.variables.settings.summarizeunitskills) {
      text = `${val_text}${add_text}`;
    } else {
      text = `${unit.getSkill(skill)}`;
      if (innate_add > 0 && add >= 0) {
        text = setup.DOM.toString(setup.DOM.Text.infolite(text));
      } else if (add > 0) {
        text = setup.DOM.toString(setup.DOM.Text.successlite(text));
      } else if (add < 0) {
        text = setup.DOM.toString(setup.DOM.Text.dangerlite(text));
      }
    }
    return `<span class="unit-skill">${image_rep} <span data-tooltip='${tooltip}'>${text}</span></span>`;
  }

  export function explainSkillsWithAdditives(unit: Unit): string {
    const skill_array = unit.getSkillsBase(/* ignore skill boosts = */ true);
    let texts = [];
    for (let i = 0; i < skill_array.length; ++i) {
      if (skill_array[i]) {
        texts.push(
          setup.SkillHelper.explainSkillWithAdditive(unit, setup.skill[i]),
        );
      }
    }
    return `<div class="unit-skills">${texts.join("")}</div>`;
  }

  /**
   * Given [0, 1, 2, 4, ...] explain it
   */
  export function explainSkills(
    skill_array_raw: readonly number[],
    is_hide_skills?: boolean,
    is_to_fixed?: boolean,
  ): string {
    const skill_array = setup.Skill.translate(skill_array_raw);
    const texts = [];
    for (let i = 0; i < skill_array.length; ++i) {
      if (skill_array[i]) {
        let image_rep = setup.skill[i].rep();
        if (is_hide_skills) {
          image_rep = setup.skill[i].getName();
        }
        let val;
        if (is_to_fixed) {
          val = skill_array[i].toFixed(1);
        } else {
          val = Math.round(skill_array[i]);
        }
        texts.push(`<span>${val} ${image_rep}</span>`);
      }
    }
    return texts.join("║");
  }

  /**
   * Given [1, 0, 2, 1], output [brawn][surv][surv][intrigue].
   * Must be integers.
   */
  export function explainSkillsCopy(skill_array_raw: number[]): string {
    let skill_array = setup.Skill.translate(skill_array_raw);
    let text = "";
    for (let i = 0; i < skill_array.length; ++i) {
      if (skill_array[i]) {
        let skill = setup.skill[i];
        for (let j = 0; j < skill_array[i]; ++j) {
          text += skill.rep();
        }
      }
    }
    return text;
  }
}
