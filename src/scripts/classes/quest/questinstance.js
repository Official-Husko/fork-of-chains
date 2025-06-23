setup.QuestInstance = class QuestInstance extends setup.TwineClass {
  constructor(quest_template, actor_units) {
    super()

    this.key = State.variables.QuestInstance_keygen
    State.variables.QuestInstance_keygen += 1

    this.quest_template_key = quest_template.key;

    this.actor_unit_key_map = {}

    for (let actor_key in actor_units) {
      let unit = actor_units[actor_key]
      if (unit.quest_key !== null) throw new Error(`unit is busy on another quest`)
      if (unit.opportunity_key) throw new Error(`unit is busy on another opportunity`)
      this.actor_unit_key_map[actor_key] = unit.key
      unit.quest_key = this.key

      unit.setDebugInfo(quest_template)
    }

    this.team_key = null
    this.elapsed_week = null
    this.outcome = null   // crit success disaster fail
    this.weeks_until_expired = quest_template.getDeadlineWeeks()
    this.is_team_forced_assigned = false

    // score object is cached at the end of week 1. This is so that units that lose their boons will still
    // make use of them when calculating the chances.
    /**
     * @type {{
     *   crit: number,
     *   success: number,
     *   failure: number,
     *   disaster: number
     * }}
     */
    this.cached_score_obj = null

    if (this.key in State.variables.questinstance) throw new Error(`Quest Instance ${this.key} already exists`)
    State.variables.questinstance[this.key] = this
  }


  delete() { delete State.variables.questinstance[this.key] }


  rep() {
    return setup.repMessage(this, 'questcardkey')
  }


  isDismissable() {
    if (this.team_key) return false
    if (!State.variables.company.player.getQuests().includes(this)) return false
    if (this.getTemplate().getDeadlineWeeks() == setup.INFINITY) return false
    return true
  }


  getWeeksUntilExpired() { return this.weeks_until_expired }


  isExpired() {
    if (this.getTemplate().getDeadlineWeeks() == setup.INFINITY) return false
    return this.getWeeksUntilExpired() <= 0
  }

  cleanup(dont_disband) {
    // remove all associations of this quest with units

    // unassign teams
    if (this.getTeam()) {
      let team = State.variables.team[this.team_key]
      team.removeQuest(this)
      if (dont_disband) {
        team.unsetUnits()
      } else {
        team.disband()
      }
    }

    // unassign remaining actors
    let actor_objs = this.getActorObj()
    for (let actorname in actor_objs) {
      actor_objs[actorname].quest_key = null
      actor_objs[actorname].checkDelete()
    }

  }

  expire() {
    this.cleanup()

    let outcomes = this.getTemplate().getExpiredOutcomes()
    setup.RestrictionLib.applyAll(outcomes, this)

    State.variables.company.player.archiveQuest(this)
  }

  rollOutcome() {
    if (!(this.isFinished())) throw new Error(`Quest not yet ready to be finished`)
    if (this.isFinalized()) throw new Error(`Quest already finalized`)
    if (this.outcome) throw new Error(`Outcome already rolled`)

    let score_obj = this.getScoreObj()

    this.outcome = setup.QuestDifficulty.rollOutcome(score_obj)

    if (this.outcome == 'disaster') {
      // Reroll with blessing of luck.
      const stacks_required = this.getTemplate().getDifficulty().getBlessingOfLuckStacks()
      const trait_required = setup.trait[`blessing_luck${stacks_required}`]

      const luckers = this.getTeam().getUnits().filter(unit => unit.isHasTrait(trait_required))
      if (luckers.length) {
        const lucker = setup.rng.choice(luckers)
        setup.notify(`a|Reps Blessing of Luck may have prevented a disastrous outcome...`, { a: lucker })
        for (let i = 0; i < stacks_required; ++i) {
          lucker.decreaseTrait(trait_required.getTraitGroup())
        }

        // reroll
        this.outcome = setup.QuestDifficulty.rollOutcome(score_obj)
      }
    }

    // adjust result with curse of crow
    if (this.outcome == 'crit' && score_obj.crit <= setup.CURSE_CROW_MAX_CRIT_CHANCE) {
      const cursed = this.getTeam().getUnits().filter(unit => unit.isHasTrait(setup.trait.curse_crow1))
      if (cursed.length) {
        const target = setup.rng.choice(cursed)
        setup.notify(`a|Reps Curse of Crow prevented a critical success outcome...`, { a: target })
        target.decreaseTrait(setup.trait.curse_crow1.getTraitGroup())
        this.outcome = 'success'
      }
    }
  }

  /**
   * @returns {'crit' | 'success' | 'failure' | 'disaster'}
   */
  getOutcome() { return this.outcome }

  getOutcomeObject() {
    let quest_template = this.getTemplate()
    let outcomes = quest_template.getOutcomes()

    if (!this.outcome) throw new Error(`Outcome has not been rolled`)
    let outcome = null
    if (this.outcome == 'crit') {
      outcome = outcomes[0]
    } else if (this.outcome == 'success') {
      outcome = outcomes[1]
    } else if (this.outcome == 'failure') {
      outcome = outcomes[2]
    } else if (this.outcome == 'disaster') {
      outcome = outcomes[3]
    } else {
      throw new Error(`Weird outcome ${this.outcome}`)
    }
    return outcome
  }

  finalize() {
    // if (!this.isFinished()) throw new Error(`Quest not yet ready to be finished`)
    if (!this.outcome) throw new Error(`Outcome has not been rolled`)

    // cleanup first so that the units from persistent group are "freed" and can be used to generate new quests.
    this.cleanup(/* dont disband = */ true)

    // compute base money for insurer. Done before applying the below
    const insurer_base = setup.qcImpl.MoneyNormal.computeBaseMoney(this)
    const scavenger_base = 1.0 * insurer_base / setup.qdiff.normal40.getMoney() * setup.PERK_SCAVENGER_GOLD_PER_WEEK

    // get scavenger money
    for (const unit of this.getTeam().getUnits()) {
      if (unit && unit.isHasTrait('perk_scavenger')) {
        setup.qc.Money(Math.round(scavenger_base)).apply()
      }
    }

    // process outcomes
    let outcomes = this.getOutcomeObject()[1]
    outcomes.forEach(outcome => {
      outcome.apply(this)
    })

    // disband team if any
    let team = this.getTeam()
    if (team) team.disband()

    State.variables.company.player.archiveQuest(this)

    // If it's a failure, insurer will give you money
    if (['failure', 'disaster'].includes(this.outcome)) {
      let insurer = State.variables.dutylist.getDuty('insurer')
      if (insurer) {
        let proc = insurer.getProc()
        if (proc == 'proc' || proc == 'crit') {
          const multi = setup.INSURER_MULTIS[this.outcome][proc]
          const base = Math.round(multi * insurer_base)

          setup.notify(`${setup.capitalize(insurer.repYourDutyRep())} produced some money to cushion the quest failure.`,)
          State.variables.company.player.addMoneyNudged(base)
        }
      }
    }

    State.variables.statistics.add(`quest_${this.outcome}`, 1)
    State.variables.statistics.setMax('quest_max_took_level', this.getTemplate().getDifficulty().getLevel())
    if (this.getTemplate().getTags().includes('veteran')) {
      State.variables.statistics.add(`quest_done_veteran`, 1)
    }
    State.variables.statistics.setQuestResult(this.getTemplate(), this.outcome)
  }

  isFinished() {
    return this.getRemainingWeeks() <= 0
  }

  isFinalized() {
    return this.outcome
  }

  advanceQuestOneWeek() {
    // advance both quest with team and unpicked quest by one week.
    if (this.getTeam()) {
      this.elapsed_week += 1
      // store score object
      if (!this.cached_score_obj) {
        this.cached_score_obj = this.getScoreObj()
      }
    } else {
      this.weeks_until_expired -= 1
    }

  }

  getElapsedWeeks() { return this.elapsed_week }

  getRemainingWeeks() {
    return this.getTemplate().getWeeks() - this.getElapsedWeeks()
  }

  /**
   * @returns {string}
   */
  getName() { return this.getTemplate().getName() }

  /**
   * @returns {string}
   */
  getDescriptionPassage() { return this.getTemplate().getDescriptionPassage() }

  /**
   * @returns {setup.Team}
   */
  getTeam() {
    if (!this.team_key) return null
    return State.variables.team[this.team_key]
  }

  getTemplate() {
    return setup.questtemplate[this.quest_template_key]
  }

  getActorsList() {
    // return [['actor1', unit], ['actor2', unit], ...]
    let result = []
    for (let actor_key in this.actor_unit_key_map) {
      let unit = State.variables.unit[this.actor_unit_key_map[actor_key]]
      result.push([actor_key, unit])
    }
    return result
  }

  // get actors which are not part of the team (e.g. trainee)
  // Output: { 'actor_name': unit }
  getExtraActors() {
    const res = {}
    for (const actor_key in this.getTemplate().getActorUnitGroups()) {
      let unit = this.getActorUnit(actor_key)
      if (unit.isYourCompany()) res[actor_key] = unit
    }
    return res
  }

  swapActors(actorname1, actorname2) {
    if (!(actorname1 in this.actor_unit_key_map)) throw new Error(`unknown actor 1 ${actorname1}`)
    if (!(actorname2 in this.actor_unit_key_map)) throw new Error(`unknown actor 2 ${actorname2}`)
    let ac1 = this.actor_unit_key_map[actorname1]
    let ac2 = this.actor_unit_key_map[actorname2]
    this.actor_unit_key_map[actorname1] = ac2
    this.actor_unit_key_map[actorname2] = ac1
  }

  replaceActor(actorname, new_unit) {
    if (!(actorname in this.actor_unit_key_map)) throw new Error(`unknown actor ${actorname}`)
    if (new_unit.quest_key != this.key) throw new Error(`unit ${new_unit.key} already in quest ${new_unit.quest_key}`)
    this.actor_unit_key_map[actorname] = new_unit.key
  }

  isUnitInQuest(unit) {
    for (let actorname in this.actor_unit_key_map) {
      if (this.actor_unit_key_map[actorname] == unit.key) return true
    }
    return false
  }

  /**
   * @typedef {{criteria: setup.UnitCriteria, offsetmod: number}} CriteriaOffset
   * 
   * @returns {Array<[
   *   string,
   *   CriteriaOffset,
   *   setup.Unit | null
   * ]>}
   */
  getUnitCriteriasList() {
    // return [[actor_name, {criteria: unitcriteria, offsetmod: offsetmod}, unit (if any)]]
    let quest_template = this.getTemplate()
    /**
     * @type {Array<[
     *   string,
     *   CriteriaOffset,
     *   setup.Unit | null
     * ]>}
     */
    let result = []
    let criterias = quest_template.getUnitCriterias()
    for (let criteria_key in criterias) {
      let criteria = criterias[criteria_key]
      let unit = null
      if (criteria_key in this.actor_unit_key_map) {
        unit = State.variables.unit[this.actor_unit_key_map[criteria_key]]
      }
      result.push([criteria_key, criteria, unit])
    }
    return result
  }

  getActorObj() {
    // return object where object.actorname = unit, if any.
    let actor_list = this.getActorsList()
    let res = {}
    actor_list.forEach(al => {
      res[al[0]] = al[1]
    })
    return res
  }


  /**
   * @param {string} actor_name 
   * @returns {setup.Unit}
   */
  getActorUnit(actor_name) {
    return State.variables.unit[this.actor_unit_key_map[actor_name]]
  }


  isCostsSatisfied() {
    let quest_template = this.getTemplate()

    let costs = quest_template.getCosts()
    for (let i = 0; i < costs.length; ++i) {
      let cost = costs[i]
      if (!cost.isOk(this)) return false
    }
    return true
  }

  /**
   * @returns {{
   *   crit: number,
   *   success: number,
   *   failure: number,
   *   disaster: number
   * }}
   */
  getScoreObj() {
    if (this.cached_score_obj) {
      return this.cached_score_obj
    }
    let quest_template = this.getTemplate()
    let criterias = quest_template.getUnitCriterias()
    let score = setup.QuestDifficulty.computeSuccessObj(quest_template.getDifficulty(), criterias, this.getActorObj())
    return score
  }

  /**
   * 
   * @param {setup.Team} team 
   * @param {object} assignment 
   * @param {boolean=} is_skip_costs 
   */
  _assignTeamWithAssignment(team, assignment, is_skip_costs) {
    team.setQuest(this)
    this.team_key = team.key
    this.elapsed_week = 0

    let criterias = this.getTemplate().getUnitCriterias()
    for (let criteria_key in criterias) {
      let criteria = criterias[criteria_key]
      if (!(criteria_key in assignment)) throw new Error(`missing ${criteria_key} in assignment`)
      let unit = assignment[criteria_key]
      if (criteria_key in this.actor_unit_key_map) throw new Error(`duplicate ${criteria_key}`)
      // @ts-ignore
      if (!State.variables.gDebugQuestTest && !is_skip_costs && !criteria.criteria.isCanAssign(unit)) throw new Error(`invalid unit for ${criteria_key}`)
      this.actor_unit_key_map[criteria_key] = unit.key
    }

    if (!is_skip_costs) {
      // Finally pay costs.
      let quest_template = this.getTemplate()
      let costs = quest_template.getCosts()
      setup.RestrictionLib.applyAll(costs, this)
    }
  }

  /**
   * @param {setup.Team} team 
   * @param {Object} assignment_hint 
   */
  assignTeam(team, assignment_hint) {
    if (team.quest_key) throw new Error(`Team ${team.name} already in quest ${team.quest_key}`)

    const assignment = assignment_hint
    if (!assignment) throw new Error(`No assignment found`)

    return this._assignTeamWithAssignment(team, assignment)
  }

  /**
   * Cancel the team assignment
   * Call this only if the team is cancelled, not completed!
   */
  cancelAssignTeam() {
    // call this if you CHANGE YOUR MIND. not because the quest is completed.

    // First undo costs
    let quest_template = this.getTemplate()
    let costs = quest_template.getCosts()
    costs.forEach(cost => {
      cost.undoApply(this)
    })

    let team = this.getTeam()
    if (!team.quest_key) throw new Error(`no quest`)

    team.removeQuest(this)
    team.disband()
    this.team_key = null
    this.elapsed_week = 0

    let criterias = this.getTemplate().getUnitCriterias()
    for (let criteria_key in criterias) {
      if (!(criteria_key in this.actor_unit_key_map)) throw new Error(`missing ${criteria_key}`)
      delete this.actor_unit_key_map[criteria_key]
    }
  }

  isCanChangeTeam() {
    if (this.getElapsedWeeks() > 0 && this.getTeam()) return false
    if (this.isTeamForcedAssigned()) return false
    return true
  }

  /**
   * Get a random number for this quest that remains the same always.
   */
  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }

  /**
   * Marks that this quest's teams are forcefully assigned and cannot be removed.
   */
  setTeamForcedAssigned() {
    this.is_team_forced_assigned = true
  }

  /**
   * @returns {boolean}
   */
  isTeamForcedAssigned() { return this.is_team_forced_assigned }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList())
  }

  static debugKillActorsDo(actor_list) {
    for (const [actor_name, actor_unit] of Object.values(actor_list)) {
      if (actor_unit instanceof setup.Unit) {
        if (actor_unit.isYourCompany()) {
          actor_unit.quest_key = null
          actor_unit.opportunity_key = null
          actor_unit.market_key = null
          actor_unit.team_key = null
        } else {
          actor_unit.delete()
        }
      }
    }
  }
}
