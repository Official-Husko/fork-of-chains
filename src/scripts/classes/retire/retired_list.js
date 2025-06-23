// special. Will be assigned to State.variables.retiredlist

setup.RetiredList = class RetiredList extends setup.TwineClass {
  constructor() {
    super()

    // dictionary of unit keys to their living
    /**
     * @type {Object<number | string, string>}
     */
    this.unit_key_to_living_key = {}
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isRetired(unit) {
    return unit.key in this.unit_key_to_living_key
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Living}
   */
  getLiving(unit) {
    if (!unit.isRetired()) throw new Error(`Can only get living of retired units, not ${unit.getName()}!`)
    return setup.living[this.unit_key_to_living_key[unit.key]]
  }

  /**
   * @returns {setup.Unit[]}
   */
  getUnits() {
    return Object.keys(this.unit_key_to_living_key).map(key => State.variables.unit[key])
  }

  /**
   * @param {setup.Unit} unit 
   */
  retire(unit) {
    if (unit.isRetired()) throw new Error(`Unit ${unit.getName()} already retired!`)
    if (unit.getJob() != setup.job.slaver) throw new Error(`Can only retire slavers, not ${unit.getName()}!`)

    // first remove from company
    State.variables.company.player.removeUnit(unit)

    // then retire properly by giving them a living
    const living = setup.Living.getLiving(unit)
    this.unit_key_to_living_key[unit.key] = living.key

    // finally, add history
    unit.addHistory('retired.')
    unit.resetCache()
  }

  /**
   * Remove unit from retired list. Can go in two ways. If not followed up, unit is just gone. Otherwise,
   * can put unit to slaver pool back, for example.
   * 
   * @param {setup.Unit} unit 
   */
  unretire(unit) {
    if (!unit.isRetired()) throw new Error(`Cannot retire ${unit.getName()} because they are not retired`)
    delete this.unit_key_to_living_key[unit.key]
    unit.checkDelete()
  }

  /**
   * Returns the maximum number of units that your guest rooms can track
   * 
   * @returns {number}
   */
  getMaxTrackedUnits() {
    let level
    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.inn)) {
      level = State.variables.fort.player.getBuilding(setup.buildingtemplate.inn).getLevel()
    } else {
      level = 0
    }
    return level * setup.FORT_GUEST_ROOM_CAPACITY_PER_LEVEL
  }

  /**
   * Whether this particular unit can be retired
   * 
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanRetire(unit) {
    if (unit.isRetired()) {
      // already retired
      return false
    }

    if (unit.isInjured()) {
      // injured unit cannot retire
      return false
    }

    if (this.getUnits().length >= this.getMaxTrackedUnits()) {
      // already too many retirees
      return false
    }

    if (!unit.isHasTrait(setup.trait.join_senior)) {
      // only senior slavers can retire
      return false
    }

    return unit.isCanBeDismissed()
  }
}

