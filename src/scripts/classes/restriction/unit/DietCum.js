setup.qresImpl.DietCum = class DietCum extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.DietCum()`
  }

  explain() {
    return `On cum-based diet`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isDietCum()
  }
}
