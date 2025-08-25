import { Constants } from "../../constants";
import { TwineClass } from "../_TwineClass";
import type { Bedchamber } from "../bedchamber/BedChamber";
import type { Company, CompanyKey } from "../Company";
import type { Contact, ContactKey } from "../contact/Contact";
import type { ContentTemplate } from "../content/ContentTemplate";
import type { Rarity } from "../deck/Rarity";
import type { DutyInstance, DutyInstanceKey } from "../duty/DutyInstance";
import type { Equipment } from "../equipment/Equipment";
import type { EquipmentSet, EquipmentSetKey } from "../equipment/EquipmentSet";
import type {
  EquipmentSlot,
  EquipmentSlotKey,
} from "../equipment/EquipmentSlot";
import type { Job, JobKey } from "../job/Job";
import type { MarketKey } from "../market/Market";
import type { MarketUnit } from "../market/subtypes/MarketUnit";
import type {
  OpportunityInstance,
  OpportunityInstanceKey,
} from "../opportunity/OpportunityInstance";
import type { Party, PartyKey } from "../party/Party";
import type { QuestInstance, QuestInstanceKey } from "../quest/QuestInstance";
import type { Living } from "../retire/Living";
import type {
  Skill,
  SkillKey,
  SkillValuesArray,
  SkillValuesInit,
} from "../Skill";
import type { Speech, SpeechKey } from "../Speech";
import type { Team, TeamKey } from "../Team";
import type { Title, TitleKey } from "../title/Title";
import type { Perk } from "../trait/Perk";
import { Subrace } from "../trait/Subrace";
import { TraitHelper, type Trait, type TraitKey } from "../trait/Trait";
import type { TraitGroup } from "../trait/TraitGroup";
import { UnitSkillsHelper, type SkillBreakdown } from "./Unit_SkillsHelper";
import {
  Unit_autoAssignPerks,
  Unit_CmpDefault,
  Unit_CmpJob,
  Unit_CmpName,
  Unit_getAnyConflictingPerTraits,
  Unit_getAnySamePerTraits,
  Unit_getConflictingPerTraits,
  Unit_getSamePerTraits,
} from "./Unit_static";
import { UnitTitleHelper } from "./Unit_TitleHelper";
import { UnitTraitCacheHelper } from "./Unit_TraitCacheHelper";
import { UnitTraitsHelper } from "./Unit_TraitsHelper";
import type { UnitGroup, UnitGroupKey } from "./UnitGroup";

type ValueBreakdown = Array<{ value: number; title: string }>;

/** Unique units (like the pc) use string IDs, whereas non-unique use numbers */
export type UnitKey = BrandedType<string | number, "UnitKey">;

export class Unit extends TwineClass {
  //
  // Unit properties
  //

  key: UnitKey;
  level: number;
  first_name: string;
  surname: string;
  custom_image_name: string;
  nickname: string;

  /** Unit's traits */
  trait_key_map: { [k in TraitKey]?: boolean } = {};

  /** Unit's innate (skin) traits */
  innate_trait_key_map: { [k in TraitKey]?: boolean } = {};

  /**
   * List of unit's extra perk choices.
   */
  perk_keys_choices: TraitKey[] = [];

  /** Unit's speech type. */
  speech_key: SpeechKey | null = null;

  job_key: JobKey = setup.job.unemployed.key;

  skills: SkillValuesArray = [];

  /** List of INVISIBLE tags. Useful for marking units for certain quests. */
  tags: string[] = [];

  /** Skills at level 1. For implementing re-speccing later. */
  base_skills: SkillValuesArray = [];

  // this unit belongs to...
  team_key: TeamKey | null = null;
  party_key: PartyKey | null = null;
  company_key: CompanyKey | null = null;
  unit_group_key: UnitGroupKey | null = null;
  duty_key: DutyInstanceKey | null = null;
  contact_key: ContactKey | null = null;

  // Current quest this unit is tied to. E.g., relevant mostly for actors
  quest_key: QuestInstanceKey | null = null;
  opportunity_key: OpportunityInstanceKey | null = null;

  market_key: MarketKey | null = null;

  equipment_set_key: EquipmentSetKey | null = null;

  exp = 0;

  /** Accumulated number of weeks this unit has been with your company. */
  weeks_with_you = 0;

  /** Flavor text to supplement unit origin */
  origin = "";

  /** The quest/event/interaction/etc that generates this unit. For debug only. */
  debug_generator_type?: string | null = null;
  /** The quest/event/interaction/etc that generates this unit. For debug only. */
  debug_generator_key?: string | null = null;

  skill_focus_keys: SkillKey[] = [];

  history: string[] = [];

  is_speech_reset = true;

  seed?: number;

  //////////////////////////
  //////////////////////////
  //////////////////////////

  constructor(
    bothnamearray: string[],
    traits: Trait[],
    skills_raw: SkillValuesInit,
    unique_key?: string,
  ) {
    super();

    // skills: a 10 array indicating the initial value for the 10 skills in game.
    // A unit
    // Usually belongs to a company. Otherwise is unemployed.
    // E.g., a farmer belongs to the kingdom company.
    if (unique_key) {
      this.key = unique_key as UnitKey;
    } else {
      this.key = State.variables.Unit_keygen++ as UnitKey;
    }

    this.level = 1;
    this.first_name = bothnamearray[0];

    // some surname can be empty.
    this.surname = bothnamearray[1];

    this.custom_image_name = "";

    this.nickname = this.first_name;

    this.trait_key_map = {};
    this.innate_trait_key_map = {};

    for (const trait of traits) {
      if (!trait) throw new Error(`Unrecognized trait for unit ${this.name}`);
      this.trait_key_map[trait.key] = true;
      if (trait.getTags().includes("skin")) {
        // skin traits are innate
        this.innate_trait_key_map[trait.key] = true;
      }
    }

    let skills = setup.Skill.translate(skills_raw);

    if (skills.length != setup.skill.length)
      throw new Error(`Skills must have exactly 10 elements`);
    for (let i = 0; i < skills.length; ++i) {
      this.skills.push(skills[i]);
      this.base_skills.push(skills[i]);
    }

    if (this.key in State.variables.unit)
      throw new Error(`Unit ${this.key} duplicated`);
    State.variables.unit[this.key] = this;

    this.reSeed();
  }

  /**
   * How many perks can this unit learn?
   */
  getStandardPerkLimit(): number {
    let perks = 0;
    for (const level of setup.PERK_GAIN_AT_LEVEL) {
      if (this.getLevel() >= level) ++perks;
    }
    return perks;
  }

  /**
   * How many special perks can this unit learn?
   */
  getSpecialPerkLimit(): number {
    return setup.TRAIT_MAX_HAVE.perkspecial;
  }

  isCanLearnNewPerk(): boolean {
    return this.getLearnablePerks().length > 0;
  }

  /**
   * Return list of all perks that this unit could possibly learn. Must re-check that the unit can actually learn it.
   */
  getPerkChoices(): Perk[] {
    if (!this.perk_keys_choices.length) {
      // generate extra perk choices.

      const perks: Perk[] = [];

      const all_perks = TraitHelper.getAllTraitsOfTags(["perk"]).filter(
        (perk) => !perk.getTags().includes("perkspecial"),
      ) as Perk[];

      const available = all_perks.filter((perk) =>
        perk.isPerkAvailableInChoiceFor(this),
      );
      const available_nonbasic = available.filter(
        (perk) => !perk.getTags().includes("perkbasic"),
      );

      // compute the random perks
      const others = available_nonbasic.filter((perk) => !perks.includes(perk));
      setup.rng.shuffleArray(others);

      // if player character, can learn everything
      if (this.isYou()) {
        perks.push(...all_perks);
      } else {
        for (const perk of others) {
          if (perks.length < setup.PERK_EXTRA_CHOICES) {
            perks.push(perk);
          }
        }
        // also, all basic perks are always available
        perks.push(
          ...available.filter((perk) => perk.getTags().includes("perkbasic")),
        );
      }

      this.perk_keys_choices = perks.map((perk) => perk.key);
    }

    const base = this.perk_keys_choices.map((key) => setup.trait[key]);
    base.sort(setup.Trait.cmp);
    return base as Perk[];
  }

