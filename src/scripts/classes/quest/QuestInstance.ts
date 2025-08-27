import { TwineClass } from "../_TwineClass";
import type { Team, TeamKey } from "../Team";
import type { Unit, UnitKey } from "../unit/Unit";
import type {
  QuestOutcome,
  QuestOutcomeData,
  QuestOutcomeValues,
  QuestTemplate,
  QuestTemplateKey,
  QuestUnitCriteria,
} from "./QuestTemplate";

export type QuestInstanceKey = BrandedType<number, "QuestInstanceKey">;

export class QuestInstance extends TwineClass {
  key: QuestInstanceKey;
  quest_template_key: QuestTemplateKey;
  actor_unit_key_map: { [actorname: string]: UnitKey } = {};
  team_key?: TeamKey;
  weeks_until_expired: number;
  elapsed_week: number = 0;
  outcome?: QuestOutcome;
  is_team_forced_assigned?: true;
  seed?: number;

  /**
   * score object is cached at the end of week 1.
   * This is so that units that lose their boons will still
   * make use of them when calculating the chances.
   */
  cached_score_obj: QuestOutcomeValues | null = null;

  constructor(quest_template: QuestTemplate, actor_units: ActorUnitMap) {
    super();

    this.key = State.variables.QuestInstance_keygen++ as QuestInstanceKey;

    this.quest_template_key = quest_template.key;

    for (let actor_key in actor_units) {
      let unit = actor_units[actor_key];
      if (unit.quest_key) throw new Error(`unit is busy on another quest`);
      if (unit.opportunity_key)
        throw new Error(`unit is busy on another opportunity`);
      this.actor_unit_key_map[actor_key] = unit.key;
      unit.quest_key = this.key;

      unit.setDebugInfo(quest_template);
    }

    this.weeks_until_expired = quest_template.getDeadlineWeeks();

    if (this.key in State.variables.questinstance)
      throw new Error(`Quest Instance ${this.key} already exists`);
    State.variables.questinstance[this.key] = this;
  }

  delete() {
    delete State.variables.questinstance[this.key];
  }

  getRepMacro() {
    return "questcard";
  }

  rep() {
    return setup.repMessage(this);
  }

  isDismissable() {
    if (this.team_key) return false;
    if (!State.variables.company.player.getQuests().includes(this))
      return false;
    if (this.getTemplate().getDeadlineWeeks() == setup.INFINITY) return false;
    return true;
  }

  getWeeksUntilExpired() {
    return this.weeks_until_expired;
  }

  isExpired() {
    if (this.getTemplate().getDeadlineWeeks() == setup.INFINITY) return false;
    return this.getWeeksUntilExpired() <= 0;
  }

  cleanup(dont_disband?: boolean) {
    // remove all associations of this quest with units

    // unassign teams
    if (this.team_key) {
      let team = State.variables.team[this.team_key];
      team.removeQuest(this);
      if (dont_disband) {
        team.unsetUnits();
      } else {
        team.disband();
      }
    }

    // unassign remaining actors
    let actor_objs = this.getActorObj();
    for (let actorname in actor_objs) {
      actor_objs[actorname].quest_key = undefined;
      actor_objs[actorname].checkDelete();
    }
  }

  expire() {
    this.cleanup();

    let outcomes = this.getTemplate().getExpiredOutcomes();
    setup.RestrictionLib.applyAll(outcomes, this);

    State.variables.company.player.archiveQuest(this);
  }

