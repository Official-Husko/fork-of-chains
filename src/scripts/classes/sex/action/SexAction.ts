import { TwineClassCustom } from "../../_TwineClass";
import Building from "../../restriction/Building";
import HasAnyItemAnywhere from "../../restriction/HasAnyItemAnywhere";
import HasItem from "../../restriction/HasItem";
import QuestDone from "../../restriction/questconditions/QuestDone";
import type { Unit, UnitKey } from "../../unit/Unit";
import type { SexInstance } from "../engine/SexInstance";
import { SexConstants } from "../SexConstants";

export type SexActionKey = BrandedType<string, "SexActionKey">;

/**
 * An option to take during a SexScene.
 *
 * Can cover text actions, or even simple things like pose change, equipment removal, etc.
 *
 * Only the first unit can initiate the action.
 */
export abstract class SexAction extends TwineClassCustom {
  unit_keys: UnitKey[];

  /**
   * Create a sex action. While it can always be created, might not always be available.
   * Check isOk() for that. Order matters.
   */
  protected constructor(units: Unit[], sex: SexInstance) {
    super();

    const actor_descriptions = this.getActorDescriptions();
    if (actor_descriptions.length != units.length) {
      throw new Error(`Incorrect number of units for sex action`);
    }
    this.unit_keys = units.map((unit) => unit.key);
    if (this.unit_keys.length > SexAction.ACTOR_NAMES.length) {
      throw new Error(`Too many actors in SexAction!`);
    }
  }

  override getContainer(): string {
    return `setup.SexActionClass`;
  }

  /* =============================
      DEFINITIONS
  ============================= */

  /**
   * Get actor descriptions associated with this sex action
   */
  getActorDescriptions(): SexActorDescription[] {
    return [];
  }

  /**
   * Get tags associated with this sex action
   */
  getTags(): string[] {
    return [];
  }

  /**
   * Get additional restrictions with this sex actions
   */

  getRestrictions(): Restriction<SexAction>[] {
    return [];
  }

  /**
   * Get additional outcomes with this sex actions
   */
  getOutcomes(): Cost[] {
    return [];
  }

  /**
   * Arousal multiplied by this
   */
  getArousalMultiplier(
    actor_name: string,
    unit: Unit,
    sex: SexInstance,
  ): number {
    return 1.0;
  }

  /**
   * Discomfort multiplied by this
   */
  getDiscomfortMultiplier(
    actor_name: string,
    unit: Unit,
    sex: SexInstance,
  ): number {
    return 1.0;
  }

  /**
   * Energy multiplied by this
   */
  getEnergyMultiplier(
    actor_name: string,
    unit: Unit,
    sex: SexInstance,
  ): number {
    return 1.0;
  }

  /* =============================
      GETTERS
  ============================= */

  /**
   * Ordered list of units in this action
   */
  getUnits(): Unit[] {
    return this.unit_keys.map((key) => State.variables.unit[key]);
  }

  getUnitCount(): number {
    return this.unit_keys.length;
  }

  getActorName(unit: Unit): string {
    return SexAction.ACTOR_NAMES[this.getUnits().indexOf(unit)];
  }

  getActorDescription(unit: Unit, sex: SexInstance): SexActorDescription {
    const index = this.getUnits().indexOf(unit);
    return this.getActorDescriptions()[index];
  }

  getActorUnit(actor_name: string): Unit {
    for (let i = 0; i < SexAction.ACTOR_NAMES.length; ++i) {
      if (actor_name == SexAction.ACTOR_NAMES[i]) {
        return this.getUnits()[i];
      }
    }
    throw new Error(`Missing actor ${actor_name} in SexAction!`);
  }

  /**
   * {actor_name: unit}
   */
  getActorObj(): ActorUnitMap {
    const res: ActorUnitMap = {};

    const units = this.getUnits();
    for (let i = 0; i < units.length; ++i) {
      res[setup.SexAction.ACTOR_NAMES[i]] = units[i];
    }

    return res;
  }

  /* =============================
      LOGIC
  ============================= */

  /**
   * Whether this action is allowed to take place.
   */
  isAllowed(sex: SexInstance): boolean {
    // check all restrictions
    if (
      !setup.RestrictionLib.isPrerequisitesSatisfied(
        this,
        this.getRestrictions(),
      )
    )
      return false;

    // check actor restrictions
    const units = this.getUnits();
    for (const unit of units) {
      const description = this.getActorDescription(unit, sex);
      if (
        !setup.RestrictionLib.isUnitSatisfy(
          unit,
          description.restrictions || [],
        )
      )
        return false;
    }

    // check disabled
    if (State.variables.settings.isSexActionDisabled(this)) {
      return false;
    }
    return true;
  }

  /**
   * Whether the AI is allowed to pick this action.
   */
  isAIAllowed(main_unit: Unit, sex: SexInstance): boolean {
    for (const unit of this.getUnits()) {
      const paces = this.getActorDescription(unit, sex).paces;
      const pace = sex.getPace(unit);
      if (!paces.includes(pace)) return false;
    }

    // check permission
    const permission = sex.getPermission(main_unit);
    if (!permission.isActionAllowed(this, sex)) return false;

    // everything looks ok
    return true;
  }

