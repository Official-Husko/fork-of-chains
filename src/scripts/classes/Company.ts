import { TwineClass } from "./_TwineClass";
import type { CompanyTemplate, CompanyTemplateKey } from "./CompanyTemplate";
import type { Job, JobKey } from "./job/Job";
import type { QuestInstance, QuestInstanceKey } from "./quest/QuestInstance";
import type { QuestTemplate, QuestTemplateKey } from "./quest/QuestTemplate";
import type { Team, TeamKey } from "./Team";
import type { TitleKey } from "./title/Title";
import type { Unit, UnitKey } from "./unit/Unit";

//export type CompanyKey = BrandedType<string, "CompanyKey">;
export type CompanyKey = CompanyTemplateKey;

export class Company extends TwineClass {
  key: CompanyKey;
  template_key: CompanyTemplateKey;

  name?: string;

  money = 0;
  unit_keys?: UnitKey[];
  team_keys?: TeamKey[];
  quest_keys?: QuestInstanceKey[];
  ignored_quest_template_keys?: { [k in QuestTemplateKey]?: 1 };

  prestige = 0;
  is_favor_active: 0 | 1 = 1;

  /**
   * Create a new company instance.
   */
  constructor(key: string, template: CompanyTemplate) {
    super();

    this.key = key as CompanyKey;
    this.template_key = template.key;

    // Companies are registered during state creation
    //if (!(key in registry)) {
    //  State.variables.company[key as CompanyKey] = this;
    //}
  }

  getRepMacro(): string {
    return "companycard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  isFavorActive(): boolean {
    return !!this.is_favor_active;
  }

  toggleIsFavorActive(): void {
    this.is_favor_active = this.is_favor_active ? 0 : 1;
  }

  getTemplate(): CompanyTemplate {
    return setup.companytemplate[this.template_key];
  }

  getName(): string {
    return this.name ?? this.getTemplate().getName();
  }

  getMaxUnitOfJob(job: Job): number {
    return State.variables.fort.player.getMaxUnitOfJob(job);
  }

  isCanAddUnitWithJob(job: Job): boolean {
    let exists = this.getUnits({ job: job });
    let limit = this.getMaxUnitOfJob(job);
    return exists.length < limit;
  }

  addPrestige(prestige_amt: number): void {
    if (prestige_amt == 0) return;
    this.prestige += prestige_amt;

    let textbase = "";
    if (prestige_amt < 0) textbase = "Lost";
    if (prestige_amt > 0) textbase = "Gained";
    setup.notify(textbase + " " + `<<prestige ${prestige_amt}>>`);

    State.variables.statistics.setMax("prestige_max", this.getPrestige());
  }

  getPrestige(): number {
    return this.prestige;
  }

  getTotalWages(): number {
    let wage_total = 0;
    this.getSlavers().forEach((unit) => (wage_total += unit.getWage()));
    return wage_total;
  }

  addQuest(quest: QuestInstance): void {
    (this.quest_keys ??= []).unshift(quest.key);

    State.variables.statistics.setMax(
      "quest_max_simultaneous_have",
      this.quest_keys.length,
    );
    State.variables.statistics.setMax(
      "quest_max_get_level",
      quest.getTemplate().getDifficulty().getLevel(),
    );
    State.variables.statistics.add("quest_obtained", 1);
    if (quest.getTemplate().getTags().includes("veteran")) {
      State.variables.statistics.add("quest_obtained_veteran", 1);
    }
  }

  // DONT CALL THIS DIRECTLY. use quest.expire() or quest.finalize()
  archiveQuest(quest: QuestInstance): void {
    // this.archived_quest_keys.push(quest.key)
    this.quest_keys = this.quest_keys?.filter((item) => item != quest.key);
    setup.queueDelete(quest, "questinstance");
  }

  /**
   * Ignore all occurrences of this quest template.
   */
  ignoreQuestTemplate(quest_template: QuestTemplate) {
    this.ignored_quest_template_keys ??= {};
    if (quest_template.key in this.ignored_quest_template_keys)
      throw new Error(`Quest ${quest_template.key} is already ignored`);
    this.ignored_quest_template_keys[quest_template.key] = 1;
  }

  /**
   * Unignore this quest template.
   */
  unignoreQuestTemplate(quest_template: QuestTemplate): void {
    if (
      !this.ignored_quest_template_keys ||
      quest_template.key in this.ignored_quest_template_keys
    )
      throw new Error(`Quest ${quest_template.key} is not ignored`);
    delete this.ignored_quest_template_keys[quest_template.key];
  }

