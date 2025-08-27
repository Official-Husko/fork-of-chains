import { TwineClass } from "../_TwineClass";
import type { Unit, UnitKey } from "../unit/Unit";
import type { DutyTemplate, DutyTemplateKey } from "./DutyTemplate";

export type DutyInstanceKey = BrandedType<number, "DutyInstanceKey">;

/**
 * An instance of a duty. Sometimes, this class is overridden to provide for a more complex behavior.
 */
export class DutyInstance extends TwineClass {
  key: DutyInstanceKey;
  template_key: DutyTemplateKey;

  unit_key: UnitKey | undefined = undefined;

  /** Whether unit on this duty can still go on quests. */
  is_can_go_on_quests_auto?: true;

  /**
   * Whether this duty remains active when unit is not available, at an upkeep.
   * Only for slaver duties.
   */
  is_specialist_enabled?: true;

  constructor({ duty_template }: { duty_template: DutyTemplate }) {
    super();

    this.key = State.variables.Duty_keygen++ as DutyInstanceKey;
    this.template_key = duty_template.key;

    if (this.key in State.variables.duty) {
      throw new Error(`Duplicate ${this.key} in duties`);
    }
    State.variables.duty[this.key] = this;
  }

  resetCache(unit: Unit) {
    unit.resetCache();
    if (this.template_key === "viceleader") {
      State.variables.unit.player.resetCache();
    } else if (this instanceof setup.DutyInstanceBedchamberSlave) {
      this.getBedchamber().getSlaver().resetCache();
    }
  }

  getName(): string {
    return this.getTemplate().getName();
  }

  delete() {
    delete State.variables.duty[this.key];
  }

  getTemplate(): DutyTemplate {
    return setup.dutytemplate[this.template_key];
  }

  isSpecialistEnabled(): boolean {
    return !!this.is_specialist_enabled;
  }

  toggleIsSpecialistEnabled() {
    if (!this.getTemplate().isCanReplaceWithSpecialist())
      throw new Error(
        `Duty ${this.getTemplate().key} cannot be replaced with specialists`,
      );
    this.is_specialist_enabled = !this.is_specialist_enabled || undefined;
  }

  isCanGoOnQuestsAuto(): boolean {
    return !!this.is_can_go_on_quests_auto;
  }

  toggleIsCanGoOnQuestsAuto() {
    this.is_can_go_on_quests_auto = !this.is_can_go_on_quests_auto || undefined;
  }

  getImageRep(skip_tooltip?: boolean, big?: boolean): string {
    const template = this.getTemplate();
    const tooltip_content = skip_tooltip
      ? undefined
      : `<<dutycard '${this.key}'>>`;
    return (
      '<span class="' +
      template.getCssClass() +
      (big ? " big" : "") +
      '">' +
      setup.repImg({
        imagepath: template.getImage(),
        tooltip_content: tooltip_content,
      }) +
      "</span>"
    );
  }

  getRepMacro() {
    return "dutycard";
  }

  rep(): string {
    return (
      setup.repMessage(this, undefined, undefined, this.getImageRep(true)) +
      "&nbsp;" +
      setup.repMessage(this)
    );
  }

  repIcon(): string {
    return setup.repMessage(this, undefined, undefined, this.getImageRep());
  }

  /**
   * Compute chance for non-prestige duties, compute prestige otherwise.
   */
  computeChance(): number {
    if (!this.isActive()) return 0;
    return this.getTemplate().computeChanceForUnit(this.getAssignedUnit()!);
  }

  getProc(): "none" | "proc" | "crit" {
    let chance = this.computeChance();
    if (Math.random() < chance - 1.0) return "crit";
    if (Math.random() < chance) return "proc";
    return "none";
  }

  /**
   * Returns the unit assigned to this duty.
   */
  getAssignedUnit(): Unit | null {
    if (!this.unit_key) return null;
    return State.variables.unit[this.unit_key];
  }