  /**
   * How much arousal does this unit gain from this sex action?
   */
  getArousalBase(unit: Unit, sex: SexInstance): number {
    return this.getActorDescription(unit, sex).arousal ?? 0;
  }

  /**
   * How much arousal does this unit gain from this sex action?
   */
  getArousal(unit: Unit, sex: SexInstance): number {
    const description = this.getActorDescription(unit, sex);
    let base = this.getArousalBase(unit, sex);
    base *= this.getArousalMultiplier(this.getActorName(unit), unit, sex);

    // factors in energy and discomfort
    if (base > 0) {
      const multi = sex.getEnergy(unit) / SexConstants.ENERGY_MAX;
      const depleted_multi = SexConstants.ENERGY_DEPLETED_AROUSAL_MULTIPLIER;

      base = (depleted_multi + (1.0 - depleted_multi) * multi) * base;

      // if you're a masochist, gain discomfort as arousal
      if (unit.isMasochistic()) {
        base +=
          this.getDiscomfort(unit, sex) *
          SexConstants.DISCOMFORT_MASOCHIST_AROUSAL_MULTIPLIER;
      }
    }

    return Math.round(base);
  }

  /**
   * How much discomfort does this unit gain from this sex action?
   */
  getDiscomfortBase(unit: Unit, sex: SexInstance): number {
    return this.getActorDescription(unit, sex).discomfort ?? 0;
  }

  /**
   * How much discomfort does this unit gain from this sex action?
   */
  getDiscomfort(unit: Unit, sex: SexInstance): number {
    const description = this.getActorDescription(unit, sex);
    let base = this.getDiscomfortBase(unit, sex);
    base *= this.getDiscomfortMultiplier(this.getActorName(unit), unit, sex);

    if (base > 0) {
      // tough gets discomfort reduction. nimble gets discomfort increase.
      if (unit.isHasTrait("tough_tough")) {
        base *= SexConstants.DISCOMFORT_TOUGH_MULTIPLIER;
      } else if (unit.isHasTrait("tough_nimble")) {
        base *= SexConstants.DISCOMFORT_NIMBLE_MULTIPLIER;
      }
    }

    return Math.round(base);
  }

  /**
   * How much energy does this unit "gain" from this sex action?
   * (negative = lose)
   */
  getEnergy(unit: Unit, sex: SexInstance): number {
    const description = this.getActorDescription(unit, sex);
    let base = this.getActorDescription(unit, sex).energy ?? 0;
    base *= this.getEnergyMultiplier(this.getActorName(unit), unit, sex);

    return Math.round(base);
  }

  /**
   * Apply effects of this action. This should be called after .describe()
   */
  applyOutcomes(sex: SexInstance) {
    setup.RestrictionLib.applyAll(this.getOutcomes(), this);
    const units = this.getUnits();
    for (const unit of units) {
      const arousal = this.getArousal(unit, sex);
      if (arousal) sex.adjustArousal(unit, arousal);

      const discomfort = this.getDiscomfort(unit, sex);
      if (discomfort) sex.adjustDiscomfort(unit, discomfort);

      const energy = this.getEnergy(unit, sex);
      if (energy) sex.adjustEnergy(unit, energy);
    }
  }

  /**
   * Whether this action should be visible in the classroom
   */
  isVisibleInClassroom(): boolean {
    const desc = this.desc();
    if (!desc) return false;

    // should be visible if item, building, and questdone requirements are ok
    const restrictions = this.getRestrictions();
    for (const restriction of restrictions) {
      if (
        restriction instanceof HasItem ||
        restriction instanceof Building ||
        restriction instanceof HasAnyItemAnywhere ||
        restriction instanceof QuestDone
      ) {
        if (!restriction.isOk()) return false;
      }
    }

    return true;
  }

  /* =============================
      TEXTS
  ============================= */

  /**
   * Classroom description. Leave blank to hide from classroom.
   */
  desc(): string {
    return "";
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   */
  rawTitle(sex: SexInstance): string {
    return "";
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   */
  rawDescription(sex: SexInstance): string {
    return "";
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   */
  rawStory(sex: SexInstance): string | string[] {
    return "";
  }

  /**
   * Returns the parsed string from this raw title.
   */
  title(sex: SexInstance): string {
    return setup.Text.replaceUnitMacros(this.rawTitle(sex), this.getActorObj());
  }

  /**
   * Returns the parsed string from this raw description.
   */
  description(sex: SexInstance): string {
    return setup.Text.replaceUnitMacros(
      this.rawDescription(sex),
      this.getActorObj(),
    );
  }

  /**
   * Returns the parsed string from this raw story.
   */
  story(sex: SexInstance): DOM.Attachable {
    return setup.SexUtil.convert(this.rawStory(sex), this.getActorObj(), sex);
  }

  /* =============================
      STATIC
  ============================= */

  static ACTOR_NAMES = ["a", "b", "c"] as const;
}