  getLearnablePerks(): Perk[] {
    const learnable: Perk[] = [];

    if (!this.isSlaver()) return learnable;

    const perks = this.getAllTraitsWithTag("perk");

    const choices = this.getPerkChoices().filter(
      (perk) => !this.isHasTrait(perk),
    );

    const current_standard_perks = perks.filter((perk) => !perk.isSpecial());
    if (current_standard_perks.length < this.getStandardPerkLimit()) {
      learnable.push(...choices.filter((perk) => !perk.isSpecial()));
    }

    const current_special_perks = perks.filter((perk) => perk.isSpecial());
    if (current_special_perks.length < this.getSpecialPerkLimit()) {
      learnable.push(...choices.filter((perk) => perk.isSpecial()));
    }

    return learnable;
  }

  /**
   * Force add a perk choice. Works for non basic perks.
   * @returns Whether succesfully added. Can fail, e.g., when the unit already know it
   */
  addPerkChoice(trait: Trait): boolean {
    if (trait.getTags().includes("perkbasic")) {
      throw new Error(`Can only add non basic perks, not ${trait.key}!`);
    }
    // generate perks
    this.getPerkChoices();
    if (this.perk_keys_choices.includes(trait.key)) {
      // already know this perk
      if (this.isYourCompany()) {
        setup.notify(
          `a|Rep a|was supposed to gain access to the ${trait.rep()} perk, but a|they already a|know it`,
          { a: this },
        );
      }
      return false;
    }

    this.perk_keys_choices.push(trait.key);
    if (this.isYourCompany()) {
      setup.notify(`a|Rep a|gain access to the ${trait.rep()} perk!`, {
        a: this,
      });
    }
    return true;
  }

  /**
   * Force remove a perk choice. Relevant for special perks.
   */
  removePerkChoice(trait: Trait | Perk) {
    if (trait.getTags().includes("perkbasic")) {
      throw new Error(
        `Can only remove non-basic traits from perk choice, not ${trait.key}!`,
      );
    }
    // generate perks
    this.getPerkChoices();
    if (!this.perk_keys_choices.includes(trait.key)) {
      // does not know the perk
      return;
    }

    this.perk_keys_choices = this.perk_keys_choices.filter(
      (key) => key != trait.key,
    );
    if (this.isYourCompany()) {
      setup.notify(`a|Rep a|lose access to the ${trait.rep()} perk!`, {
        a: this,
      });
    }
    if (this.isHasRemovableTrait(trait)) {
      this.removeTraitExact(trait);
    }
  }

  isHasPerkChoice(trait: Trait): boolean {
    return (this.getPerkChoices() as Trait[]).includes(trait);
  }

  getContact(): Contact | null {
    if (!this.contact_key) return null;
    return State.variables.contact[this.contact_key];
  }

  _isCanDelete(): boolean {
    return (
      !this.quest_key &&
      !this.opportunity_key &&
      !this.market_key &&
      !this.company_key &&
      !this.unit_group_key &&
      !this.contact_key &&
      !this.isRetired() &&
      !State.variables.bodyshift.isSpareBody(this) &&
      !State.variables.eventpool.isUnitScheduledForEvent(this)
    );
  }

  delete() {
    // there is a check here because sometimes the unit can be removed and then immediately added again
    // e.g., see Light in Darkness disaster results.

    // Note: need to update because delete can be on stale object
    const check_obj = State.variables.unit[this.key];

    if (check_obj && check_obj._isCanDelete()) {
      this.clearCache();
      State.variables.unitimage.deleteUnit(this);
      State.variables.activitylist.removeUnitActivity(this);
      State.variables.hospital.deleteUnit(this);
      State.variables.friendship.deleteUnit(this);
      State.variables.trauma.deleteUnit(this);
      State.variables.family.deleteUnit(this);
      State.variables.leave.deleteUnit(this);
      State.variables.bodyshift.deleteUnit(this);
      State.variables.skillboost.deleteUnit(this);
      if (this.key in State.variables.unit) {
        delete State.variables.unit[this.key];
      }
    }
  }

  checkDelete() {
    let check_obj = State.variables.unit[this.key];
    if (check_obj && check_obj._isCanDelete()) {
      setup.queueDelete(check_obj, "unit");
    }
  }

  isRetired(): boolean {
    return State.variables.retiredlist.isRetired(this);
  }

  getLiving(): Living {
    return State.variables.retiredlist.getLiving(this);
  }

  advanceWeek() {
    if (this.isYourCompany()) {
      this.weeks_with_you += 1;
    }

    for (const trait of this.getTraits()) {
      trait.advanceWeek(this);
    }

    this.resetCache();
  }

  reSeed() {
    this.seed = Math.floor(Math.random() * 999999997);
  }

  setName(firstname: string, surname: string) {
    let changenick = this.nickname == this.first_name;
    this.first_name = firstname;
    this.surname = surname;
    if (changenick) this.nickname = this.first_name;

    this.resetCache();
  }

  getWeeksWithCompany() {
    return this.weeks_with_you;
  }

  resetWeeksWithCompany() {
    this.weeks_with_you = 0;
  }

  getOrigin() {
    return setup.Text.replaceUnitMacros(this.origin, { a: this });
  }

  setOrigin(origin_text: string) {
    this.origin = origin_text;
    this.resetCache();
  }

  /**
   * TRAITS ARE UNRELIABLE here, due to being called when traits are refreshed.
   * Do NOT use trait methods like isMindbroken
   */
  getSlaveValueBreakdown(): ValueBreakdown {
    const result: ValueBreakdown = [];
    result.push({
      value: setup.SLAVE_BASE_VALUE,
      title: "Base",
    });

    // increase value based on traits. Cannot use computed traits, because computed traits depend on this
    let traits = this.getBaseTraits();

    // add trauma to list of traits, because they are special and have negative value
    traits = traits.concat(State.variables.trauma.getTraits(this));

    const isdemon = this.getRace() == setup.trait.race_demon;
    for (const trait of traits) {
      const trait_value = trait.getSlaveValue();

      if (isdemon && trait_value < 0 && trait.isCorruption()) {
        // demons ignore demonic bodypart penalty
        continue;
      }

      if (trait_value) {
        result.push({
          value: trait_value,
          title: trait.rep(),
        });
      }
    }

    // increase value based on ALL titles
    for (const title of State.variables.titlelist.getAllTitles(this)) {
      const value = title.getSlaveValue();
      if (value) {
        result.push({
          value: value,
          title: title.rep(),
        });
      }
    }
    return result;
  }

  /**
   * TRAITS ARE UNRELIABLE here, due to being called when traits are refreshed.
   * Do NOT use trait methods like isMindbroken
   */
  getSlaveValue(): number {
    // reset unit value cache
    if (!State.variables.cache.has("unitvalue", this.key)) {
      const value = Math.round(
        this.getSlaveValueBreakdown()
          .map((breakdown) => breakdown.value)
          .reduce((a, b) => a + b, 0),
      );
      State.variables.cache.set("unitvalue", this.key, value);
    }

    return State.variables.cache.get("unitvalue", this.key) || 0;
  }

  getSluttinessLimit() {
    if (this.isYou()) return setup.INFINITY;

    let base;
    if (this.isHasTraitExact(setup.trait.per_chaste)) {
      base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_CHASTE;
    } else if (this.isHasTraitExact(setup.trait.per_sexaddict)) {
      base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_SEXADDICT;
    } else if (this.isHasTraitExact(setup.trait.per_lustful)) {
      base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_LUSTFUL;
    } else {
      base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL;
    }

    if (
      !this.isHasTrait(setup.trait.per_chaste) &&
      this.isHasTrait(setup.trait.perk_sluttiness)
    ) {
      base += setup.PERK_SLUTTINESS_LIMIT_INCREASE;
    }

    return base;
  }

