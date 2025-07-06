// @ts-nocheck

setup.SexPlannerClass = {}

/**
 * Abstract class. Creates a plan sequence
 */
setup.SexPlanner = class SexPlanner extends setup.TwineClassCustom {
  /**
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
  getContainer() { return `setup.SexPlannerClass` }

  /**
   * @returns {setup.SexPlan}
   */
  getNextPlan() {
    return null
  }
}
