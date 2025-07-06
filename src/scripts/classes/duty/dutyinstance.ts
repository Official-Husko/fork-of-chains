// @ts-nocheck

/**
 * An instance of a duty. Sometimes, this class is overridden to provide for a more complex behavior.
 */
setup.DutyInstance = class DutyInstance extends setup.TwineClass {
  /**
   * @param {{
   * duty_template: setup.DutyTemplate
   * }} param0 
   */
  constructor({
    duty_template,
  }) {
    super()

    this.key = State.variables.Duty_keygen
    State.variables.Duty_keygen += 1

    this.unit_key = null

    this.template_key = duty_template.key

    // Whether unit on this duty can still go on quests.
    this.is_can_go_on_quests_auto = false

    // Whether this duty remains active when unit is not available, at an upkeep.
    // Only for slaver duties.
    this.is_specialist_enabled = false

    if (this.key in State.variables.duty) {
      throw new Error(`Duplicate ${this.key} in duties`)
    }
    State.variables.duty[this.key] = this
  }

  /**
   * @param {setup.Unit} [unit]
   */
  resetCache(unit) {
    unit.resetCache()
    if (this.getTemplate() == setup.dutytemplate.viceleader) {
      State.variables.unit.player.resetCache()
    } else if (this instanceof setup.DutyInstanceBedchamberSlave) {
      this.getBedchamber().getSlaver().resetCache()
    }
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.getTemplate().getName()
  }

  delete() {
    delete State.variables.duty[this.key]
  }

  /**
   * @returns {setup.DutyTemplate}
   */
  getTemplate() {
    return setup.dutytemplate[this.template_key]
  }

  /**
   * @returns {boolean}
   */
  isSpecialistEnabled() { return !!this.is_specialist_enabled }

  toggleIsSpecialistEnabled() {
    if (!this.getTemplate().isCanReplaceWithSpecialist()) throw new Error(`Duty ${this.getTemplate().key} cannot be replaced with specialists`)
    this.is_specialist_enabled = !this.is_specialist_enabled
  }

  /**
   * @returns {boolean}
   */
  isCanGoOnQuestsAuto() {
    return !!this.is_can_go_on_quests_auto
  }

  toggleIsCanGoOnQuestsAuto() {
    this.is_can_go_on_quests_auto = !this.is_can_go_on_quests_auto
  }

  /**
   * @param {string} [tooltip] 
   * @param {boolean} [big] 
   * @return {string}
   */
  getImageRep(tooltip, big) {
    const template = this.getTemplate()
    const tooltip_content = tooltip ? `<<dutycardkey '${this.key}' 1>>` : undefined
    return '<span class="' + template.getCssClass() + (big ? ' big' : '') + '">' + setup.repImg({
      imagepath: template.getImage(),
      tooltip_content: tooltip_content,
    }) + '</span>'
  }

  /**
   * @returns {string}
   */
  rep() {
    return setup.repMessage(this, 'dutycardkey', undefined, this.getImageRep()) + "&nbsp;" +
      setup.repMessage(this, 'dutycardkey')
  }

  /**
   * @returns {string}
   */
  repIcon() {
    return setup.repMessage(this, 'dutycardkey', undefined, this.getImageRep())
  }

  // compute chance for non-prestige duties, compute prestige otherwise.
  /**
   * @returns {number}
   */
  computeChance() {
    if (!this.isActive()) return 0
    return this.getTemplate().computeChanceForUnit(this.getAssignedUnit())
  }

  /**
   * @returns {'none' | 'proc' | 'crit'}
   */
  getProc() {
    // return 'none', 'proc', or 'crit'
    let chance = this.computeChance()
    if (Math.random() < (chance - 1.0)) return 'crit'
    if (Math.random() < chance) return 'proc'
    return 'none'
  }

  /**
   * Returns the unit assigned to this duty.
   * 
   * @returns {setup.Unit | null}
   */
  getAssignedUnit() {
    if (!this.unit_key) return null
    return State.variables.unit[this.unit_key]
  }

  /**
   * Returns the unit assigned to this duty, but only if the unit is available.
   * If you want the unit regardless, use getAssignedUnit
   * 
   * @returns {setup.Unit | null}
   */
  getUnitIfAvailable() {
    if (!this.isActive() || this.isSpecialistActive()) return null
    return this.getAssignedUnit()
  }

  /**
   * Whether this duty is active or not
   * @returns {boolean}
   */
  isActive() {
    const unit = this.getAssignedUnit()

    // nobody assigned
    if (!unit) return false

    // assigned, but unit is busy, and no temproary replacement unit
    if (!unit.isAvailable() && !this.isSpecialistActive()) return false

    return true
  }

  /**
   * Whether contract specialist is replacing the unit this week.
   * @returns {boolean}
   */
  isSpecialistActive() {
    const unit = this.getAssignedUnit()
    if (!unit) return false
    if (!this.isSpecialistEnabled()) return false
    return !unit.isAvailable()
  }

  /**
   * @returns {number}
   */
  getSpecialistUpkeep() {
    const unit = this.getAssignedUnit()
    let upkeep = setup.DUTY_SPECIALIST_WEEKLY_UPKEEP
    if (unit && unit.isHasTrait('perk_specialist')) {
      upkeep = Math.round((1.0 - setup.PERK_SPECIALIST_REDUCTION) * upkeep)
    }
    return upkeep
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanUnitAssign(unit) {
    if (!unit.isAvailable()) return false
    if (unit.getDuty()) return false
    return setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, this.getTemplate().getUnitRestrictions())
  }

  /**
   * @param {setup.Unit} unit 
   */
  assignUnit(unit) {
    if (this.unit_key) {
      throw new Error(`Duty ${this.key} already have unit and cannot be reassigned`)
    }

    this.unit_key = unit.key
    unit.duty_key = this.key

    this.getTemplate().onAssign(this, unit)

    this.resetCache(unit)
  }

  unassignUnit() {
    const unit = this.getAssignedUnit()

    this.getTemplate().onUnassign(this, unit)

    this.unit_key = null
    unit.duty_key = null

    this.resetCache(unit)
  }

  advanceWeek() {
    this.getTemplate().advanceWeek(this)
  }

  /**
   * returns: 'your marketer xxx', or 'xxx's replacement as marketer'
   * @returns {string}
   */
  repYourDutyRep() {
    if (!this.getAssignedUnit()) {
      throw new Error(`No unit on duty ${this.getName()}`)
    }

    const rep = this.rep()
    let t
    if (this.isSpecialistActive()) {
      t = [
        `the specialist substituting a|rep as your ${rep}`,
        `a|reps temporary replacement as your ${rep}`,
        `the specialist working as a temporary replacement for your ${rep} a|rep`,
      ]
    } else {
      t = [
        `your ${rep} a|rep`,
      ]
    }
    return setup.Text.replaceUnitMacros(t, { a: this.getAssignedUnit() })
  }

  /**
   * Default sort for duties
   * @param {setup.DutyInstance} duty1 
   * @param {setup.DutyInstance} duty2 
   */
  static Cmp(duty1, duty2) {
    const type1 = duty1.getTemplate().getType()
    const type2 = duty2.getTemplate().getType()
    if (type1 == type2) {
      return duty1.getName().localeCompare(duty2.getName())
    }

    const types = Object.keys(setup.DutyTemplate.TYPE)
    return types.indexOf(type1) - types.indexOf(type2)
  }

  /**
   * @param {string[]} types
   * @param {boolean} reverse 
   * @returns {Function}
   */
  static DutyChanceCmpGen = function (types, reverse) {
    /**
     * @param {setup.DutyInstance} duty1 
     * @param {setup.DutyInstance} duty2 
     */
    return (duty1, duty2) => {
      const type1 = duty1.getTemplate().getType()
      const type2 = duty2.getTemplate().getType()
      const ch1 = types.includes(type1) ? duty1.computeChance() : (reverse ? -1 : setup.INFINITY)
      const ch2 = types.includes(type2) ? duty2.computeChance() : (reverse ? -1 : setup.INFINITY)
      if (reverse) {
        return ch2 - ch1
      } else {
        return ch1 - ch2
      }
    }
  }
}