  /**
   * Returns the unit assigned to this duty, but only if the unit is available.
   * If you want the unit regardless, use getAssignedUnit
   */
  getUnitIfAvailable(): Unit | null {
    if (!this.isActive() || this.isSpecialistActive()) return null;
    return this.getAssignedUnit();
  }

  /**
   * Whether this duty is active or not
   */
  isActive(): boolean {
    const unit = this.getAssignedUnit();

    // nobody assigned
    if (!unit) return false;

    // assigned, but unit is busy, and no temproary replacement unit
    if (!unit.isAvailable() && !this.isSpecialistActive()) return false;

    return true;
  }

  /**
   * Whether contract specialist is replacing the unit this week.
   */
  isSpecialistActive(): boolean {
    const unit = this.getAssignedUnit();
    if (!unit) return false;
    if (!this.isSpecialistEnabled()) return false;
    return !unit.isAvailable();
  }

  getSpecialistUpkeep(): number {
    const unit = this.getAssignedUnit();
    let upkeep = setup.DUTY_SPECIALIST_WEEKLY_UPKEEP;
    if (unit && unit.isHasTrait("perk_specialist")) {
      upkeep = Math.round((1.0 - setup.PERK_SPECIALIST_REDUCTION) * upkeep);
    }
    return upkeep;
  }

  isCanUnitAssign(unit: Unit): boolean {
    if (!unit.isAvailable()) return false;
    if (unit.getDuty()) return false;
    return setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(
      unit,
      this.getTemplate().getUnitRestrictions(),
    );
  }

  assignUnit(unit: Unit) {
    if (this.unit_key) {
      throw new Error(
        `Duty ${this.key} already have unit and cannot be reassigned`,
      );
    }

    this.unit_key = unit.key;
    unit.duty_key = this.key;

    this.getTemplate().onAssign(this, unit);

    this.resetCache(unit);
  }

  unassignUnit() {
    const unit = this.getAssignedUnit();
    if (unit) {
      this.getTemplate().onUnassign(this, unit);

      this.unit_key = undefined;
      unit.duty_key = undefined;

      this.resetCache(unit);
    }
  }

  advanceWeek() {
    this.getTemplate().advanceWeek(this);
  }

  /**
   * returns: 'your marketer xxx', or 'xxx's replacement as marketer'
   */
  repYourDutyRep(): string {
    const unit = this.getAssignedUnit();
    if (!unit) {
      throw new Error(`No unit on duty ${this.getName()}`);
    }

    const rep = this.rep();
    let t;
    if (this.isSpecialistActive()) {
      t = [
        `the specialist substituting a|rep as your ${rep}`,
        `a|reps temporary replacement as your ${rep}`,
        `the specialist working as a temporary replacement for your ${rep} a|rep`,
      ];
    } else {
      t = [`your ${rep} a|rep`];
    }
    return setup.Text.replaceUnitMacros(t, { a: unit });
  }

  /**
   * Default sort for duties
   */
  static cmp(duty1: DutyInstance, duty2: DutyInstance) {
    const type1 = duty1.getTemplate().getType();
    const type2 = duty2.getTemplate().getType();
    if (type1 == type2) {
      return duty1.getName().localeCompare(duty2.getName());
    }

    const types = Object.keys(setup.DutyTemplate.TYPE);
    return types.indexOf(type1) - types.indexOf(type2);
  }

  static DutyChanceCmpGen(types: string[], reverse: boolean) {
    return (duty1: DutyInstance, duty2: DutyInstance) => {
      const type1 = duty1.getTemplate().getType();
      const type2 = duty2.getTemplate().getType();
      const ch1 = types.includes(type1)
        ? duty1.computeChance()
        : reverse
          ? -1
          : setup.INFINITY;
      const ch2 = types.includes(type2)
        ? duty2.computeChance()
        : reverse
          ? -1
          : setup.INFINITY;
      if (reverse) {
        return ch2 - ch1;
      } else {
        return ch1 - ch2;
      }
    };
  }
}
