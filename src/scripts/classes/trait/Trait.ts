import { Constants, type NumericConstant } from "../../constants";
import type { _TraitKey } from "../../data/traits/_index";
import { DataUtil } from "../../util/DataUtil";
import { rng } from "../../util/rng";
import { TwineClass } from "../_TwineClass";
import type { Rarity } from "../deck/Rarity";
import type { SkillValuesArray, SkillValuesInit } from "../Skill";
import type { Unit } from "../unit/Unit";
import { TraitGroup, type TraitGroupKey } from "./TraitGroup";
import type { TraitTexts } from "./TraitTexts";

export { TraitTexts };

//export type TraitKey = BrandedType<string, "TraitKey">;
export type TraitKey = _TraitKey;

export interface TraitIconSettings {
  tier?: number;
  icon?: string;
  colors?: boolean;
  background?: string;
  minus?: boolean;
  plus?: boolean;
  cross?: boolean;

  /** Used for mods; the full path to the image (can be a URL or a path relative to the game folder) */
  path?: string;
}

export interface InlineTraitGroupDefinition<K extends string> {
  add_tags?: string[];
  sequence?: { [k in K]: TraitDefinition | null };
  pool?: { [k in K]: TraitDefinition };
}

export interface TraitDefinition {
  name: string;
  description: string;
  slave_value?: number | NumericConstant;
  skill_bonuses?: SkillValuesInit;
  tags?: readonly string[];
  icon_settings?: TraitIconSettings;
}

export type TraitOrGroupDefinition =
  | TraitDefinition
  | InlineTraitGroupDefinition<string>;

export type TraitOrGroupDefinitions = Record<string, TraitOrGroupDefinition>;

export class Trait extends TwineClass {
  key: TraitKey;
  name: string;
  description: string;
  slave_value: number;
  tags: readonly string[];
  icon_settings: TraitIconSettings;
  order_no: number;
  trait_group_key: TraitGroupKey | null;
  skill_bonuses: number[];
  is_has_skill_bonuses: boolean;

  static order_gen = {
    job: -5000,
    gender: -4000,
    race: -3000,
    subrace: -2000,
    bg: -1000,
    "": 1,
  };

  constructor(key_: string, def: Readonly<TraitDefinition>) {
    super();

    const key = key_ as TraitKey;

    if (!key) throw new Error(`null key for trait`);
    this.key = key;

    if (!def.name) throw new Error(`null name for trait ${key}`);
    this.name = def.name;

    if (!def.description) throw new Error(`null name for trait ${key}`);
    this.description = def.description;

    if (def.tags) {
      if (!Array.isArray(def.tags))
        throw new Error(`${key} tags wrong: ${def.tags}`);
      this.tags = def.tags;
    } else {
      this.tags = [];
    }

    this.icon_settings = def.icon_settings || {};

    if (DataUtil.CURRENT_MOD) {
      if (!this.icon_settings.icon) {
        this.icon_settings = {
          ...this.icon_settings,
          icon: "fallback",
        };
      } else if (
        this.icon_settings.icon.includes(".") ||
        this.icon_settings.icon.includes("/")
      ) {
        // is not a builtin trait icon e.g. "per_curious" but rather a relative path
        this.icon_settings = {
          ...this.icon_settings,
          path: `/mods/${DataUtil.CURRENT_MOD.path}/${this.icon_settings.icon}`,
        };
        delete this.icon_settings.icon;
      }

      // Add body parts to trait group automatically
      for (const tag of this.tags) {
        if (tag in setup.traitgroup) {
          const traitgroup = setup.traitgroup[tag as TraitGroupKey];
          if (traitgroup.is_not_ordered) {
            traitgroup._addTrait(this);
          }
        }
      }
    }

    const [prefix] = key.split("_");
    const k = (
      prefix in Trait.order_gen ? prefix : ""
    ) as keyof typeof Trait.order_gen;
    this.order_no = Trait.order_gen[k]++;

    this.trait_group_key = null;

    this.skill_bonuses = setup.Skill.translate(def.skill_bonuses ?? {});

    this.is_has_skill_bonuses = false;
    for (let i = 0; i < setup.skill.length; ++i)
      if (this.skill_bonuses[i]) {
        this.is_has_skill_bonuses = true;
      }

    if (typeof def.slave_value === "string") {
      this.slave_value = Constants[def.slave_value];
    } else if (def.slave_value) {
      this.slave_value = def.slave_value;
    } else {
      this.slave_value = 0;
    }

    if (key in setup.trait) throw new Error(`Trait ${key} duplicated`);
    setup.trait[key as TraitKey] = this;
  }

