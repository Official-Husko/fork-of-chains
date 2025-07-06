// @ts-nocheck


setup.qresImpl.Building = class Building extends setup.Restriction {
  /**
   * @param {setup.BuildingTemplate | string} template
   * @param {number} [level]
   */
  constructor(template, level) {
    super()

    if (!template) throw new Error(`null template for building restriction`)
  
    this.template_key = setup.keyOrSelf(template)
  
    if (level) {
      this.level = level
    } else {
      this.level = 1
    }
  
    this.IS_BUILDING = true
  }

  text() {
    return `setup.qres.Building(setup.buildingtemplate.${this.template_key})`
  }

  explain() {
    let base = `${setup.buildingtemplate[this.template_key].rep()}`
    if (this.level > 1) base = `Lv. ${this.level}` + base
    return base
  }

  /**
   * @param {*} quest 
   */
  isOk(quest) {
    return State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate[this.template_key],
      this.level
    )
  }
}
