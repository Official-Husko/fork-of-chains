// sex actions classes are stored here
setup.SexActionClass = {}

/**
 * An option to take during a SexScene.
 * 
 * Can cover text actions, or even simple things like pose change, equipment removal, etc.
 * 
 * Only the first unit can initiate the action.
 */
setup.SexAction = class SexAction extends setup.TwineClassCustom {
  /**
   * Create a sex action. While it can always be created, might not always be available.
   * Check isOk() for that. Order matters.
   * 
   * @param {setup.Unit[]} units 
   * @param {setup.SexInstance} sex
   */
  constructor(units, sex) {
    super()

    const actor_descriptions = this.getActorDescriptions()
    if (actor_descriptions.length != units.length) {
      throw new Error(`Incorrect number of units for sex action`)
    }
    this.unit_keys = units.map(unit => unit.key)
    if (this.unit_keys.length > setup.SexAction.ACTOR_NAMES.length) {
      throw new Error(`Too many actors in SexAction!`)
    }
  }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexActionClass` }

  /* =============================
      DEFINITIONS
  ============================= */

  /**
   * Get actor descriptions associated with this sex action
   * 
   * @typedef {Object} ActorDescription
   * @property {number} [arousal]
   * @property {number} [discomfort]
   * @property {number} [energy]
   * @property {Array<setup.Restriction>} [restrictions]
   * 
   * What paces are allowed to choose this via the AI?
   * @property {Array<setup.SexPace>} paces
   * 
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return []
  }

  /**
   * Get tags associated with this sex action
   * @returns {string[]}
   */
  getTags() {
    return []
  }

  /**
   * Get additional restrictions with this sex actions
   * @returns {setup.Restriction[]}
   */

  getRestrictions() {
    return []
  }

  /**
   * Get additional outcomes with this sex actions
   * @returns {setup.Cost[]}
   */
  getOutcomes() {
    return []
  }

  /**
   * Arousal multiplied by this
   * @param {string} actor_name 
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getArousalMultiplier(actor_name, unit, sex) { return 1.0 }

  /**
   * Discomfort multiplied by this
   * @param {string} actor_name 
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getDiscomfortMultiplier(actor_name, unit, sex) { return 1.0 }

  /**
   * Energy multiplied by this
   * @param {string} actor_name 
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getEnergyMultiplier(actor_name, unit, sex) { return 1.0 }


  /* =============================
      GETTERS
  ============================= */

  /**
   * Ordered list of units in this action
   * @returns {setup.Unit[]}
   */
  getUnits() { return this.unit_keys.map(key => State.variables.unit[key]) }

  /**
   * @returns {number}
   */
  getUnitCount() { return this.unit_keys.length }

  /**
   * @param {setup.Unit} unit 
   * @returns {string}
   */
  getActorName(unit) { return setup.SexAction.ACTOR_NAMES[this.getUnits().indexOf(unit)] }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {ActorDescription}
   */
  getActorDescription(unit, sex) {
    const index = this.getUnits().indexOf(unit)
    return this.getActorDescriptions()[index]
  }

  /**
   * @param {string} actor_name 
   * @returns {setup.Unit}
   */
  getActorUnit(actor_name) {
    for (let i = 0; i < setup.SexAction.ACTOR_NAMES.length; ++i) {
      if (actor_name == setup.SexAction.ACTOR_NAMES[i]) {
        return this.getUnits()[i]
      }
    }
    throw new Error(`Missing actor ${actor_name} in SexAction!`)
  }

  /**
   * {actor_name: unit}
   * @returns {Object<string, setup.Unit>}
   */
  getActorObj() {
    /**
     * @type {Object<string, setup.Unit>}
     */
    const res = {}

    const units = this.getUnits()
    for (let i = 0; i < units.length; ++i) {
      res[setup.SexAction.ACTOR_NAMES[i]] = units[i]
    }

    return res
  }

  /* =============================
      LOGIC
  ============================= */

  /**
   * Whether this action is allowed to take place.
   * @param {setup.SexInstance} sex
   * @returns {boolean}
   */
  isAllowed(sex) {
    // check all restrictions
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getRestrictions())) return false

    // check actor restrictions
    const units = this.getUnits()
    for (const unit of units) {
      const description = this.getActorDescription(unit, sex)
      if (!setup.RestrictionLib.isUnitSatisfy(unit, description.restrictions || [])) return false
    }

    // check disabled
    if (State.variables.settings.isSexActionDisabled(this)) {
      return false
    }
    return true
  }

  /**
   * Whether the AI is allowed to pick this action.
   * @param {setup.Unit} main_unit
   * @param {setup.SexInstance} sex 
   */
  isAIAllowed(main_unit, sex) {
    for (const unit of this.getUnits()) {
      const paces = this.getActorDescription(unit, sex).paces
      const pace = sex.getPace(unit)
      if (!paces.includes(pace)) return false
    }

    // check permission
    const permission = sex.getPermission(main_unit)
    if (!permission.isActionAllowed(this, sex)) return false

    // everything looks ok
    return true
  }

  /**
   * How much arousal does this unit gain from this sex?
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getArousalBase(unit, sex) {
    return this.getActorDescription(unit, sex).arousal
  }

  /**
   * How much arousal does this unit gain from this sex?
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getArousal(unit, sex) {
    const description = this.getActorDescription(unit, sex)
    let base = this.getArousalBase(unit, sex)
    base *= this.getArousalMultiplier(this.getActorName(unit), unit, sex)

    // factors in energy and discomfort
    if (base > 0) {
      const multi = sex.getEnergy(unit) / setup.Sex.ENERGY_MAX
      const depleted_multi = setup.Sex.ENERGY_DEPLETED_AROUSAL_MULTIPLIER

      base = (depleted_multi + (1.0 - depleted_multi) * multi) * base

      // if you're a masochist, gain discomfort as arousal
      if (unit.isMasochistic()) {
        base += this.getDiscomfort(unit, sex) * setup.Sex.DISCOMFORT_MASOCHIST_AROUSAL_MULTIPLIER
      }
    }

    return Math.round(base)
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getDiscomfortBase(unit, sex) {
    return this.getActorDescription(unit, sex).discomfort
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getDiscomfort(unit, sex) {
    const description = this.getActorDescription(unit, sex)
    let base = this.getDiscomfortBase(unit, sex)
    base *= this.getDiscomfortMultiplier(this.getActorName(unit), unit, sex)

    if (base > 0) {
      // tough gets discomfort reduction. nimble gets discomfort increase.
      if (unit.isHasTrait('tough_tough')) {
        base *= setup.Sex.DISCOMFORT_TOUGH_MULTIPLIER
      } else if (unit.isHasTrait('tough_nimble')) {
        base *= setup.Sex.DISCOMFORT_NIMBLE_MULTIPLIER
      }
    }

    return Math.round(base)
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getEnergy(unit, sex) {
    const description = this.getActorDescription(unit, sex)
    let base = this.getActorDescription(unit, sex).energy
    base *= this.getEnergyMultiplier(this.getActorName(unit), unit, sex)

    // Nothing affects discomfort

    return Math.round(base)
  }

  /**
   * Apply effects of this action. This should be called after .describe()
   * @param {setup.SexInstance} sex
   */
  applyOutcomes(sex) {
    setup.RestrictionLib.applyAll(this.getOutcomes(), this)
    const units = this.getUnits()
    for (const unit of units) {
      const arousal = this.getArousal(unit, sex)
      if (arousal) sex.adjustArousal(unit, arousal)

      const discomfort = this.getDiscomfort(unit, sex)
      if (discomfort) sex.adjustDiscomfort(unit, discomfort)

      const energy = this.getEnergy(unit, sex)
      if (energy) sex.adjustEnergy(unit, energy)
    }
  }

  /**
   * Whether this action should be visible in the classroom
   * @returns {boolean}
   */
  isVisibleInClassroom() {
    const desc = this.desc()
    if (!desc) return false

    // should be visible if item, building, and questdone requirements are ok
    const restrictions = this.getRestrictions()
    for (const restriction of restrictions) {
      if (restriction instanceof setup.qresImpl.HasItem ||
        restriction instanceof setup.qresImpl.Building ||
        restriction instanceof setup.qresImpl.HasAnyItemAnywhere ||
        restriction instanceof setup.qresImpl.QuestDone) {
        if (!restriction.isOk(this)) return false
      }
    }

    return true
  }

  /* =============================
      TEXTS
  ============================= */

  /**
   * Classroom description. Leave blank to hide from classroom.
   * @returns {string}
   */
  desc() { return '' }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return ''
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return ''
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    return ''
  }

  /**
   * Returns the parsed string from this raw title.
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  title(sex) {
    return setup.Text.replaceUnitMacros(this.rawTitle(sex), this.getActorObj())
  }

  /**
   * Returns the parsed string from this raw description.
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  description(sex) {
    return setup.Text.replaceUnitMacros(this.rawDescription(sex), this.getActorObj())
  }

  /**
   * Returns the parsed string from this raw story.
   * @param {setup.SexInstance} sex 
   * @returns {string | setup.DOM.Node}
   */
  story(sex) {
    return setup.SexUtil.convert(
      this.rawStory(sex), this.getActorObj(), sex
    )
  }

  /**
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  rep(sex) {
    return `<span data-tooltip="${setup.escapeHtml(this.description(sex))}">${this.title(sex)}</span>`
  }

  /* =============================
      STATIC
  ============================= */

  static getAllSexActions() {
    return Object.values(setup.SexActionClass)
  }

  static ACTOR_NAMES = ['a', 'b', 'c']
}