  /**
   * Called at end of each week from the unit.
   */
  advanceWeek(unit: Unit): void {}

  /**
   * @deprecated Use getTexts()
   */
  text(): TraitTexts {
    return this.getTexts();
  }

  getTexts(): TraitTexts {
    return setup.TRAIT_TEXTS[this.key];
  }

  getDescription(): string {
    return this.description;
  }

  getDescriptionDisplay(): string {
    let base = this.description;
    if (this.slave_value) {
      base = `${base} (worth: ${setup.DOM.toString(setup.DOM.Util.money(this.getSlaveValue()))})`;
    }
    if (this.isHasSkillBonuses()) {
      base = `(${setup.SkillHelper.explainSkillMods(this.getSkillBonuses())}) ${base}`;
    }
    return base;
  }

  isHasSkillBonuses(): boolean {
    return this.is_has_skill_bonuses;
  }

  getSkillBonuses(): SkillValuesArray {
    return this.skill_bonuses;
  }

  getImage(): string {
    const icon_settings = this.icon_settings;
    return (
      icon_settings.path ??
      "img/trait/" + (icon_settings.icon || this.key) + ".svg"
    );
  }

  // warning: order matters! closer to beginning = more priority
  static ICON_BACKGROUNDS: Record<string, { effect?: string }> = {
    negative2: { effect: "trait-fx-invert" },
    negative: { effect: "trait-fx-invert" },
    positive3: { effect: "trait-fx-positive3" },
    positive2: { effect: "trait-fx-invert" },
    positive: { effect: "trait-fx-invert" },
    blessing: {},
    blessing_max: {},
    curse: {},
    curse_max: {},
    boon: {},
    trauma: {},
    skin: {},
    trmaster: { effect: "trait-fx-trmaster" },
    tradvanced: {},
    training: {},
    equipment: { effect: "trait-fx-invert" },
    magic: {},
    skill: {},
    per: { effect: "trait-fx-invert" },
    race: { effect: "trait-fx-invert" },
    subrace: {},
    bg: {},
    perkspecial: { effect: "trait-fx-invert" },
    perkbasic: {},
    perkstandard: { effect: "trait-fx-invert" },
  };

  getRarity(): Rarity {
    const value = this.getSlaveValue();
    if (value >= Constants.MONEY_TRAIT_LEGENDARY) return setup.rarity.legendary;
    else if (value >= Constants.MONEY_TRAIT_EPIC) return setup.rarity.epic;
    else if (value >= Constants.MONEY_TRAIT_RARE) return setup.rarity.rare;
    else if (value >= Constants.MONEY_TRAIT_MEDIUM)
      return setup.rarity.uncommon;
    else if (value < 0) return setup.rarity.never;
    else return setup.rarity.common;
  }

  _getCssAttrs(): string {
    let style = "";
    let classes = "trait " + this.getRarity().getIconTriangleClass();

    if (this.icon_settings.tier)
      classes += " trait-tier" + this.icon_settings.tier;

    if (this.icon_settings.minus) classes += " trait-minus";

    if (this.icon_settings.plus) classes += " trait-plus";

    if (this.icon_settings.cross) classes += " trait-cross";

    const tags = this.icon_settings.background
      ? [this.icon_settings.background]
      : this.tags;
    for (const tag of Object.keys(setup.Trait.ICON_BACKGROUNDS)) {
      if (tags.includes(tag)) {
        // found
        const taginfo = setup.Trait.ICON_BACKGROUNDS[tag];
        style += `--trait-bg-image: url(${setup.resolveImageUrl("img/trait/backgrounds/" + tag + ".svg")});`;
        if (!this.icon_settings.colors && taginfo.effect)
          classes += " " + taginfo.effect;
        break;
      }
    }

    return `class="${classes}" style="${style}"`;
  }

