
setup.OpportunityInstance = class OpportunityInstance extends setup.TwineClass {
  constructor(opportunity_template, actor_units) {
    super()

    this.key = State.variables.OpportunityInstance_keygen
    State.variables.OpportunityInstance_keygen += 1

    this.opportunity_template_key = opportunity_template.key;

    this.actor_unit_key_map = {}

    this.option_number_selected = null

    for (let actor_key in actor_units) {
      let unit = actor_units[actor_key]
      if (unit.quest_key !== null) throw new Error(`unit is busy on another quest`)
      if (unit.opportunity_key) throw new Error(`unit is busy on another opportunity`)
      this.actor_unit_key_map[actor_key] = unit.key
      unit.opportunity_key = this.key

      unit.setDebugInfo(opportunity_template)
    }

    this.weeks_until_expired = opportunity_template.getDeadlineWeeks()

    if (this.key in State.variables.opportunityinstance) throw new Error(`Opportunity ${this.key} already exists`)
    State.variables.opportunityinstance[this.key] = this
  }


  delete() { delete State.variables.opportunityinstance[this.key] }


  rep() {
    return setup.repMessage(this, 'opportunitycardkey')
  }


  cleanup() {
    // remove all associations of this opportunity with units

    // unassign remaining actors
    let actor_objs = this.getActorObj()
    for (let actorname in actor_objs) {
      actor_objs[actorname].opportunity_key = null
      actor_objs[actorname].checkDelete()
    }
  }



  getWeeksUntilExpired() { return this.weeks_until_expired }


  isExpired() {
    if (this.getTemplate().isMustBeAnswered()) return false
    return this.getWeeksUntilExpired() == 0
  }


  expire() {
    this.cleanup()

    let outcomes = this.getTemplate().getExpiredOutcomes()
    setup.RestrictionLib.applyAll(outcomes, this)

    State.variables.opportunitylist.removeOpportunity(this)
  }


  advanceWeek() {
    this.weeks_until_expired -= 1
  }


  getName() {
    return this.getTemplate().getName()
  }


  getTemplate() {
    return setup.opportunitytemplate[this.opportunity_template_key]
  }


  getOptions() {
    return this.getTemplate().getOptions()
  }


  isCanSelectOption(option_number) {
    let option = this.getOptions()[option_number]
    if (!option) throw new Error(`Wrong option number ${option_number}`)

    const costs = option.costs
    const prereq = option.restrictions
    const vis_prereq = option.visibility_restrictions

    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, costs)) return false
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, prereq)) return false
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, vis_prereq)) return false

    return true
  }


  finalize() {
    // returns the passage that should be run. Note: the passage may be NULL, if nothing to be done.
    const option = this.getOptions()[this.option_number_selected]
    if (!option) throw new Error(`Option not yet selected`)

    this.cleanup()

    let costs = option.costs
    let outcomes = option.outcomes
    setup.RestrictionLib.applyAll(costs, this)
    setup.RestrictionLib.applyAll(outcomes, this)
    State.variables.opportunitylist.removeOpportunity(this)

    State.variables.statistics.add('opportunity_answered', 1)
  }


  selectOption(option_number) {
    if (typeof this.option_number_selected == 'number') {
      throw new Error(`Option already selected in this opportunity`)
    }

    const option = this.getOptions()[option_number]
    if (!option) throw new Error(`Wrong option number ${option_number}`)

    this.option_number_selected = option_number
  }


  /**
   * @returns {string}
   */
  getSelectedOptionPassage() {
    const option = this.getOptions()[this.option_number_selected]
    if (!option) throw new Error(`Option not yet selected`)

    return option.outcome_passage
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


  getActorObj() {
    // return object where object.actorname = unit, if any.
    let actor_list = this.getActorsList()
    let res = {}
    actor_list.forEach(al => {
      res[al[0]] = al[1]
    })
    return res
  }


  getActorUnit(actor_name) {
    return State.variables.unit[this.actor_unit_key_map[actor_name]]
  }


  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList())
  }

}