  isIgnored(quest_template: QuestTemplate): boolean {
    return (
      !!this.ignored_quest_template_keys &&
      quest_template.key in this.ignored_quest_template_keys
    );
  }

  getOpenQuests(): QuestInstance[] {
    let quests = this.getQuests();
    let result = [];
    for (let i = 0; i < quests.length; ++i) {
      if (!quests[i].getTeam()) result.push(quests[i]);
    }
    return result;
  }

  getQuests(filter_obj?: {
    tag?: string;
    isfree?: boolean;
    isassigned?: boolean;
    sort?:
      | "level"
      | "levelup"
      | "deadline"
      | "deadlineup"
      | "duration"
      | "durationup";
  }): QuestInstance[] {
    let result: QuestInstance[] = [];
    for (const quest_key of this.quest_keys ?? []) {
      let quest = State.variables.questinstance[quest_key];
      if (
        filter_obj &&
        filter_obj.tag &&
        !quest.getTemplate().getTags().includes(filter_obj.tag)
      )
        continue;
      if (filter_obj && filter_obj.isfree && quest.getTeam()) continue;
      if (filter_obj && filter_obj.isassigned && !quest.getTeam()) continue;
      result.push(quest);
    }
    if (filter_obj && filter_obj.sort) {
      if (filter_obj.sort == "level") {
        result.sort(
          (a, b) =>
            b.getTemplate().getDifficulty().getLevel() -
            a.getTemplate().getDifficulty().getLevel(),
        );
      } else if (filter_obj.sort == "levelup") {
        result.sort(
          (a, b) =>
            a.getTemplate().getDifficulty().getLevel() -
            b.getTemplate().getDifficulty().getLevel(),
        );
      } else if (filter_obj.sort == "deadline") {
        result.sort(
          (a, b) => a.getWeeksUntilExpired() - b.getWeeksUntilExpired(),
        );
      } else if (filter_obj.sort == "deadlineup") {
        result.sort(
          (a, b) => b.getWeeksUntilExpired() - a.getWeeksUntilExpired(),
        );
      } else if (filter_obj.sort == "duration") {
        result.sort(
          (a, b) => b.getTemplate().getWeeks() - a.getTemplate().getWeeks(),
        );
      } else if (filter_obj.sort == "durationup") {
        result.sort(
          (a, b) => a.getTemplate().getWeeks() - b.getTemplate().getWeeks(),
        );
      } else {
        throw new Error(`Unrecognized sort option: ${filter_obj.sort}`);
      }
    }
    return result;
  }

  getFinishedQuestIfAny(): QuestInstance | null {
    let quests = this.getQuests();
    for (let i = 0; i < quests.length; ++i) {
      let quest = quests[i];
      if (quest.isFinished() && !quest.isFinalized()) return quest;
    }
    return null;
  }

  expireQuests(): QuestInstance[] {
    let expirees: QuestInstance[] = [];
    let quests = this.getQuests();
    for (let i = 0; i < quests.length; ++i) {
      let quest = quests[i];
      if (quest.isExpired()) {
        quest.expire();
        expirees.push(quest);
      }
    }
    return expirees;
  }

  getMaxTeams() {
    return 3 * this.getMaxActiveTeams();
  }

  // how many teams can be deployed at the same time maximum?
  getMaxActiveTeams() {
    if (
      State.variables.fort.player.isHasBuilding(
        setup.buildingtemplate.missioncontrol,
      )
    ) {
      let level = State.variables.fort.player
        .getBuilding(setup.buildingtemplate.missioncontrol)!
        .getLevel();
      return level + 1;
    } else {
      return 1;
    }
  }

  addTeam(team: Team) {
    (this.team_keys ??= []).push(team.key);
  }

  removeTeam(team: Team) {
    if (!this.team_keys?.includes(team.key))
      throw new Error(`Team ${team.key} not found`);
    this.team_keys = this.team_keys.filter((key) => key != team.key);
  }

  getDeployableTeams() {
    return (
      this.getMaxActiveTeams() -
      this.getTeams().filter((team) => team.getQuest()).length
    );
  }

  isCanDeployTeam() {
    return this.getDeployableTeams() > 0;
  }

  getTeams(): Team[] {
    return (this.team_keys ?? []).map((key) => State.variables.team[key]);
  }