  _rep(tooltip: boolean, tooltip_noclick?: boolean): string {
    let inner = tooltip
      ? setup.repImg({
          imagepath: this.getImage(),
          tooltip_content: `<<tooltiptrait '${this.key}'>>`,
          tooltip_noclick: tooltip_noclick,
        })
      : setup.repImg({
          imagepath: this.getImage(),
        });
    const tags = this.icon_settings.background || this.tags.join(" ");
    return `<span ${this._getCssAttrs()}><span>${inner}</span></span>`;
  }

  getImageRep(): string {
    return this._rep(false);
  }

  rep(tooltip_noclick?: boolean): string {
    return this._rep(true, tooltip_noclick);
  }

  repFull(): string {
    return `<span class='capitalize' data-tooltip="<<tooltiptrait '${this.key}'>>">${this._rep(/* tooltip = */ false)} ${this.getName()}</span>`;
  }

  repNegative(tooltip_noclick?: boolean): string {
    return `<span class="negtraitcard">${this.rep(tooltip_noclick)}</span>`;
  }

  repPositive(tooltip_noclick?: boolean): string {
    return `<span class="traitcardglow">${this.rep(tooltip_noclick)}</span>`;
  }

  repSizeAdjective(): string {
    const text = this.text();
    if (text && text.size_adjective) {
      return rng.choice(text.size_adjective);
    } else {
      return "";
    }
  }

  repAdjective(): string {
    const text = this.text();
    if (text && text.adjective) {
      return rng.choice(text.adjective);
    } else {
      return "";
    }
  }

  repNounGood(): string {
    return rng.choice(this.text().noungood ?? [""]);
  }

  repNounBad(): string {
    return rng.choice(this.text().nounbad ?? [""]);
  }

  getName(): string {
    return this.name;
  }

  getSlaveValue(): number {
    return this.slave_value;
  }

  getTraitGroup(): TraitGroup | undefined {
    return this.trait_group_key
      ? setup.traitgroup[this.trait_group_key]
      : undefined;
  }

  getTraitLevel(): number {
    const my_index = this.getTraitGroup()!._getTraitIndex(this);
    const null_index = this.getTraitGroup()!._getTraitIndex(null);
    return my_index - null_index;
  }

  getTags(): readonly string[] {
    return this.tags;
  }

  isHasTag(tag: string): boolean {
    return this.getTags().includes(tag);
  }

  isHasAnyTag(tag_array: string[]): boolean {
    return this.getTags().includesAny(tag_array);
  }

  isHasAllTags(tag_array: string[]): boolean {
    return this.getTags().includesAll(tag_array);
  }

  getTraitCover(): (Trait | null)[] {
    let traitgroup = this.getTraitGroup();
    if (!traitgroup) return [this];
    return traitgroup.getTraitCover(this);
  }

  isNeedDick(): boolean {
    return this.getTags().includes("needdick");
  }

  isNeedVagina(): boolean {
    return this.getTags().includes("needvagina");
  }

  isNeedGenital(): boolean {
    return this.isNeedDick() || this.isNeedVagina();
  }

  isCorruption(): boolean {
    return (
      this.getTags().includes("corruption") ||
      this == setup.trait.corrupted ||
      this == setup.trait.corruptedfull
    );
  }

  isAttachable(): boolean {
    return !this.getTags().filter((tag) =>
      ["computed", "temporary", "equipment"].includes(tag),
    ).length;
  }

  isAttachableInContentCreator(): boolean {
    return (
      this.isAttachable() &&
      !this.getTags().includes("perk") &&
      !this.getTags().includes("blessingcurse") &&
      !(this == setup.trait.training_mindbreak)
    );
  }