  rollOutcome() {
    if (!this.isFinished())
      throw new Error(`Quest not yet ready to be finished`);
    if (this.isFinalized()) throw new Error(`Quest already finalized`);
    if (this.outcome) throw new Error(`Outcome already rolled`);

    let score_obj = this.getScoreObj();

    this.outcome = setup.QuestDifficulty.rollOutcome(score_obj) || undefined;

    if (this.outcome == "disaster") {
      // Reroll with blessing of luck.
      const stacks_required = this.getTemplate()
        .getDifficulty()
        .getBlessingOfLuckStacks();
      const trait_required =
        setup.trait[`blessing_luck${stacks_required}` as TraitKey];

      const luckers = this.getTeam()!
        .getUnits()
        .filter((unit) => unit.isHasTrait(trait_required));
      if (luckers.length) {
        const lucker = setup.rng.choice(luckers);
        setup.notify(
          `a|Reps Blessing of Luck may have prevented a disastrous outcome...`,
          { a: lucker },
        );
        for (let i = 0; i < stacks_required; ++i) {
          lucker.decreaseTrait(trait_required.getTraitGroup()!);
        }

        // reroll
        this.outcome =
          setup.QuestDifficulty.rollOutcome(score_obj) || undefined;
      }
    }

    // adjust result with curse of crow
    if (
      this.outcome == "crit" &&
      score_obj.crit <= setup.CURSE_CROW_MAX_CRIT_CHANCE
    ) {
      const cursed = this.getTeam()!
        .getUnits()
        .filter((unit) => unit.isHasTrait(setup.trait.curse_crow1));
      if (cursed.length) {
        const target = setup.rng.choice(cursed);
        setup.notify(
          `a|Reps Curse of Crow prevented a critical success outcome...`,
          { a: target },
        );
        target.decreaseTrait(setup.trait.curse_crow1.getTraitGroup()!);
        this.outcome = "success";
      }
    }
  }

  getOutcome(): QuestOutcome | undefined {
    return this.outcome;
  }

  getOutcomeObject(): QuestOutcomeData {
    let quest_template = this.getTemplate();
    let outcomes = quest_template.getOutcomes();

    if (!this.outcome) throw new Error(`Outcome has not been rolled`);
    let outcome: QuestOutcomeData;
    if (this.outcome == "crit") {
      outcome = outcomes[0];
    } else if (this.outcome == "success") {
      outcome = outcomes[1];
    } else if (this.outcome == "failure") {
      outcome = outcomes[2];
    } else if (this.outcome == "disaster") {
      outcome = outcomes[3];
    } else {
      throw new Error(`Weird outcome ${this.outcome}`);
    }
    return outcome;
  }

  finalize() {
    // if (!this.isFinished()) throw new Error(`Quest not yet ready to be finished`)
    if (!this.outcome) throw new Error(`Outcome has not been rolled`);

    // cleanup first so that the units from persistent group are "freed" and can be used to generate new quests.
    this.cleanup(/* dont disband = */ true);

    // compute base money for insurer. Done before applying the below
    const insurer_base = setup.qcImpl.MoneyNormal.computeBaseMoney(this);
    const scavenger_base =
      ((1.0 * insurer_base) /
        setup.qdiff["normal40" as QuestDifficultyKey].getMoney()) *
      setup.PERK_SCAVENGER_GOLD_PER_WEEK;

    // get scavenger money
    for (const unit of this.getTeam()!.getUnits()) {
      if (unit && unit.isHasTrait("perk_scavenger")) {
        setup.qc.Money(Math.round(scavenger_base)).apply();
      }
    }

    // process outcomes
    let outcomes = this.getOutcomeObject()[1];
    outcomes.forEach((outcome) => {
      outcome.apply(this);
    });

    // disband team if any
    let team = this.getTeam();
    if (team) team.disband();

    State.variables.company.player.archiveQuest(this);

    // If it's a failure, insurer will give you money
    if (this.outcome === "failure" || this.outcome === "disaster") {
      let insurer = State.variables.dutylist.getDuty("insurer");
      if (insurer) {
        let proc = insurer.getProc();
        if (proc == "proc" || proc == "crit") {
          const multi = setup.INSURER_MULTIS[this.outcome][proc];
          const base = Math.round(multi * insurer_base);

          setup.notify(
            `${setup.capitalize(insurer.repYourDutyRep())} produced some money to cushion the quest failure.`,
          );
          State.variables.company.player.addMoneyNudged(base);
        }
      }
    }

    State.variables.statistics.add(`quest_${this.outcome}`, 1);
    State.variables.statistics.setMax(
      "quest_max_took_level",
      this.getTemplate().getDifficulty().getLevel(),
    );
    if (this.getTemplate().getTags().includes("veteran")) {
      State.variables.statistics.add(`quest_done_veteran`, 1);
    }
    State.variables.statistics.setQuestResult(this.getTemplate(), this.outcome);
  }