  isCanChangeEquipmentSet(): boolean {
    return (
      State.variables.fort.player.isHasBuilding("armory") &&
      this.isYourCompany() &&
      this.isHome()
    );
  }

  isCanWear(equipment_set: EquipmentSet): boolean {
    return this.isCanChangeEquipmentSet() && equipment_set.isEligibleOn(this);
  }

  /**
   * Whether the unit is currently busy with a quest/opp/event/market/etc
   * Must ABSOLUTELY not be disturbed or selected by events
   * Work for all jobs
   */
  isEngaged(): boolean {
    return !!(this.quest_key || this.opportunity_key || this.market_key);
  }

  /**
   * Whether the unit is currently at your fort. Mainly for your units
   * Use isEngaged() for NPCs
   */
  isHome(ignore_leave?: boolean): boolean {
    if (!this.isYourCompany()) return false; // not in your company

    if (this.isEngaged()) return false; // on a quest/opp/somewhere sold

    if (!ignore_leave && State.variables.leave.isOnLeave(this)) return false; // on leave

    return true;
  }

  /**
   * Whether the unit is currently at your fort AND not injured. Mainly for your units
   * Use isEngaged() for NPCs
   */
  isAvailable(): boolean {
    return this.isHome() && !State.variables.hospital.isInjured(this);
  }

  /**
   * Whether the unit is busy with something right now. Mainly for your units
   * Use isEngaged() for NPCs
   */
  isBusy(): boolean {
    if (!this.isAvailable()) return true;

    const duty = this.getDuty();
    if (duty) return true;

    return false;
  }

  /**
   * Get a pseudo-random number based on this unit's seed and the given string.
   * Useful for making the unit has certain property, e.g., which preferred weapon
   */
  Seed(stringobj: string) {
    let t = `${stringobj}_${this.seed}`;
    let res = Math.abs(t.hashCode()) % 1000000009;
    return res;
  }

  /**
   * Gets a random value between 0 and almost 1.0. Never returns 1.0
   */
  seedFloat(stringobj: string) {
    const val = this.Seed(stringobj);
    return val / 1000000009.0;
  }