  addUnit(unit: Unit, job: Job) {
    if (unit.isYourCompany()) {
      throw new Error(`Cannot add unit already in your company`);
    }
    let previous_company = unit.getCompany();
    if (previous_company) {
      previous_company.removeUnit(unit);
    }
    let previous_unitgroup = unit.getUnitGroup();
    if (previous_unitgroup) {
      previous_unitgroup.removeUnit(unit);
    }
    unit.job_key = job.key;
    unit.company_key = this.key;
    (this.unit_keys ??= []).push(unit.key);

    State.variables.statistics.setMax(
      "slavers_max",
      this.getUnits({ job: setup.job.slaver }).length,
    );
    State.variables.statistics.setMax(
      "slaves_max",
      this.getUnits({ job: setup.job.slave }).length,
    );
    if (job == setup.job.slaver) {
      State.variables.statistics.add("slavers_hired", 1);
    } else if (job == setup.job.slave) {
      State.variables.statistics.add("slaves_hired", 1);
    }

    if (job == setup.job.slaver) {
      setup.notify(`a|Rep a|have joined your company!`, { a: unit });
      let join_text = "joined your company!";
      if (unit.getOrigin())
        join_text = `${join_text} Before joining, a|rep ${unit.getOrigin()}`;
      unit.addHistory(join_text);
    } else if (job == setup.job.slave) {
      setup.notify(`You enslave a|rep`, { a: unit });
      let join_text = "a|is enslaved by your company.";
      if (unit.getOrigin())
        join_text = `${join_text} Before being enslaved, a|rep ${unit.getOrigin()}`;
      unit.addHistory(join_text);
    }

    unit.resetCache();
  }

  /**
   * DONT CHECK FOR DELETION HERE. Removed unit should be moved to a unit group.
   */
  removeUnit(unit: Unit) {
    if (!this.unit_keys?.includes(unit.key)) throw new Error(`Unit not found`);
    if (unit == State.variables.unit.player) {
      throw new Error(
        `Player character is removed from the game. Should not happen`,
      );
    }

    // update statistics first, to make use of their jobs
    if (unit.isSlaver()) {
      State.variables.statistics.add("slavers_lost", 1);
    } else if (unit.isSlave()) {
      State.variables.statistics.add("slaves_lost", 1);
    }

    // apply curse of demise
    if (unit.isHasTrait(setup.trait.curse_demise1)) {
      unit.decreaseTrait(setup.trait.curse_demise1.getTraitGroup()!);
      setup.notify(
        `a|Rep took some of the company's money with a|them as a|they leave`,
        { a: unit },
      );
      this.substractMoney(setup.CURSE_DEMISE_LOST_MONEY);
    }

    // get friends to traumatize
    let friendships = State.variables.friendship.getFriendships(unit);
    const lover = State.variables.friendship.getLover(unit);
    let trauma_list: Array<
      [Unit, duration: number, frriendship: "lover" | number]
    > = [];
    for (let i = 0; i < friendships.length; ++i) {
      let target = friendships[i][0];
      if (!target.isSlaver()) continue;
      if (target == lover) {
        trauma_list.push([target, setup.TRAUMA_LOVERS_GONE, "lover"]);
      } else {
        let amt = friendships[i][1];
        for (let j = 0; j < setup.TRAUMA_REMOVED_DURATION.length; ++j) {
          let range = setup.TRAUMA_REMOVED_DURATION[j][0];
          let duration = setup.TRAUMA_REMOVED_DURATION[j][1];
          if (amt >= range[0] && amt <= range[1]) {
            if (duration) {
              trauma_list.push([target, duration, amt]);
            }
            break;
          }
        }
      }
    }

    // Heal unit first
    let injury = State.variables.hospital.getInjury(unit);
    if (injury) State.variables.hospital.healUnit(unit, injury);

    // Unequip set if any
    let equipment_set = unit.getEquipmentSet();
    if (equipment_set) {
      equipment_set.unequip();
    }

    // remove from teams, if any.
    let team = unit.getTeam();
    if (team) {
      team.removeUnit(unit);
    }

    // remove for party, if any.
    const party = unit.getParty();
    if (party) {
      party.removeUnit(unit);
    }

    // remove from duties
    let duty = unit.getDuty();
    if (duty) {
      duty.unassignUnit();
    }

    // remove from owning bedchambers
    for (const bedchamber of unit.getOwnedBedchambers()) {
      bedchamber.setSlaver(State.variables.unit.player);
    }

    // remove from activity
    State.variables.activitylist.removeUnitActivity(unit);

    unit.company_key = undefined;
    unit.job_key = setup.job.unemployed.key;
    this.unit_keys = this.unit_keys!.filter((item) => item != unit.key);

    // traumatize friends
    for (let i = 0; i < trauma_list.length; ++i) {
      let target = trauma_list[i][0];
      let duration = trauma_list[i][1];

      // adjust duration
      const adjustment = setup.Trauma.getRelationshipTraumaAdjustment(target);
      duration = Math.round(duration * adjustment);

      let amt = trauma_list[i][2];
      if (amt == "lover") {
        setup.notify(
          `The loss of a|rep weighs heavily on their lover b|rep...`,
          { a: unit, b: target },
        );
        State.variables.trauma.traumatize(target, duration);
      } else if (duration > 0) {
        setup.notify(
          `The loss of a|rep weighs heavily on their <<tfriendtitle ${amt}>> b|rep...`,
          { a: unit, b: target },
        );
        State.variables.trauma.traumatize(target, duration);
      } else if (duration < 0) {
        setup.notify(
          `The loss of a|rep motivates their <<tfriendtitle ${amt}>> b|rep...`,
          { a: unit, b: target },
        );
        State.variables.trauma.boonize(target, -duration);
      }
    }

    setup.notify(`a|Rep a|have left your company`, { a: unit });

    unit.resetCache();
    unit.checkDelete();
  }

