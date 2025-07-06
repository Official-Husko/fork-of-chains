// @ts-nocheck

/**
 * Will be assigned to $leave.
 * Tracks units that are "on leave" or "away" from your company for
 * personal or custom reasons.
 * 
 * @extends setup.TwineClass
 */

setup.Leave = class Leave extends setup.TwineClass {
  constructor() {
    super()

    /**
     * unit_key: {duration_left: int, reason: string}
     * @type {object}
     */
    this.unit_leave_map = {}
  }

  /**
   * deletes a unit completely from the records.
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    if (unit.key in this.unit_leave_map) delete this.unit_leave_map[unit.key]
  }

  /**
   * Marks that this unit is on leave. Duration can be left empty, which means that
   * the unit will remain on leave until $leave.return(unit) is called.
   * @param {setup.Unit} unit 
   * @param {string} reason the reason. <<The unit>> {insert reason here}.
   * @param {number} [duration] How long will this unit be gone? 1 means will return end of the week. Omitted = infinite
   */
  leave(unit, reason, duration) {
    if (unit.key in this.unit_leave_map) {
      throw new Error(`Unit ${unit.key} is already on leave!`)
    }
    if (duration !== undefined && duration <= 0) throw new Error(`duration of leave cannot be 0 or negative`)

    this.unit_leave_map[unit.key] = {
      duration_left: duration,
      reason: reason,
    }
    if (unit.isYourCompany()) {
      let base = ''
      const parsed_reason = this.getLeaveReason(unit)
      if (duration) {
        base = `a|Rep ${parsed_reason}, and will be unavailable for ${duration} weeks.`
      } else {
        base = `a|Rep ${parsed_reason}, and will be unavailable for some time.`
      }
      setup.notify(base, {a: unit})
    }
  }

  /**
   * Forcefully return this unit to your company.
   * @param {setup.Unit} unit 
   */
  return(unit) {
    if (unit.key in this.unit_leave_map) {
      delete this.unit_leave_map[unit.key]
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|is now available again.`, {a: unit})
      }
    }
  }

  /**
   * Is the unit on leave right now?
   * @param {setup.Unit} unit 
   */
  isOnLeave(unit) {
    return unit.key in this.unit_leave_map
  }

  /**
   * @param {setup.Unit} unit 
   */
  isLeaveDurationUnknown(unit) {
    if (!(unit.key in this.unit_leave_map)) return 0
    return !(this.unit_leave_map[unit.key].duration_left)
  }

  /**
   * @param {setup.Unit} unit 
   */
  getRemainingLeaveDuration(unit) {
    if (!(unit.key in this.unit_leave_map)) return 0
    if (this.isLeaveDurationUnknown(unit)) throw new Error(`remaining duration unknown`)
    return this.unit_leave_map[unit.key].duration_left
  }

  /**
   * Why is the unit busy? "The unit" (insert return value here).
   * @param {setup.Unit} unit 
   */
  getLeaveReason(unit) {
    if (!(unit.key in this.unit_leave_map)) throw new Error(`unit not on leave and has no reason`)
    return setup.Text.replaceUnitMacros(this.unit_leave_map[unit.key].reason, {a: unit})
  }

  /**
   * Do end of week updates
   */
  advanceWeek() {
    for (const unit_key of Object.keys(this.unit_leave_map)) {
      if (this.unit_leave_map[unit_key].duration_left) {
        this.unit_leave_map[unit_key].duration_left -= 1
        if (this.unit_leave_map[unit_key].duration_left <= 0) {
          this.return(State.variables.unit[unit_key])
        }
      }
    }
  }
}