  /**
   * get bedchamber, if any. If a unit has multiple, return one at random.
   */
  getBedchamber(): Bedchamber | null {
    if (this.isSlave()) {
      const duty = this.getDuty();
      if (duty && duty instanceof setup.DutyInstanceBedchamberSlave) {
        return duty.getBedchamber();
      } else {
        return null;
      }
    } else if (this.isSlaver()) {
      const bedchambers = State.variables.bedchamberlist.getBedchambers({
        slaver: this,
      });
      if (bedchambers.length) {
        return setup.rng.choice(bedchambers);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getSpeechRule(): "full" | "animal" | "none" {
    if (!this.isSlave()) return "full";
    const bedchamber = this.getBedchamber();
    if (!bedchamber) return "full";
    return bedchamber.getOption("speech");
  }

  getFoodRule(): "normal" | "cum" | "milk" {
    if (!this.isSlave()) return "normal";
    const bedchamber = this.getBedchamber();
    if (!bedchamber) return "normal";
    return bedchamber.getOption("food");
  }

  getBedchamberOtherSlave(): Unit | null {
    const bedchamber = this.getBedchamber();
    if (this.isSlave() && bedchamber) {
      for (const slave of bedchamber.getSlaves()) {
        if (slave != this) return slave;
      }
    }
    return null;
  }

  isUsableBy(unit: Unit) {
    if (State.variables.hospital.isInjured(this)) return false;
    if (!this.isHome()) return false;
    let bedchamber = this.getBedchamber();
    if (!unit.isSlave() || !bedchamber || !bedchamber.isPrivate()) return true;
    return bedchamber.getSlaver() == unit;
  }

  getMainTraining(): Trait {
    return setup.UnitTitle.getMainTraining(this);
  }

  /**
   * Clears this unit's cache.
   */
  clearCache() {
    this.resetTraitMapCache();
    this.resetSkillCache();
    // reset unit value cache
    State.variables.cache.clear("unitvalue", this.key);
    this.resetSpeech();
  }
  /**
   * Resets this unit's cache, because something has changed.
   * resetImage can repopulate the cleared cache. Do not use this method when preparing to delete a unit.
   */
  resetCache() {
    this.clearCache();
    State.variables.unitimage.resetImage(this);
  }

  isCanHaveSexWithYou(): boolean {
    return (
      !this.isYou() &&
      this.isAvailable() &&
      State.variables.unit.player.isAvailable() &&
      State.variables.fort.player.isHasBuilding("dungeons") &&
      this.isUsableBy(State.variables.unit.player) &&
      !this.isDefiant()
    );
  }

  /**
   * Whether this unit acts submissively TO the target unit.
   */
  isSubmissiveTo(unit: Unit): boolean {
    if (this.isSlave() && !unit.isSlave()) return true;
    return (
      (!this.isDominant() && unit.isDominant()) ||
      (this.isSubmissive() && !unit.isSubmissive())
    );
  }

  /**
   * Whether this unit can be dismissed
   */
  isCanBeDismissed(): boolean {
    return (
      this.isYourCompany() &&
      this.isHome() &&
      !this.getParty() &&
      !this.isYou() &&
      (this.isSlave() ||
        State.variables.company.player.getUnits({ job: setup.job.slaver })
          .length > setup.SLAVER_COUNT_MINIMUM)
    );
  }

  /**
   * Whether this unit can be selected for auto-assignment.
   */
  isCanGoOnQuestsAuto(): boolean {
    const duty = this.getDuty();
    if (duty && !duty.isCanGoOnQuestsAuto()) return false;

    const party = this.getParty();
    if (party && !party.isCanGoOnQuestsAuto()) return false;

    return true;
  }

  setDebugInfo(content_template: ContentTemplate<string>) {
    if (!this.debug_generator_key) {
      this.debug_generator_key = content_template.key;
      this.debug_generator_type = content_template.TYPE;
    }
  }

  getRarity(): Rarity {
    const value = this.getSlaveValue();
    if (value >= 30000) {
      return setup.rarity.legendary;
    } else if (value >= 10000) {
      return setup.rarity.epic;
    } else if (
      value >= 5000 ||
      State.variables.titlelist.getAllTitles(this).length
    ) {
      return setup.rarity.rare;
    } else if (value >= 3000) {
      return setup.rarity.uncommon;
    } else {
      return setup.rarity.common;
    }
  }

  getTitle(): string {
    return UnitTitleHelper.getTitle(this);
  }

  getName(): string {
    return this.nickname;
  }

  get name(): string {
    if (this.surname) return `${this.first_name} ${this.surname}`;
    else return this.first_name;
  }

  getFullName(): string {
    return this.name;
  }

  getFirstName(): string {
    return this.first_name;
  }

  getSurname(): string {
    return this.surname;
  }

  getDuty(): DutyInstance | null {
    if (!this.duty_key) return null;
    return State.variables.duty[this.duty_key];
  }

  getTeam(): Team | null {
    if (!this.team_key) return null;
    return State.variables.team[this.team_key];
  }

  getParty(): Party | null {
    if (!this.party_key) return null;
    return State.variables.party[this.party_key];
  }

  getQuest(): QuestInstance | null {
    if (!this.quest_key) return null;
    return State.variables.questinstance[this.quest_key];
  }

  getOpportunity(): OpportunityInstance | null {
    if (!this.opportunity_key) return null;
    return State.variables.opportunityinstance[this.opportunity_key];
  }

  getEquipmentSet(): EquipmentSet | null {
    if (!this.equipment_set_key) return null;
    return State.variables.equipmentset[this.equipment_set_key];
  }

  isPlayerSlaver(): boolean {
    return this.getJob() == setup.job.slaver && this.isYourCompany();
  }

  isYou(): boolean {
    return this == State.variables.unit.player;
  }

  getUnitGroup(): UnitGroup | null {
    if (!this.unit_group_key) return null;
    return setup.unitgroup[this.unit_group_key];
  }

  getCompany(): Company | null {
    if (!this.company_key) return null;
    return State.variables.company[this.company_key];
  }

  isYourCompany(): boolean {
    return this.getCompany() == State.variables.company.player;
  }

  getJob(): Job {
    if (this.isRetired()) {
      return setup.job.retired;
    } else {
      return setup.job[this.job_key];
    }
  }

  isSlaver(): boolean {
    return this.getJob() == setup.job.slaver;
  }

  isSlave(): boolean {
    return this.getJob() == setup.job.slave;
  }

  isSlaveOrInSlaveMarket(): boolean {
    // case one: unit already has the job
    if (this.isSlave()) return true;

    // case two: unit is a free unit in market of that particular job
    if (!this.isYourCompany()) {
      const market = this.getMarket();
      if (market && market.getJob() == setup.job.slave) {
        return true;
      }
    }

    return false;
  }

  isObedient(): boolean {
    return this.isHasTrait("training_obedience_advanced");
  }

  isCompliant(): boolean {
    return this.isHasTrait("training_obedience_basic");
  }

  isMindbroken(): boolean {
    // Special, because has to work when cache trait is in limbo
    return setup.trait.training_mindbreak.key in this.trait_key_map;
  }

  isDefiant() {
    return (
      this.isHasTrait("will_defiant") || this.isHasTrait("will_indomitable")
    );
  }

  isHasStrapOn(): boolean {
    // only ever return true during sex.
    const genital_eq = this.getEquipmentAt(setup.equipmentslot.genital);
    if (genital_eq && genital_eq.getTags().includes("strapon")) {
      return true;
    }
    return false;
  }

  isHasDicklike(): boolean {
    return this.isHasDick() || this.isHasStrapOn();
  }

  isHasDick(): boolean {
    return this.isHasTrait(setup.trait.dick_tiny);
  }

  isHasBalls(): boolean {
    return this.isHasTrait(setup.trait.balls_tiny);
  }

  isInChastity(): boolean {
    return this.isHasTrait(setup.trait.eq_chastity);
  }

  isHasVagina(): boolean {
    return this.isHasTrait(setup.trait.vagina_tight);
  }

  isHasBreasts(): boolean {
    return this.isHasTrait(setup.trait.breast_tiny);
  }

  isSubmissive(): boolean {
    return this.isHasTrait(setup.trait.per_submissive);
  }

  isDominant(): boolean {
    return this.isHasTrait(setup.trait.per_dominant);
  }

  isDominantSlave(): boolean {
    if (!this.isSlave()) return false;
    return this.getMainTraining().getTags().includes("trdominance");
  }

  isMasochistic(): boolean {
    return (
      this.isHasTrait(setup.trait.per_masochistic) ||
      (this.isSlave() &&
        this.getMainTraining().getTags().includes("trmasochist"))
    );
  }

  isInjured(): boolean {
    return State.variables.hospital.isInjured(this);
  }

  isHasTitle(title: Title | TitleKey): boolean {
    return State.variables.titlelist.isHasTitle(this, title);
  }

  addTitle(title: Title) {
    return State.variables.titlelist.addTitle(this, title);
  }

  getEquipmentAt(slot: EquipmentSlot | EquipmentSlotKey): Equipment | null {
    return setup.Text.Unit.Equipment.getEquipmentAt(
      this,
      resolveObject(slot, setup.equipmentslot),
    );
  }

  getGenitalCovering() {
    const legs = this.getEquipmentAt(setup.equipmentslot.legs);
    if (legs && legs.isCovering()) {
      return legs;
    }

    const rear = this.getEquipmentAt(setup.equipmentslot.rear);
    if (rear && rear.isCovering()) {
      return rear;
    }

    return null;
  }

  getChestCovering() {
    const torso = this.getEquipmentAt(setup.equipmentslot.torso);
    if (torso && torso.isCovering()) {
      return torso;
    }

    const nipple = this.getEquipmentAt(setup.equipmentslot.nipple);
    if (nipple && nipple.isCovering()) {
      return nipple;
    }

    return null;
  }

  isNaked(): boolean {
    return setup.Text.Unit.Equipment.isNaked(this);
  }

  getMarket(): MarketUnit | null {
    if (!this.market_key) return null;
    return State.variables.market[this.market_key] as MarketUnit;
  }

  getLover(): Unit | null {
    return State.variables.friendship.getLover(this);
  }

  getBestFriend(): Unit | null {
    return State.variables.friendship.getBestFriend(this);
  }

  getOwnedBedchambers(): Bedchamber[] {
    if (this.isSlaver()) {
      return State.variables.bedchamberlist.getBedchambers({
        slaver: this,
      });
    }
    return [];
  }

  // #region EXP & LEVEL

  getLevel() {
    return this.level;
  }

  resetLevel() {
    this.level = 1;
    this.exp = 0;
    this.skills = setup.deepCopy(this.base_skills);
    if (this.isYourCompany()) {
      setup.notify(`a|Reps level is reset to 1.`, { a: this });
    }
    this.resetCache();
  }

  levelUp(levels: number = 1) {
    let skill_gains: SkillValuesArray = [];
    for (let i = 0; i < levels; ++i) {
      this.level += 1;
      this.exp = 0;

      // get skill gains
      skill_gains = UnitSkillsHelper.getRandomSkillIncreases.call(this);

      // increase skills

      this.increaseSkills(skill_gains);
    }
    if (this.isYourCompany()) {
      let explanation = setup.SkillHelper.explainSkillsCopy(skill_gains);
      const text = setup.Text.replaceUnitMacros(
        `a|Rep a|level up to level ${this.getLevel()} and gained`,
        { a: this },
      );
      setup.notify(`${text} ${explanation}`);

      if (
        State.variables.fort.player.isHasBuilding("warroom") &&
        this.isSlaver() &&
        this.isCanLearnNewPerk() &&
        setup.PERK_GAIN_AT_LEVEL.includes(this.getLevel())
      ) {
        setup.notify(`a|Rep a|is ready to learn a new perk`, { a: this });
      }
    }
    this.resetCache();
  }

  gainExp(amt: number) {
    if (amt <= 0) return;

    let level_ups = 0;

    while (amt > 0 && level_ups < Constants.LEVEL_UP_MAX_ONE_SITTING) {
      this.exp += amt;
      amt = 0;
      let needed = this.getExpForNextLevel();
      if (this.exp >= needed) {
        // put leftover back to amt
        amt = this.exp - needed;
        this.levelUp();
        level_ups += 1;
      }
    }
    this.resetCache();
  }

  getExp() {
    return this.exp;
  }

  getExpForNextLevel() {
    let level = this.getLevel();
    if (level < setup.LEVEL_PLATEAU) {
      let exponent = Math.pow(
        setup.EXP_LEVEL_PLATEAU / setup.EXP_LEVEL_1,
        1.0 / setup.LEVEL_PLATEAU,
      );
      return Math.round(setup.EXP_LEVEL_1 * Math.pow(exponent, level - 1));
    } else {
      let exponent = Math.pow(4.0, 1.0 / setup.EXP_LATE_GAME_QUAD_EVERY);
      return Math.round(
        (setup.EXP_LEVEL_PLATEAU / setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY) *
          setup.EXP_LATE_CLIFF *
          Math.pow(exponent, level - setup.LEVEL_PLATEAU),
      );
    }
  }

  getOnDutyExp() {
    if (this.getLevel() >= setup.LEVEL_PLATEAU) {
      return Math.round(
        (setup.EXP_DUTY_MULTIPLIER * setup.EXP_LEVEL_PLATEAU) /
          setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY,
      );
    } else {
      return Math.round(
        (setup.EXP_DUTY_MULTIPLIER * this.getExpForNextLevel()) /
          setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY,
      );
    }
  }

  // #endregion EXP & LEVEL

  // #region Traits

  addTrait(
    trait: Trait | null,
    trait_group?: TraitGroup | null,
    is_replace?: boolean,
  ) {
    return UnitTraitsHelper.addTrait.call(this, trait, trait_group, is_replace);
  }

  decreaseTrait(trait_group: TraitGroup) {
    if (!trait_group) {
      throw new Error(`Missing trait group in decreaseTrait`);
    }
    return this.addTrait(/* trait = */ null, trait_group);
  }

  /**
   * Innate traits are skin traits that the unit will get purified back to
   */
  getInnateTraits(): Trait[] {
    return objectKeys(this.innate_trait_key_map).map((key) => setup.trait[key]);
  }

  /**
   * Does this unit has this trait as its innate trait?
   */
  isHasInnateTrait(trait: Trait): boolean {
    return trait.key in this.innate_trait_key_map;
  }

  /**
   * Set a trait as an innate trait, replacing all conflicting ones
   */
  makeInnateTrait(trait: Trait, trait_group?: TraitGroup) {
    if (!trait.getTags().includes("skin"))
      throw new Error(`Can only make innate traits from skin traits`);
    trait_group = trait_group || trait.getTraitGroup();

    // remove conflicting traits
    for (const innate of this.getInnateTraits()) {
      if (innate.getTraitGroup() == trait_group) {
        delete this.innate_trait_key_map[innate.key];
      }
    }

    // set the innate trait
    this.innate_trait_key_map[trait.key] = true;
  }

  /**
   * Reset a unit's innate traits
   */
  setInnateTraits(traits: Trait[]) {
    this.innate_trait_key_map = {};
    for (const trait of traits) {
      this.innate_trait_key_map[trait.key] = true;
    }
  }

  /**
   * Reset a unit's innate traits to their current set of traits
   */
  resetInnateTraits(): void {
    this.setInnateTraits(this.getAllTraitsWithTag("skin"));
  }

  getMissingInnateTraits(): Trait[] {
    const traits = this.getInnateTraits();
    const result: Trait[] = [];
    for (const trait of traits) {
      if (!this.isHasRemovableTrait(trait)) result.push(trait);
    }
    return result;
  }

  getNonInnateSkinTraits(): Trait[] {
    const skins = this.getAllTraitsWithTag("skin");
    const result: Trait[] = [];
    for (const trait of skins) {
      if (!this.isHasInnateTrait(trait)) result.push(trait);
    }
    return result;
  }

  /**
   * Return all unit's base traits. These set of traits are usually static, and is innate to the unit.
   * Includes all in getTraits, and also: computed traits from equipments, join time, slave value, trauma, job
   */
  getBaseTraits(): Trait[] {
    return objectKeys(this.getBaseTraitMapCache())
      .map((trait_key) => setup.trait[trait_key])
      .filter((t) => t);
  }

  /**
   * Return all unit's traits and computed traits, EXCEPT for extra traits
   * These traits can change as the unit wear/unequip their equipments.
   * Includes: base traits, corruption, training, primary race
   */
  getTraits(): Trait[] {
    return objectKeys(this.getTraitMapCache())
      .map((trait_key) => setup.trait[trait_key])
      .filter((t) => t);
  }

  /**
   * Return all unit's traits
   * Includes: all traits returned by getTraits and getExtraTraits
   */
  getAllTraits(): Trait[] {
    const base = this.getTraits().concat(this.getExtraTraits());
    base.sort(setup.Trait.cmp);
    return base;
  }

  /**
   * Return all unit's extra traits as a list.
   * Includes ONLY: non-computed traits from equipments
   */
  getExtraTraits(): Trait[] {
    return objectKeys(this.getExtraTraitMapCache()).map(
      (trait_key) => setup.trait[trait_key],
    );
  }

  getRemovableTraits(): Trait[] {
    return this.getBaseTraits().filter((trait) => trait.isAttachable());
  }

  /**
   * Return a trait from this trait group that this unit have
   */
  getTraitFromTraitGroup(trait_group: TraitGroup): Trait | null {
    if (!trait_group) throw new Error(`missing trait group`);

    const traits = trait_group.getTraits();
    for (const trait of traits) {
      if (trait && this.isHasTraitExact(trait)) return trait;
    }
    return null;
  }

  /**
   * Does this unit has any of these traits?
   *
   * Accepts an array, or the traits as arguments
   */
  isHasAnyTraitExact(
    ...traits: [Array<Trait | TraitKey>] | Array<Trait | TraitKey>
  ): boolean {
    for (const trait of traits.flat() as Array<Trait | TraitKey>) {
      if (this.isHasTraitExact(trait)) return true;
    }
    return false;
  }

  isHasTraitsExact(traits: Trait[]): boolean {
    for (const trait of traits) {
      if (!this.isHasTraitExact(trait)) return false;
    }
    return true;
  }

  isHasTraitIncludeExtra(trait: Trait): boolean {
    for (const trait_covered of trait.getTraitCover()) {
      if (trait_covered && this.isHasTraitIncludeExtraExact(trait_covered))
        return true;
    }
    return false;
  }

  isHasTraitIncludeExtraExact(trait: Trait): boolean {
    return (
      this.isHasTraitExact(trait) || trait.key in this.getExtraTraitMapCache()
    );
  }

  /**
   * Does this unit have this trait?
   * Inexact: e.g. if unit has large penis, asking if it has a tiny penis will also return true.
   */
  isHasTrait(
    trait_: Trait | TraitKey | null | undefined,
    trait_group?: TraitGroup | null,
    ignore_cover?: boolean,
  ): boolean {
    const trait = trait_ ? resolveObject(trait_, setup.trait) : null;
    if (trait && !(trait instanceof setup.Trait)) {
      throw new Error(
        `isHasTrait expects either a string or a trait, e.g., isHasTrait("per_kind") or isHasTrait(setup.trait.per.kind), but found a ${typeof trait_}: ${trait_} instead.`,
      );
    }

    let traitgroup = trait_group;

    if (!traitgroup) {
      if (!trait) throw new Error(`Missing trait: ${trait_}`);
      traitgroup = trait.getTraitGroup();
    }

    if (traitgroup && !ignore_cover) {
      if (trait) {
        return this.isHasAnyTraitExact(
          traitgroup.getTraitCover(trait).filter((t) => !!t),
        );
      } else {
        const opposite = traitgroup
          .getTraitCover(trait, true)
          .filter((t) => !!t);
        return !this.isHasAnyTraitExact(opposite);
      }
    } else {
      return this.isHasAnyTraitExact([trait!]);
    }
  }

  /**
   * Remove all traits with this tag
   */
  removeTraitsWithTag(trait_tag: string) {
    const to_remove = [];
    const traits = this.getTraits();

    for (const trait of traits) {
      if (trait.getTags().includes(trait_tag)) {
        to_remove.push(trait);
      }
    }

    for (const trait of to_remove) {
      this.removeTraitExact(trait);
    }
  }

  /**
   * Removes a trait
   * @returns Whether it's actually been removed.
   */
  removeTraitExact(trait: Trait): boolean {
    if (!trait.isAttachable()) {
      // cannot be removed
      return false;
    }
    if (trait.key in this.trait_key_map) {
      delete this.trait_key_map[trait.key];
      this.resetCache();
      return true;
    }
    return false;
  }

  isHasTraitExact(trait: Trait | TraitKey): boolean {
    let trait_obj = resolveObject(trait, setup.trait);
    if (!trait_obj)
      throw new Error(`Missing trait in is has trait exact: ${trait}`);

    return trait_obj.key in this.getTraitMapCache();
  }

  isHasRemovableTrait(
    trait: Trait | TraitKey,
    include_cover?: boolean,
  ): boolean {
    const trait_obj = resolveObject(trait, setup.trait);
    if (!trait_obj.isAttachable()) return false;
    return this.isHasTrait(trait_obj, null, !include_cover);
  }

  isMale(): boolean {
    return this.isHasTraitExact(setup.trait.gender_male);
  }

  isFemale(): boolean {
    return this.isHasTraitExact(setup.trait.gender_female) || this.isSissy();
  }

  isSissy(): boolean {
    return (
      this.isHasTraitExact(setup.trait.training_sissy_advanced) ||
      this.isHasTraitExact(setup.trait.training_sissy_master)
    );
  }

  getWings(): Trait | null {
    return this.getTraitWithTag("wings");
  }

  getTail(): Trait | null {
    return this.getTraitWithTag("tail");
  }

  getTailPlug(): Equipment | null {
    const plug = this.getEquipmentAt(setup.equipmentslot.rear);
    if (plug && plug.getTags().includes("tailplug")) {
      return plug;
    }
    return null;
  }

  isHasTail(includes_tailplug?: boolean): boolean {
    if (this.getTail()) return true;
    if (includes_tailplug && this.getTailPlug()) return true;
    return false;
  }

  getTraitWithTag(tag: string): Trait | null {
    let traits = this.getTraits();
    for (let i = 0; i < traits.length; ++i) {
      if (traits[i] && traits[i].getTags().includes(tag)) return traits[i];
    }
    return null;
  }

  // declare overloads
  getAllTraitsWithTag(tag: string): Trait[];
  getAllTraitsWithTag(tag: "perk"): Perk[];

  getAllTraitsWithTag(tag: string): Trait[] {
    return this.getTraits().filter((a) => a.getTags().includes(tag));
  }

  getSubrace(): Trait {
    // Don't use getTraitWithTag, because this is part of a unit's base traits
    const traits = objectKeys(this.trait_key_map).filter((trait_key) => {
      const trait = setup.trait[trait_key];
      return trait && trait.getTags().includes("subrace");
    });
    if (traits.length > 1) {
      throw `Incorrect subrace for unit ${this.key}. Unit has ${traits.length} subraces.`;
    } else if (!traits.length) {
      // this is possible, when in the middle of transition between a trait being removed and then later added.
      return setup.trait.subrace_humankingdom;
    }
    return setup.trait[traits[0]];
  }

  getRace(): Trait {
    // don't use getTraitWithTag because this is used too often in computeTrait

    const subrace = this.getSubrace();
    const main_races = subrace
      .getTags()
      .map((key) => setup.trait[key as TraitKey]) // ???
      .filter((trait) => trait && trait.getTags().includes("race"));
    if (main_races.length != 1)
      throw new Error(`Unknown main race for ${subrace}!`);
    return main_races[0];
  }

  getGender(): Trait {
    return this.getTraitWithTag("gender")!;
  }

  /**
   * Returns the traits that should have been (first case), or traits that should be removed (second)
   * Returns: [ [trait, traitgroup], [null, traitgroup], ... ]
   */
  _getPurifiable(
    trait_tag?: string | null,
  ): Array<[Trait | null, TraitGroup | null]> {
    const candidates = TraitHelper.getAllTraitsOfTags(["skin"]);

    const purifiable: Array<[Trait | null, TraitGroup | null]> = [];

    const has_dick = this.isHasTrait(setup.trait.dick_tiny);

    for (const trait of candidates) {
      // wrong tag = continue
      if (trait_tag && !trait.getTags().includes(trait_tag)) continue;

      // dicks only for units with dicks
      if (trait.getTags().includes("dickshape") && !has_dick) continue;

      if (this.isHasInnateTrait(trait) && !this.isHasRemovableTrait(trait)) {
        // missing innate trait
        purifiable.push([trait, trait.getTraitGroup()!]);
      } else if (
        !this.isHasInnateTrait(trait) &&
        this.isHasRemovableTrait(trait)
      ) {
        // non-innate trait that should be removed
        purifiable.push([null, trait.getTraitGroup()!]);
      }
    }
    return purifiable;
  }

  isCanPurify(trait_tag?: string | null): boolean {
    return this._getPurifiable(trait_tag).length > 0;
  }

  purify(trait_tag?: string | null): void {
    if (this.isSlaver()) {
      State.variables.statistics.add("purifications_slaver", 1);
    } else if (this.isSlave()) {
      State.variables.statistics.add("purifications_slave", 1);
    }

    if (this.getRace() == setup.trait.race_demon) {
      // demons cannot be purified.
      if (this.isYourCompany()) {
        setup.notify(
          `a|Rep a|attempt to be purified but demons cannot be purified, no matter what`,
          { a: this },
        );
      }
      return;
    }
    let candidates = this._getPurifiable(trait_tag);
    if (!candidates.length) {
      if (this.isYourCompany()) {
        setup.notify(`a|Rep a|attempt to be purified but nothing happened`, {
          a: this,
        });
      }
      return;
    }
    let target = setup.rng.choice(candidates);
    this.addTrait(target[0], target[1]);
  }

  /**
   * @param is_return_anyways Whether this function will always return a trait, even though it does not corrupt
   */
  corrupt(
    trait_tag?: string | null,
    is_return_anyways?: boolean,
  ): Trait | null {
    if (!is_return_anyways && !trait_tag) {
      // activate curse of vice
      if (this.isHasTrait(setup.trait.curse_vice1)) {
        this.decreaseTrait(setup.trait.curse_vice1.getTraitGroup()!);
        if (this.isYourCompany()) {
          setup.notify(`a|Reps Curse of Vice amplifies the corruption...`, {
            a: this,
          });
        }
        if (Math.random() < setup.CURSE_VICE_PERMANENT_CORRUPTION_CHANCE) {
          this.corruptPermanently();
        } else {
          UnitTraitsHelper.doCorrupt({ unit: this });
        }
      }
    }

    return UnitTraitsHelper.doCorrupt({
      unit: this,
      trait_tag: trait_tag,
      is_return_anyways: is_return_anyways,
    });
  }

  corruptPermanently(): Trait | null {
    const result = UnitTraitsHelper.doCorrupt({
      unit: this,
      is_ignore_blessing: true,
    });

    if (result) {
      this.makeInnateTrait(result);
      return result;
    } else {
      return null;
    }
  }

  getSpeech(): Speech {
    if (this.is_speech_reset) {
      this.recomputeSpeech();
    }
    return setup.speech[this.speech_key!];
  }

  /** {speechkey: score} */
  getSpeechChances(): ChanceObject<SpeechKey> {
    return Object.fromEntries(
      objectEntries(setup.speech).map(([speechkey, speech]) => {
        return [speechkey as SpeechKey, speech.computeScore(this)];
      }),
    ) as ChanceObject<SpeechKey>;
  }

  // recompute a unit's speech.
  resetSpeech(): void {
    this.is_speech_reset = true;
  }

  recomputeSpeech(): void {
    let scores = this.getSpeechChances();
    let arr = Object.values(scores);
    let maxscore = Math.max(...arr);
    if (this.speech_key && scores[this.speech_key] == maxscore) {
      // keep
      return;
    }
    this.speech_key = null;
    let keys = objectKeys(scores);
    setup.rng.shuffleArray(keys);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      if (scores[key] == maxscore) {
        this.speech_key = key;
        break;
      }
    }
    if (!this.speech_key) throw new Error(`??????`);
    this.is_speech_reset = false;
  }

  isAllowedTalk(): boolean {
    let bedchamber = this.getBedchamber();
    if (
      this.isSlave() &&
      bedchamber &&
      bedchamber.getOption("speech") != "full"
    )
      return false;
    return true;
  }

  isCanTalk(): boolean {
    return this.isAllowedTalk() && this.isCanPhysicallyTalk();
  }

  isAllowedWalk(): boolean {
    let bedchamber = this.getBedchamber();
    if (this.isSlave() && bedchamber && bedchamber.getOption("walk") != "walk")
      return false;
    return true;
  }

  isCanWalk(): boolean {
    return this.isAllowedWalk() && this.isCanPhysicallyWalk();
  }

  isAllowedOrgasm(): boolean {
    let bedchamber = this.getBedchamber();
    if (this.isSlave() && bedchamber && bedchamber.getOption("orgasm") != "yes")
      return false;
    return true;
  }

  isCanOrgasm(): boolean {
    if (!this.isAllowedOrgasm()) return false;
    if (this.isHasTrait(setup.trait.eq_chastity)) return false;
    if (this.isHasDick() && !this.isCanPhysicallyCum()) return false;
    return true;
  }

  isCanPhysicallyTalk(): boolean {
    return !this.isHasTrait(setup.trait.eq_gagged);
  }

  isCanPhysicallyWalk(): boolean {
    return !this.isHasTrait(setup.trait.eq_restrained);
  }

  isCanPhysicallyOrgasm(): boolean {
    return !this.isHasTrait(setup.trait.eq_chastity);
  }

  isCanPhysicallyCum(): boolean {
    return this.isHasDick() && this.isCanPhysicallyOrgasm();
  }

  isCanSee(): boolean {
    return this.isHasTrait(setup.trait.eq_blind);
  }

  isDietCum(): boolean {
    let bedchamber = this.getBedchamber();
    return (
      this.isSlave() && !!bedchamber && bedchamber.getOption("food") == "cum"
    );
  }

  isDietMilk(): boolean {
    let bedchamber = this.getBedchamber();
    return (
      this.isSlave() && !!bedchamber && bedchamber.getOption("food") == "milk"
    );
  }

  getDefaultWeapon(): Equipment {
    const weapons = [
      setup.equipment.weapon_sword,
      setup.equipment.weapon_spear,
      setup.equipment.weapon_axe,
      setup.equipment.weapon_dagger,
      setup.equipment.weapon_staff,
    ];
    return weapons[this.Seed("defaultweapon") % 5];
  }

  /**
   * Is this trait compatible with this unit gender, race, etc? Will also return false if it's a computed trait.
   */
  isTraitCompatible(trait: Trait): boolean {
    if (!trait.isAttachableTo(this)) return false;
    if (trait instanceof setup.Perk) {
      // perk has a special check if the unit has it as a prereq.
      if (!this.getPerkChoices().includes(trait)) return false;
    }
    return true;
  }

  /**
   * Get the inheritable traits from this unit.
   */
  getInheritableTraits(): Trait[] {
    const base_traits = this.getRemovableTraits().filter((trait) => {
      const tags = trait.getTags();
      return (
        tags.includes("physical") ||
        tags.includes("per") ||
        tags.includes("skill")
      );
    });

    const skin_traits = this.getInnateTraits();
    return base_traits.concat(skin_traits);
  }

  getHomeland(): string {
    return setup.Text.Race.region(this.getSubrace());
  }

  getHomeCompany(): Company {
    // special case for outlaws
    if (
      this.isHasAnyTraitExact([
        `bg_boss`,
        `bg_raider`,
        `bg_slaver`,
        `bg_thief`,
        `bg_thug`,
      ])
    ) {
      return State.variables.company.outlaws;
    } else {
      const subrace_trait = this.getSubrace();
      const subrace = Subrace.fromTrait(subrace_trait);
      const company_key = subrace.company_key;
      if (!company_key || !(company_key in State.variables.company)) {
        throw new Error(
          `Missing company key ${company_key} for race ${subrace_trait.getName()}`,
        );
      }

      const company = State.variables.company[company_key];
      return company;
    }
  }

  isFurryBody(): boolean {
    const body = this.getTraitWithTag("body");
    return !!body && body.getTags().includes("furry");
  }

  // #endregion Traits

  // #region TraitCache

  /**
   * Resets unit's cached trait map
   */
  resetTraitMapCache(): void {
    State.variables.cache.clear("unitbasetrait", this.key);
    State.variables.cache.clear("unittrait", this.key);
    State.variables.cache.clear("unitextratrait", this.key);
  }

  /**
   * Get unit's cached trait value. Set it first if it was unset.
   */
  getTraitMapCache(): { [k in TraitKey]?: boolean } {
    return UnitTraitCacheHelper.getTraitMapCacheBackend(
      this,
      "unittrait",
      UnitTraitCacheHelper._computeAllTraits,
    );
  }

  /**
   * Get unit's cached trait value. Set it first if it was unset.
   */
  getExtraTraitMapCache(): { [k in TraitKey]?: boolean } {
    return UnitTraitCacheHelper.getTraitMapCacheBackend(
      this,
      "unitextratrait",
      UnitTraitCacheHelper._computeAllExtraTraits,
    );
  }

  /**
   * Get unit's cached trait value. Set it first if it was unset.
   */
  getBaseTraitMapCache(): { [k in TraitKey]?: boolean } {
    return UnitTraitCacheHelper.getTraitMapCacheBackend(
      this,
      "unitbasetrait",
      UnitTraitCacheHelper._computeAllBaseTraits,
    );
  }

  // #endregion TraitCache

  // #region Skills

  resetSkillCache(): void {
    return UnitSkillsHelper.resetSkillCache(this.key);
  }

  getSkill(skill: Skill): number {
    return this.getSkills()[skill.key];
  }

  getSkills(is_base_only?: boolean): SkillValuesArray {
    return UnitSkillsHelper.getOrCreateCachedValue(
      this,
      is_base_only ? "unitskillsbaseonly" : "unitskills",
      () => UnitSkillsHelper.computeSkills(this, is_base_only),
    );
  }

  getSkillsAdd(is_base_only?: boolean): SkillValuesArray {
    return UnitSkillsHelper.getOrCreateCachedValue(
      this,
      is_base_only ? "unitskilladdsbaseonly" : "unitskilladds",
      () => UnitSkillsHelper.computeSkillsAdd(this, is_base_only),
    );
  }

  getSkillModifiers(is_base_only?: boolean): SkillValuesArray {
    return UnitSkillsHelper.getOrCreateCachedValue(
      this,
      is_base_only ? "unitskillmodifiersbaseonly" : "unitskillmodifiers",
      () => UnitSkillsHelper.computeSkillModifiers(this, is_base_only),
    );
  }

  getSkillsBase(ignore_skill_boost?: boolean): SkillValuesArray {
    return UnitSkillsHelper.getOrCreateCachedValue(
      this,
      ignore_skill_boost ? "unitskillsbaseignoreskillboost" : "unitskillsbase",
      () => UnitSkillsHelper.computeSkillsBase(this, ignore_skill_boost),
    );
  }

  getSkillAdditives(is_base_only?: boolean): SkillValuesArray {
    return UnitSkillsHelper.getOrCreateCachedValue(
      this,
      is_base_only ? "unitskilladditivesbaseonly" : "unitskilladditives",
      () => UnitSkillsHelper.computeSkillAdditives(this, is_base_only),
    );
  }

  getSkillFocuses(is_not_sort?: boolean): Skill[] {
    return UnitSkillsHelper.getSkillFocuses.call(this, is_not_sort);
  }

  setSkillFocus(index: number, skill: Skill): void {
    return UnitSkillsHelper.setSkillFocus.call(this, index, skill);
  }

  increaseSkills(skill_gains: SkillValuesArray): void {
    return UnitSkillsHelper.increaseSkills.call(this, skill_gains);
  }

  getSkillModifiersBreakdown(is_base_only?: boolean): Array<SkillBreakdown[]> {
    return UnitSkillsHelper.getSkillModifiersBreakdown.call(this, is_base_only);
  }

  getSkillsBaseBreakdown(
    ignore_skill_boost?: boolean,
  ): Array<SkillBreakdown[]> {
    return UnitSkillsHelper.getSkillsBaseBreakdown.call(
      this,
      ignore_skill_boost,
    );
  }

  getSkillAdditivesBreakdown(is_base_only?: boolean): Array<SkillBreakdown[]> {
    return UnitSkillsHelper.getSkillAdditivesBreakdown.call(this, is_base_only);
  }

  // #endregion Skills

  // #region History

  addHistory(
    history_text: string,
    context?: { getName?(): string },
    force_add?: boolean,
  ): void {
    if (!force_add && !this.isYourCompany()) return;
    if (!this.history) this.history = [];
    let base = `Week ${State.variables.calendar.getWeek()}: a|Rep ${history_text}`;
    if (context && context.getName) {
      base = `${base} (${context.getName!()})`;
    }
    this.history.unshift(base);

    if (this.history.length > setup.HISTORY_UNIT_MAX) {
      this.history = this.history.slice(0, setup.HISTORY_UNIT_MAX);
    }
    this.resetCache();
  }

  getHistory(): string[] {
    return this.history || [];
  }

  // #endregion History

  // #region Money

  getWage(): number {
    if (this == State.variables.unit.player) return 0;
    const level = this.getLevel();
    let base = Math.floor(9 + level);
    if (State.variables.calendar.getWeek() >= 3) {
      if (State.variables.settings.challengemode == "impossible") {
        base *= 10;
      } else if (State.variables.settings.challengemode == "unfair") {
        base *= 5;
      }
    }
    return base;
  }

  getSlaverMarketValue(): number {
    return Math.max(this.getSlaveValue(), setup.SLAVE_VALUE_MARKET_MINIMUM);
  }

  // #endregion Money

  // #region Image

  getImageInfo(): ImageMetadata | null {
    if (this.custom_image_name) return null;
    return State.variables.unitimage.getImageObject(this).info;
  }

  getCustomImageName(): string {
    return this.custom_image_name;
  }

  getImage(): string {
    let custom_image_name = this.custom_image_name;
    if (custom_image_name) {
      return `img/customunit/${custom_image_name}`;
    }

    return State.variables.unitimage.getImagePath(this);
  }

  // #endregion Image

  // #region Tags

  getTags(): string[] {
    return this.tags;
  }

  addTag(tag: string) {
    this.tags.push(tag);
    this.resetCache();
  }

  removeTag(tag: string) {
    // if (!this.isHasTag(tag)) throw new Error(`Tag ${tag} not found in ${this.getName()}`)
    this.tags = this.tags.filter((item) => item != tag);
    this.resetCache();
  }

  isHasTag(tag: string): boolean {
    return this.getTags().includes(tag);
  }

  // #endregion Tags

  // #region Rep

  busyInfo(
    show_duty_icon?: boolean,
    tooltip?: string,
  ): { icon: string; title: string } {
    let img;
    let title;
    if (this.getQuest()) {
      img = setup.Unit.BUSY_QUEST_URL;
      title = "on a quest";
    } else if (this.getOpportunity()) {
      img = setup.Unit.BUSY_OPPORTUNITY_URL;
      title = "on an opportunity";
    } else if (State.variables.leave.isOnLeave(this)) {
      img = setup.Unit.BUSY_LEAVE_URL;
      title = "on leave";
    } else if (this.isInjured()) {
      img = setup.Unit.BUSY_INJURY_URL;
      title = "injured";
    } else if (!this.isAvailable()) {
      // should not actually happen, but just in case
      img = setup.Unit.BUSY_OTHER_URL;
      title = "unknown";
    } else if (this.getDuty()) {
      title = "on duty";
      if (show_duty_icon) {
        return {
          icon: this.getDuty()!.repIcon(),
          title: title,
        };
      } else {
        img = setup.Unit.BUSY_DUTY_URL;
      }
    } else {
      img = setup.Unit.BUSY_IDLE_URL;
      title = "idle";
    }

    return {
      icon: setup.repImgIcon(img, tooltip),
      title: title,
    };
  }

  repBusyState(show_duty_icon?: boolean): string {
    if (!this.isYourCompany()) return "";
    return this.busyInfo(show_duty_icon, `<<tooltipunitstatus '${this.key}'>>`)
      .icon;
  }

  /** Same as rep, but doesn't include icons (just name + tooltip) */
  repShort(show_actions?: boolean): string {
    let color_class = "";
    if (State.variables.settings.inline_color) {
      if (this.isSlaver()) {
        color_class = ` rep-${this.getJob().key}-${this.isMale() ? "male" : "female"}`;
      } else {
        color_class = ` rep-${this.getJob().key}`;
      }
    }

    if (State.variables.settings.inline_font) {
      color_class += ` text-${this.getSubrace().key}`;
    }

    // only show if either: (0. your unit, 1. in market, 2. contact, 3. retiree, 4. in debug mode)
    if (
      !State.variables.gDebug &&
      !this.isYourCompany() &&
      !this.getMarket() &&
      !this.getContact() &&
      !this.isRetired()
    ) {
      return `<span class="${color_class}">${this.getName()}</span>`;
    } else {
      return (
        `<span data-tooltip="<<tooltipunit '${this.key}'${show_actions ? " true" : ""}>>" data-tooltip-wide>` +
        `<a class="replink${color_class}">${this.getName()}</a>` +
        `</span>`
      );
    }
  }

  /** Same as rep and always include icons */
  repLong(show_actions?: boolean): string {
    const job = this.getJob();

    let text = '<span class="rep">';

    if (job == setup.job.slaver) {
      text += '<div class="icongrid">';
      text += this.repBusyState(/* show duty = */ false);
      const focuses = this.getSkillFocuses(
        State.variables.settings.unsortedskills,
      );
      for (let i = 0; i < focuses.length; ++i) {
        text += focuses[i].rep();
      }
      text += "</div>";
    } else {
      text += this.repBusyState(/* show duty = */ true);
      text += job.rep();
    }

    text += this.repShort(show_actions);

    if (State.variables.hospital.isInjured(this)) {
      text += setup.DOM.toString(setup.DOM.Card.injury(this));
    }

    return text + "</span>";
  }

  rep(): string {
    if (!State.variables.settings.inline_icon) {
      return this.repShort();
    } else {
      return this.repLong();
    }
  }

  repGender(): string {
    if (this.isSissy()) return "sissy";
    return this.getGender().getName();
  }

  /**
   * Bob of Party 3
   */
  repFull(): string {
    let base = `${this.repLong()}`;
    const party = this.getParty();
    if (party) {
      return `${base} of ${party.rep()}`;
    } else {
      return base;
    }
  }

  // #endregion Rep

  //
  // STATICS
  //

  static cmpDefault = Unit_CmpDefault;
  static cmpName = Unit_CmpName;
  static cmpJob = Unit_CmpJob;

  static getConflictingPerTraits = Unit_getConflictingPerTraits;
  static getAnyConflictingPerTraits = Unit_getAnyConflictingPerTraits;
  static getSamePerTraits = Unit_getSamePerTraits;
  static getAnySamePerTraits = Unit_getAnySamePerTraits;
  static autoAssignPerks = Unit_autoAssignPerks;

  static BUSY_QUEST_URL = "img/special/busy_quest.svg";
  static BUSY_OPPORTUNITY_URL = "img/special/busy_opportunity.svg";
  static BUSY_LEAVE_URL = "img/special/busy_leave.svg";
  static BUSY_INJURY_URL = "img/special/busy_injury.svg";
  static BUSY_DUTY_URL = "img/special/busy_duty.svg";
  static BUSY_OTHER_URL = "img/special/busy_other.svg";
  static BUSY_IDLE_URL = "img/special/busy_idle.svg";

  static DANGER_IMAGE_URL = "img/special/danger.svg";
  static LOVERS_IMAGE_URL = "img/special/lovers.svg";
  static INJURY_IMAGE_URL = "img/other/injury.svg";
}
