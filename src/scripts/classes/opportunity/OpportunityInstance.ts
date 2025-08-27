import { TwineClass } from "../_TwineClass";
import type { Unit } from "../unit/Unit";
import type {
  OpportunityOption,
  OpportunityTemplate,
  OpportunityTemplateKey,
} from "./OpportunityTemplate";

export type OpportunityInstanceKey = BrandedType<
  number,
  "OpportunityInstanceKey"
>;

export class OpportunityInstance extends TwineClass {
  key: OpportunityInstanceKey;
  opportunity_template_key: OpportunityTemplateKey;

  actor_unit_key_map: ActorUnitKeyMap = {};
  option_number_selected?: number;
  weeks_until_expired: number;
  seed?: number;

  constructor(
    opportunity_template: OpportunityTemplate,
    actor_units: ActorUnitMap,
  ) {
    super();

    this.key = State.variables
      .OpportunityInstance_keygen++ as OpportunityInstanceKey;

    this.opportunity_template_key = opportunity_template.key;

    for (let actor_key in actor_units) {
      let unit = actor_units[actor_key];
      if (unit.quest_key) {
        throw new Error(`unit is busy on another quest`);
      }
      if (unit.opportunity_key) {
        throw new Error(`unit is busy on another opportunity`);
      }
      this.actor_unit_key_map[actor_key] = unit.key;
      unit.opportunity_key = this.key;

      unit.setDebugInfo(opportunity_template);
    }

    this.weeks_until_expired = opportunity_template.getDeadlineWeeks();

    if (this.key in State.variables.opportunityinstance)
      throw new Error(`Opportunity ${this.key} already exists`);
    State.variables.opportunityinstance[this.key] = this;
  }

  delete() {
    delete State.variables.opportunityinstance[this.key];
  }

  getRepMacro() {
    return "opportunitycard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  cleanup() {
    // remove all associations of this opportunity with units

    // unassign remaining actors
    let actor_objs = this.getActorObj();
    for (const unit of Object.values(actor_objs)) {
      unit.opportunity_key = undefined;
      unit.checkDelete();
    }
  }

  getWeeksUntilExpired(): number {
    return this.weeks_until_expired;
  }

  isExpired() {
    if (this.getTemplate().isMustBeAnswered()) return false;
    return this.getWeeksUntilExpired() == 0;
  }

  expire() {
    this.cleanup();

    let outcomes = this.getTemplate().getExpiredOutcomes();
    setup.RestrictionLib.applyAll(outcomes, this);

    State.variables.opportunitylist.removeOpportunity(this);
  }

  advanceWeek() {
    this.weeks_until_expired -= 1;
  }

  getName(): string {
    return this.getTemplate().getName();
  }

  getTemplate(): OpportunityTemplate {
    return setup.opportunitytemplate[this.opportunity_template_key];
  }

  getOptions(): OpportunityOption[] {
    return this.getTemplate().getOptions();
  }

  isCanSelectOption(option_number: number): boolean {
    let option = this.getOptions()[option_number];
    if (!option) throw new Error(`Wrong option number ${option_number}`);

    const costs = option.costs;
    const prereq = option.restrictions;
    const vis_prereq = option.visibility_restrictions;

    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, costs))
      return false;
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, prereq))
      return false;
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, vis_prereq))
      return false;

    return true;
  }

  finalize() {
    // returns the passage that should be run. Note: the passage may be NULL, if nothing to be done.
    const option = this.getOptions()[this.option_number_selected!];
    if (!option) throw new Error(`Option not yet selected`);

    this.cleanup();

    let costs = option.costs;
    let outcomes = option.outcomes;
    setup.RestrictionLib.applyAll(costs, this);
    setup.RestrictionLib.applyAll(outcomes, this);
    State.variables.opportunitylist.removeOpportunity(this);

    State.variables.statistics.add("opportunity_answered", 1);
  }

  selectOption(option_number: number) {
    if (typeof this.option_number_selected == "number") {
      throw new Error(`Option already selected in this opportunity`);
    }

    const option = this.getOptions()[option_number];
    if (!option) throw new Error(`Wrong option number ${option_number}`);

    this.option_number_selected = option_number;
  }

  getSelectedOptionPassage(): string | null {
    const option = this.getOptions()[this.option_number_selected!];
    if (!option) throw new Error(`Option not yet selected`);

    return option.outcome_passage;
  }

  /**
   * @returns like [['actor1', unit], ['actor2', unit], ...]
   */
  getActorsList(): Array<[actorname: string, unit: Unit]> {
    const result: Array<[actorname: string, unit: Unit]> = [];
    for (let actor_key in this.actor_unit_key_map) {
      let unit = State.variables.unit[this.actor_unit_key_map[actor_key]];
      result.push([actor_key, unit]);
    }
    return result;
  }

  /** Returns object where object.actorname = unit, if any. */
  getActorObj(): ActorUnitMap {
    return Object.fromEntries(this.getActorsList()) as ActorUnitMap;
  }

  getActorUnit(actor_name: string): Unit {
    return State.variables.unit[this.actor_unit_key_map[actor_name]];
  }

  getSeed(): number {
    if (this.seed) return this.seed;
    this.seed = 1 + Math.floor(Math.random() * 999999997);
    return this.seed;
  }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList());
  }
}
