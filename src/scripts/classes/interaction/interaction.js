import { ContentTemplate } from "../content/ContentTemplate"

setup.Interaction = class Interaction extends ContentTemplate {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string | AuthorInfo} author 
   * @param {string[]} tags 
   * @param {string} passage 
   * @param {setup.Cost[]} costs 
   * @param {setup.Restriction[]} prerequisites 
   * @param {setup.Restriction[]} unit_requirements 
   * @param {setup.Cost[]} rewards 
   * @param {number} cooldown 
   * @param {setup.InteractionPool} pool 
   */
  constructor(
    key,
    name,
    author,
    tags,
    passage,
    costs,   // e.g. has money
    prerequisites,  // e.g., has a building
    unit_requirements,   // e.g., is a slaver. Actor name is 'target'
    rewards,   // e.g, x gains a trait.
    cooldown,   // e.g., this interaction can be used again on the same unit in xxx weeks.
    pool,
  ) {
    super(key, name, author, tags, /* actor unitgroups = */ {}, /* difficulty = */ setup.qdiff.normal40)

    /**
     * @type {'interaction'}
     */
    const type = 'interaction'
    this.TYPE = type

    this.passage = passage
    this.costs = costs
    this.prerequisites = prerequisites
    this.unit_requirements = unit_requirements
    this.rewards = rewards
    this.cooldown = cooldown
    this.current_cooldown = {}

    if (!pool) throw new Error(`Pool of ${key} cannot be null`)

    if (key in setup.interaction) throw new Error(`Duplicate ${key}`)
    setup.interaction[key] = this

    pool.register(this)
  }

  sanityCheck(
    key,
    name,
    desc,
    costs,
    outcomes,  // effects of event. Other effects can be put directly in the passage
    restrictions,    // lists eligibility of this event to occur
    cooldown,   // interaction cooldonw in week (0 is ok)
  ) {
    if (!key) return 'Key cannot be empty'
    if (key in setup.interaction) return `Key ${key} is duplicated with another interaction`
    // if (!key.match('^[a-z_]+$')) return `Key ${key} must only consist of lowercase characters and underscore, e.g., water_well`

    if (!name) return 'Name cannot be null'
    if (!desc) return 'Description cannot be empty'

    // if (!Object.keys(unit_criterias).length) return 'Must have at least one role'
    if (cooldown < 0) return 'Cooldown cannot be negative'

    return null
  }

  getName() { return this.name }
  getAuthor() { return this.author }
  getPassage() { return this.passage }
  getCosts() { return this.costs }
  getTags() { return this.tags }
  getPrerequisites() { return this.prerequisites }
  getUnitRequirements() { return this.unit_requirements }
  getRewards() { return this.rewards }
  getCooldown() { return this.cooldown }

  canInteractWith(unit) {
    if (unit == State.variables.unit.player) return false
    if (this.isOnCooldown(unit)) return false
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getPrerequisites())) return false
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getCosts())) return false
    if (State.variables.hospital.isInjured(unit)) return false
    if (!unit.isHome()) return false
    if (!State.variables.unit.player.isAvailable()) return false
    if (!setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, this.getUnitRequirements())) return false
    if (State.variables.settings.isBanned(this.getTags())) return false
    return true
  }

  isOnCooldown(unit) {
    let cooldowns = State.variables.interaction_cooldowns
    return (this.key in cooldowns && cooldowns[this.key][unit.key] > 0)
  }

  static advanceWeek() {
    let cooldowns = State.variables.interaction_cooldowns
    for (let interactionkey in cooldowns) {
      let unitkeys = Object.keys(cooldowns[interactionkey])
      for (let i = 0; i < unitkeys.length; ++i) {
        let unitkey = unitkeys[i]
        cooldowns[interactionkey][unitkey] -= 1
        if (cooldowns[interactionkey][unitkey] <= 0) {
          delete cooldowns[interactionkey][unitkey]
        }
      }
    }
  }

  resetCooldown(unit) {
    if (!this.cooldown) return
    let cooldowns = State.variables.interaction_cooldowns
    if (!(this.key in cooldowns)) {
      cooldowns[this.key] = {}
    }
    cooldowns[this.key][unit.key] = this.getCooldown()
  }


  makeInstance(unit) {
    this.resetCooldown(unit)
    let instance = new setup.InteractionInstance(this, unit)
    instance.applyCosts()
    return instance
  }

  /**
   * @param {boolean} efficient_mode 
   * @returns {setup.InteractionInstance}
   */
  debugMakeInstance(efficient_mode) {
    // check if some unit can satisfy

    const company_units = State.variables.company.player.getUnits({})
    let unit = null
    for (let i = 0; i < company_units.length; ++i) {
      let targ = company_units[i]
      if (this.canInteractWith(targ)) {
        unit = targ
        break
      }
    }
    if (!unit) {
      // force
      unit = setup.generateAnyUnit()
      State.variables.company.player.addUnit(unit, setup.job.slave)
      let unit2 = setup.generateAnyUnit()
      State.variables.company.player.addUnit(unit2, setup.job.slave)

      let bc = State.variables.bedchamberlist.newBedchamber()
      bc.getDuties()[0].assignUnit(unit)
      bc.getDuties()[1].assignUnit(unit2)
    }

    return new setup.InteractionInstance(this, unit)
  }

  getAllActorNames() {
    return []
  }
}