  isCompatibleWithGender(gender: Trait): boolean {
    if (!gender.getTags().includes("gender"))
      throw new Error(
        `Gender in iscompatiblewithgender must be a gender, not ${gender.key}`,
      );
    // TODO
    if (this.isNeedDick() && gender == setup.trait.gender_female) return false;
    if (this.isNeedVagina() && gender == setup.trait.gender_male) return false;
    return true;
  }

  isAttachableTo(unit: Unit): boolean {
    if (!this.isAttachable()) return false;
    const tags = this.getTags();
    if (
      tags.includes("training") &&
      this != setup.trait.training_mindbreak &&
      unit.isDefiant()
    ) {
      // defiant slaves can't receive training except mindbreak. They can get mindbroken.
      // Mindbroken affects defiancy a little differently:
      // it will hide will_defiant, until they recover, which then resurface
      // it will NOT hide will_indomitable.
      return false;
    }
    if (!unit.isHasDick() && this.isNeedDick()) return false;
    if (!unit.isHasVagina() && this.isNeedVagina()) return false;
    return true;
  }

  static cmp(trait1: Trait, trait2: Trait): number {
    if (trait1.order_no < trait2.order_no) return -1;
    if (trait1.order_no > trait2.order_no) return 1;
    return 0;
  }
}

export namespace TraitHelper {
  export function getAllTraitsOfTag(tag: string): Trait[] {
    let traits = [];
    for (let traitkey of objectKeys(setup.trait)) {
      let trait = setup.trait[traitkey];
      if (trait.isHasTag(tag)) traits.push(trait);
    }
    return traits;
  }

  export function getAllTraitsOfTags(tags: readonly string[]): Trait[] {
    if (!Array.isArray(tags))
      throw new Error(`getAllTraitsOftags must be called with array`);
    let traits = [];
    for (let traitkey of objectKeys(setup.trait)) {
      let trait = setup.trait[traitkey];
      let ok = true;
      for (let i = 0; i < tags.length; ++i) {
        if (!trait.isHasTag(tags[i])) {
          ok = false;
          break;
        }
      }
      if (ok) traits.push(trait);
    }
    return traits;
  }

  /**
   * Returns all traits that can actually be added to units. Ignore temporary/computed traits.
   */
  export function getAttachableTraits(): Trait[] {
    return Object.values(setup.trait).filter((trait) => trait.isAttachable());
  }

  /**
   * Returns all traits that can actually be added to units minus those that are added in a special way. Ignore temporary/computed traits.
   */
  export function getAttachableTraitsInContentCreator(): Trait[] {
    return Object.values(setup.trait).filter((trait) =>
      trait.isAttachableInContentCreator(),
    );
  }

  export let EQUIPMENT_SLUTTY: TraitKey[] = [];

  export const TRAINING_BASIC_GENDERLESS = () =>
    getAllTraitsOfTags(["trbasic", "trmale", "trfemale"]);

  export const TRAINING_BASIC = () => getAllTraitsOfTags(["trbasic"]);

  export const TRAINING_ADVANCED = () => getAllTraitsOfTags(["tradvanced"]);

  export const TRAINING_ADVANCED_GENDERLESS = () =>
    getAllTraitsOfTags(["tradvanced", "trmale", "trfemale"]);

  export const TRAINING_MASTER = () => getAllTraitsOfTags(["trmaster"]);

  export const TRAINING_MASTER_GENDERLESS = () =>
    getAllTraitsOfTags(["trmaster", "trmale", "trfemale"]);

  export const TRAINING_ALL = () => [
    ...TRAINING_BASIC(),
    ...TRAINING_ADVANCED(),
    ...TRAINING_MASTER(),
  ];

  export const TRAINING_ALL_GENDERLESS = () => [
    ...TRAINING_BASIC_GENDERLESS(),
    ...TRAINING_ADVANCED_GENDERLESS(),
    ...TRAINING_MASTER_GENDERLESS(),
  ];

  export const TRAINING_ALL_INCL_MINDBREAK = () => [
    ...TRAINING_ALL(),
    setup.trait.training_mindbreak,
  ];
}
