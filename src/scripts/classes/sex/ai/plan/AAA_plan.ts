// @ts-nocheck

setup.SexPlanClass = {}

/**
 * Abstract class. Governs a particular plan for a unit.
 */
setup.SexPlan = class SexPlan extends setup.TwineClassCustom {
  /**
   * Create an AI for this unit.
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   */
  constructor(unit, sex) {
    super()
    /**
     * @type {setup.Unit}
     */
    this.unit = unit
    /**
     * @type {setup.SexInstance}
     */
    this.sex = sex
  }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexPlanClass` }

  // select an action out of the given choice, if any compatible plan is found.
  /**
   * @param {setup.SexAction[]} actions 
   * @returns {setup.SexAction | null}
   */
  selectAction(actions) {
    return null
  }

  /**
   * Whether the plan has been completed or aborted, and a new plan should be taken
   * @returns {boolean}
   */
  isComplete() {
    return false
  }
}
