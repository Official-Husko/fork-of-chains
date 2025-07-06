// @ts-nocheck

/**
 * Will be assigned to $bodyshift
 * Tracks units that occupies two bodies or more. This is handled using bodyswaps.
 * 
 * @extends setup.TwineClass
 */

setup.Bodyshift = class Bodyshift extends setup.TwineClass {
  constructor() {
    super()

    /**
     * unit_key: unit_key
     * @type {object}
     */
    this.unit_bodyswap_map = {}
  }

  /**
   * deletes a unit completely from the records.
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    if (unit.key in this.unit_bodyswap_map) {
      // also delete the other body
      const target = this.getBody(unit)
      delete this.unit_bodyswap_map[unit.key]
      target.checkDelete()
    }
  }

  /**
   * Registers a bodyshifter
   * 
   * @param {setup.Unit} unit 
   * @param {setup.Unit} body 
   */
  registerBodyshifter(unit, body) {
    if (unit.key in this.unit_bodyswap_map) throw new Error(`unit ${unit.key} is already a bodyshifter!`)
    this.unit_bodyswap_map[unit.key] = body.key

    // grant the unit bodyshifter perk
    // @ts-ignore
    setup.qc.PerkChoice('unit', setup.trait.perk_unstable_bodyshifter, /* no learn = */ true).apply(
      setup.costUnitHelper(unit)
    )
  }

  /**
   * Get the unit's other body
   * @param {setup.Unit} unit 
   */
  getBody(unit) {
    if (!(unit.key in this.unit_bodyswap_map)) throw new Error(`unit ${unit.key} is not a bodyshifter!`)
    return SugarCube.State.variables.unit[this.unit_bodyswap_map[unit.key]]
  }

  /**
   * Do a bodyshifting
   * @param {setup.Unit} unit 
   */
  bodyshift(unit) {
    if (!(unit.key in this.unit_bodyswap_map)) new Error(`unit ${unit.key} is not a bodyshifter!`)
    const target = this.getBody(unit)
    State.variables.notification.disable()
    setup.qcImpl.Bodyswap.doBodySwap(unit, target)
    State.variables.notification.enable()
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isBodyshifter(unit) {
    return unit.key in this.unit_bodyswap_map
  }

  /**
   * Is this unit the spare body of another unit?
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isSpareBody(unit) {
    return Object.values(this.unit_bodyswap_map).includes(unit.key)
  }
}
