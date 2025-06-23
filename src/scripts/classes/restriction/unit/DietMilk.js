setup.qresImpl.DietMilk = class DietMilk extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.DietMilk()`
  }

  explain() {
    return `On milk-based diet`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isDietMilk()
  }
}
