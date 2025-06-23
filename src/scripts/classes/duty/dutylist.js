// assigned to special variable $dutylist
setup.DutyList = class DutyList extends setup.TwineClass {
  constructor() {
    super()

    this.duty_keys = []
  }

  /**
   * @param {string | setup.DutyTemplate} template_or_key
   * @returns {boolean}
   */
  isHasDuty(template_or_key) {
    return !!this.getDuty(template_or_key)
  }

  /**
   * @param {setup.DutyInstance} duty_instance
   * @returns {setup.DutyInstance}
   */
  addDuty(duty_instance) {
    if (!duty_instance) throw new Error(`Duty instance must not be null`)
    this.duty_keys.push(duty_instance.key)
    setup.notify(`New duty: ${duty_instance.rep()}`)
    return duty_instance
  }

  /**
   * Deletes a duty. Will unassign it first, if necessary.
   * @param {setup.DutyInstance} duty_instance
   */
  removeDuty(duty_instance) {
    if (!this.duty_keys.includes(duty_instance.key)) throw new Error('Trying to remove duty which does not exists!')

    // First, unassign the unit.
    if (duty_instance.getAssignedUnit()) {
      duty_instance.unassignUnit()
    }

    // Remove from duty list
    this.duty_keys = this.duty_keys.filter(duty_key => duty_key != duty_instance.key)

    // Then, remove the duty.
    duty_instance.delete()
  }

  /**
   * @returns {number}
   */
  getOpenDutiesCount() {
    return this.getDuties().filter(duty => !duty.getAssignedUnit()).length
  }

  /**
   * @returns {setup.DutyInstance[]}
   */
  getDuties() {
    return this.duty_keys.map(key => State.variables.duty[key])
  }

  /**
   * @param {string | setup.DutyTemplate} template_or_key
   * @returns {setup.DutyInstance | null}
   */
  getDuty(template_or_key) {
    const template = setup.selfOrObject(template_or_key, setup.dutytemplate)
    const filtered = this.getDuties().filter(duty => duty.getTemplate() == template)
    if (filtered.length) {
      return filtered[0]
    } else {
      return null
    }
  }

  /**
   * @param {string | setup.DutyTemplate} template_or_key
   * @returns {setup.Unit | null}
   */
  getUnitIfAvailable(template_or_key) {
    const duty = this.getDuty(template_or_key)
    if (duty) return duty.getUnitIfAvailable()
    return null
  }

  advanceWeek() {
    const duties = this.getDuties()

    let upkeep = 0
    let replaces = 0
    for (const duty of duties) {
      duty.advanceWeek()
      if (duty.isSpecialistActive()) {
        upkeep += duty.getSpecialistUpkeep()
        replaces += 1
      }
    }

    if (upkeep) {
      setup.notify(`You paid ${setup.DOM.toString(setup.DOM.Util.money(upkeep))} to the contract specialists who are working in lieu of ${replaces} of your duty slavers`)
      State.variables.company.player.substractMoney(upkeep)
    }
    return duties
  }

  /**
   * @returns {boolean}
   */
  isViceLeaderAssigned() {
    const viceleader = State.variables.dutylist.getDuty(setup.dutytemplate.viceleader)
    return !!(viceleader && viceleader.getAssignedUnit())
  }
}