  isFinished(): boolean {
    return this.getRemainingWeeks() <= 0;
  }

  isFinalized(): boolean {
    return !!this.outcome;
  }

  advanceQuestOneWeek() {
    // advance both quest with team and unpicked quest by one week.
    if (this.getTeam()) {
      this.elapsed_week += 1;
      // store score object
      if (!this.cached_score_obj) {
        this.cached_score_obj = this.getScoreObj();
      }
    } else {
      this.weeks_until_expired -= 1;
    }
  }

  getElapsedWeeks(): number {
    return this.elapsed_week;
  }

  getRemainingWeeks(): number {
    return this.getTemplate().getWeeks() - this.getElapsedWeeks();
  }

  getName(): string {
    return this.getTemplate().getName();
  }

  getDescriptionPassage(): string {
    return this.getTemplate().getDescriptionPassage();
  }

  getTeam(): Team | null {
    if (!this.team_key) return null;
    return State.variables.team[this.team_key];
  }

  getTemplate(): QuestTemplate {
    return setup.questtemplate[this.quest_template_key];
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

  // get actors which are not part of the team (e.g. trainee)
  // Output: { 'actor_name': unit }
  getExtraActors(): ActorUnitMap {
    const res: ActorUnitMap = {};
    for (const actor_key in this.getTemplate().getActorUnitGroups()) {
      let unit = this.getActorUnit(actor_key);
      if (unit.isYourCompany()) res[actor_key] = unit;
    }
    return res;
  }

  swapActors(actorname1: string, actorname2: string) {
    if (!(actorname1 in this.actor_unit_key_map))
      throw new Error(`unknown actor 1 ${actorname1}`);
    if (!(actorname2 in this.actor_unit_key_map))
      throw new Error(`unknown actor 2 ${actorname2}`);
    let ac1 = this.actor_unit_key_map[actorname1];
    let ac2 = this.actor_unit_key_map[actorname2];
    this.actor_unit_key_map[actorname1] = ac2;
    this.actor_unit_key_map[actorname2] = ac1;
  }

  replaceActor(actorname: string, new_unit: Unit) {
    if (!(actorname in this.actor_unit_key_map))
      throw new Error(`unknown actor ${actorname}`);
    if (new_unit.quest_key != this.key)
      throw new Error(
        `unit ${new_unit.key} already in quest ${new_unit.quest_key}`,
      );
    this.actor_unit_key_map[actorname] = new_unit.key;
  }

  isUnitInQuest(unit: Unit): boolean {
    for (let actorname in this.actor_unit_key_map) {
      if (this.actor_unit_key_map[actorname] == unit.key) return true;
    }
    return false;
  }

  getUnitCriteriasList(): Array<[string, QuestUnitCriteria, Unit | null]> {
    // return [[actor_name, {criteria: unitcriteria, offsetmod: offsetmod}, unit (if any)]]
    let quest_template = this.getTemplate();

    let result: Array<[string, QuestUnitCriteria, Unit | null]> = [];
    let criterias = quest_template.getUnitCriterias();
    for (let criteria_key in criterias) {
      let criteria = criterias[criteria_key];
      let unit = null;
      if (criteria_key in this.actor_unit_key_map) {
        unit = State.variables.unit[this.actor_unit_key_map[criteria_key]];
      }
      result.push([criteria_key, criteria, unit]);
    }
    return result;
  }

  /**
   * @returns object where object.actorname = unit, if any.
   */
  getActorObj(): ActorUnitMap {
    return Object.fromEntries(this.getActorsList()) as ActorUnitMap;
  }

  getActorUnit(actor_name: string): Unit {
    return State.variables.unit[this.actor_unit_key_map[actor_name]];
  }

  isCostsSatisfied(): boolean {
    let quest_template = this.getTemplate();

    let costs = quest_template.getCosts();
    for (let i = 0; i < costs.length; ++i) {
      let cost = costs[i];
      if (!cost.isOk(this)) return false;
    }
    return true;
  }

  getScoreObj(): QuestOutcomeValues {
    if (this.cached_score_obj) {
      return this.cached_score_obj;
    }
    let quest_template = this.getTemplate();
    let criterias = quest_template.getUnitCriterias();
    let score = setup.QuestDifficulty.computeSuccessObj(
      quest_template.getDifficulty(),
      criterias,
      this.getActorObj(),
    );
    return score;
  }

  _assignTeamWithAssignment(
    team: Team,
    assignment: ActorUnitMap,
    is_skip_costs?: boolean,
  ) {
    team.setQuest(this);
    this.team_key = team.key;
    this.elapsed_week = 0;

    let criterias = this.getTemplate().getUnitCriterias();
    for (const [actorname, criteria] of objectEntries(criterias)) {
      if (!(actorname in assignment))
        throw new Error(`missing ${actorname} in assignment`);
      let unit = assignment[actorname];
      if (actorname in this.actor_unit_key_map)
        throw new Error(`duplicate ${actorname}`);
      if (
        !State.variables.gDebugQuestTest &&
        !is_skip_costs &&
        !criteria.criteria.isCanAssign(unit)
      )
        throw new Error(`invalid unit for ${actorname}`);
      this.actor_unit_key_map[actorname] = unit.key;
    }

    if (!is_skip_costs) {
      // Finally pay costs.
      let quest_template = this.getTemplate();
      let costs = quest_template.getCosts();
      setup.RestrictionLib.applyAll(costs, this);
    }
  }

  assignTeam(team: Team, assignment_hint: ActorUnitMap) {
    if (team.quest_key)
      throw new Error(`Team ${team.name} already in quest ${team.quest_key}`);

    const assignment = assignment_hint;
    if (!assignment) throw new Error(`No assignment found`);

    return this._assignTeamWithAssignment(team, assignment);
  }

  /**
   * Cancel the team assignment
   * Call this only if the team is cancelled, not completed!
   */
  cancelAssignTeam() {
    // call this if you CHANGE YOUR MIND. not because the quest is completed.

    // First undo costs
    let quest_template = this.getTemplate();
    let costs = quest_template.getCosts();
    costs.forEach((cost) => {
      cost.undoApply(this);
    });

    let team = this.getTeam()!;
    if (!team.quest_key) throw new Error(`no quest`);

    team.removeQuest(this);
    team.disband();
    this.team_key = undefined;
    this.elapsed_week = 0;

    let criterias = this.getTemplate().getUnitCriterias();
    for (let criteria_key in criterias) {
      if (!(criteria_key in this.actor_unit_key_map))
        throw new Error(`missing ${criteria_key}`);
      delete this.actor_unit_key_map[criteria_key];
    }
  }

  isCanChangeTeam() {
    if (this.getElapsedWeeks() > 0 && this.getTeam()) return false;
    if (this.isTeamForcedAssigned()) return false;
    return true;
  }

  /**
   * Get a random number for this quest that remains the same always.
   */
  getSeed(): number {
    if (this.seed) return this.seed;
    this.seed = 1 + Math.floor(Math.random() * 999999997);
    return this.seed;
  }

  /**
   * Marks that this quest's teams are forcefully assigned and cannot be removed.
   */
  setTeamForcedAssigned() {
    this.is_team_forced_assigned = true;
  }

  isTeamForcedAssigned(): boolean {
    return !!this.is_team_forced_assigned;
  }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList());
  }

  static debugKillActorsDo(actor_list: Array<[actorname: string, unit: Unit]>) {
    for (const [actor_name, actor_unit] of actor_list) {
      if (actor_unit instanceof setup.Unit) {
        if (actor_unit.isYourCompany()) {
          actor_unit.quest_key = undefined;
          actor_unit.opportunity_key = undefined;
          actor_unit.market_key = undefined;
          actor_unit.team_key = undefined;
        } else {
          actor_unit.delete();
        }
      }
    }
  }
}