  addMoneyNudged(money: number) {
    this.addMoney(setup.nudgeMoney(money));
  }

  addMoney(money: number) {
    if (!Number.isInteger(money))
      throw new Error(`Money amount is not an integer`);

    if (money == 0) return;
    if (money < 0) {
      this.substractMoney(-money);
    } else {
      this.money += money;
      setup.notify(`Gained <<money ${money}>>`);
    }
    State.variables.statistics.setMax("money_max", this.getMoney());
    State.variables.statistics.setMax("money_max_gain", money);
  }

  substractMoney(money: number) {
    if (!Number.isInteger(money))
      throw new Error(`Money amount is not an integer`);

    if (money == 0) return;
    if (money < 0) {
      this.addMoney(-money);
    } else {
      this.money -= money;
      setup.notify(`Lost <<moneyloss ${money}>>`);
    }
    State.variables.statistics.setMax("money_max_lose", money);
  }

  getMoney(): number {
    return this.money;
  }

  getUnits(
    options: {
      job?: Job | JobKey;
      no_team?: boolean;
      available?: boolean;
      injured?: boolean;
      notinjured?: boolean;
      home?: boolean;
      on_duty?: boolean;
      usable_by_you?: boolean;
      tag?: string;
      title?: TitleKey;
    } = {},
    sortby?: "name" | "job" | null,
  ): Unit[] {
    // filter_dict can consist of:
    // job: unit job
    // no_team: not in a team
    // available: available
    // injured: is injured

    // sortby:
    // 'name', 'job'
    let result: Unit[] = [];

    const job = options.job ? resolveObject(options.job, setup.job) : null;

    this.unit_keys?.forEach((unit_key) => {
      if (!(unit_key in State.variables.unit))
        throw new Error(`unit ${unit_key} not found`);
      let unit = State.variables.unit[unit_key];
      if (job && unit.getJob() !== job) return;
      if (options["no_team"] && unit.team_key) return;
      if (options["available"] && !unit.isAvailable()) return;
      if (options["injured"] && !State.variables.hospital.isInjured(unit))
        return;
      if (options["notinjured"] && State.variables.hospital.isInjured(unit))
        return;
      if (options["home"] && !unit.isHome()) return;
      if (options["on_duty"] && !unit.getDuty()) return;
      if (
        options["usable_by_you"] &&
        !unit.isUsableBy(State.variables.unit.player)
      )
        return;
      if (options["tag"] && !unit.isHasTag(options["tag"])) return;
      if (options["title"] && !unit.isHasTitle(setup.title[options["title"]]))
        return;
      result.push(unit);
    });
    if (sortby == "name") result.sort(setup.Unit_CmpName);
    if (sortby == "job") result.sort(setup.Unit_CmpJob);
    if (sortby == null) result.sort(setup.Unit_CmpDefault);
    return result;
  }

  getSlavers() {
    return this.getUnits({ job: setup.job.slaver });
  }

  getSlaves() {
    return this.getUnits({ job: setup.job.slave });
  }

  getFavorEffects() {
    return this.getTemplate().getFavorEffects();
  }

  getDescription() {
    return this.getTemplate().getDescription();
  }
}
