// @ts-nocheck

import { ContentTemplate } from "../content/ContentTemplate"

setup.Event = class Event extends ContentTemplate {
  /**
   * @typedef {{name: string, url: string}} AuthorInfo
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {string | AuthorInfo} author 
   * @param {string[]} tags 
   * @param {string} passage 
   * @param {Object<string, setup.Restriction[]>} unit_restrictions 
   * @param {Object<string, any>} actor_unitgroups 
   * @param {setup.Cost[]} rewards 
   * @param {setup.Restriction[]} requirements 
   * @param {number} cooldown 
   * @param {setup.Rarity} rarity 
   */
  constructor(
    key,
    name,
    author,   // who wrote this?
    tags,
    passage,  // the passage to be executed for this event.
    unit_restrictions,  // {actorname: [restriction1, restriction2,]} Fitted randomly from entire unit list
    actor_unitgroups,  // {actorname: unit group}, unit generated/taken from unit group.
    rewards,  // effects of event. Other effects can be put directly in the passage
    requirements,    // lists eligibility of this event to occur
    cooldown,   // how many weeks until this event can trigger again? Insert -1 for NEVER
    rarity,   // same with quest rarity.
  ) {
    super(key, name, author, tags, actor_unitgroups, setup.qdiff.normal40)

    /**
     * @type {'event'}
     */
    const type = 'event'
    this.TYPE = type

    this.unit_restrictions = unit_restrictions
    for (const restriction of Object.values(unit_restrictions)) {
      if (!Array.isArray(restriction)) {
        throw new Error(`(LEGACY) role of event ${this.key} has a non-array restriction!`)
      }
    }

    this.passage = passage
    this.rewards = rewards
    this.requirements = requirements
    this.cooldown = cooldown

    if (!(rarity instanceof setup.Rarity)) throw new Error(`Unknown rarity for event ${key}!`)
    this.rarity = rarity

    if (key in setup.event) throw new Error(`Event ${key} already exists`)
    setup.event[key] = this

    setup.EventPool.registerEvent(this, rarity)
  }

  static sanityCheck(
    key,
    name,
    desc,
    unit_criterias,  // {actorname: [restriction1, restriction2,]} Fitted randomly from entire unit list
    actor_unitgroups,  // {actorname: unit group}, unit generated/taken from unit group.
    outcomes,  // effects of event. Other effects can be put directly in the passage
    restrictions,    // lists eligibility of this event to occur
    cooldown,   // how many weeks until this event can trigger again? Insert -1 for NEVER
    rarity,   // same with quest rarity.
  ) {
    if (!key) return 'Key cannot be empty'
    if (key in setup.event) return `Key ${key} is duplicated with another event`
    // if (!key.match('^[a-z_]+$')) return `Key ${key} must only consist of lowercase characters and underscore, e.g., water_well`

    if (!name) return 'Name cannot be null'
    if (!desc) return 'Description cannot be empty'

    // if (!Object.keys(unit_criterias).length) return 'Must have at least one role'
    if (cooldown < -1) return 'Cooldown cannot be below -1'

    for (let i = 0; i < restrictions.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(restrictions[i], unit_criterias, actor_unitgroups)) {
        return `Actor ${restrictions[i].actor_name} not found in the ${i}-th event restriction`
      }
    }

    for (let i = 0; i < outcomes.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(outcomes[i], unit_criterias, actor_unitgroups)) {
        return `Actor ${outcomes[i].actor_name} not found in the ${i}-th event outcome`
      }
    }


    if (rarity < 0 || rarity > 100) return 'Rarity must be between 0 and 100'

    return null
  }

  rep() { return this.getName() }

  getUnitRestrictions() { return this.unit_restrictions }

  /**
   * @returns {Array.<string>}
   */
  getAllActorNames() {
    return Object.keys(this.getActorUnitGroups()).concat(Object.keys(this.getUnitRestrictions()))
  }

  getPassage() { return this.passage }
  getRewards() { return this.rewards }
  getRequirements() { return this.requirements }
  getCooldown() { return this.cooldown }

  /**
   * @returns {setup.Rarity}
   */
  getRarity() { return this.rarity }

  getDifficulty() {
    let level = Math.min(State.variables.unit.player.getLevel(), setup.LEVEL_PLATEAU)
    return setup.qdiff[`normal${level}`]
  }

  getActorResultJob(actor_name) {
    let rewards = this.getRewards()
    for (let j = 0; j < rewards.length; ++j) {
      let cost = rewards[j]
      // @ts-ignore
      if (cost.IS_SLAVE && cost.getActorName() == actor_name) return setup.job.slave
      // @ts-ignore
      if (cost.IS_SLAVER && cost.getActorName() == actor_name) return setup.job.slaver
    }
    return null
  }

  /**
   * @param {boolean} is_efficient 
   */
  debugMakeInstance(is_efficient) {
    let assignment = setup.EventPool.getEventUnitAssignmentRandom(this, /* default assignment = */ {})
    if (!assignment) {
      // force assign
      let unit_restrictions = this.getUnitRestrictions()
      const your_units = State.variables.company.player.getUnits({}).filter(
        unit => !unit.isEngaged() && !State.variables.leave.isOnLeave(unit)
      )
      setup.rng.shuffleArray(your_units)
      let unit_idx = 0

      assignment = {}
      let iter = 0
      for (let actor_key in unit_restrictions) {
        if (is_efficient && unit_idx < your_units.length) {
          assignment[actor_key] = your_units[unit_idx]
          unit_idx += 1
        } else {
          assignment[actor_key] = setup.unitpool.subrace_lizardkin_male.generateUnit()
          State.variables.company.player.addUnit(assignment[actor_key], setup.job.slaver)
        }
        iter += 1
      }
    }

    const actor_unitgroup = this.getActorUnitGroups()
    let actors = setup.DebugActor.getActors(actor_unitgroup, is_efficient)

    let finalized_assignment = setup.EventPool.finalizeEventAssignment(this, assignment, actors)
    let eventinstance = new setup.EventInstance(this, finalized_assignment)
    return eventinstance
  }

  /**
   * Whether this event can be triggered right now.
   * @returns {boolean}
   */
  isCanGenerate() {
    if (State.variables.settings.isBanned(this.getTags())) return false

    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getRequirements())) return false

    if (!setup.RestrictionLib.isActorUnitGroupViable(this.getActorUnitGroups())) return false

    if (State.variables.calendar.isOnCooldown(this)) return false

    return true
  }
}
