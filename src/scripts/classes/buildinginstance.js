
setup.BuildingInstance = class BuildingInstance extends setup.TwineClass {
  constructor(template) {
    super()

    this.key = State.variables.BuildingInstance_keygen
    State.variables.BuildingInstance_keygen += 1

    this.template_key = template.key
    this.level = 0   // upgrade level
    this.fort_key = null

    if (this.key in State.variables.buildinginstance) throw new Error(`Building ${this.key} already exists`)
    State.variables.buildinginstance[this.key] = this

    this.upgrade()
  }

  delete() { delete State.variables.buildinginstance[this.key] }


  getName() {
    return this.getTemplate().getName()
  }


  getFort() { return State.variables.fort[this.fort_key] }


  getLevel() { return this.level }


  /**
   * @returns {setup.BuildingTemplate}
   */
  getTemplate() {
    return setup.buildingtemplate[this.template_key]
  }


  isHasUpgrade() {
    let template = this.getTemplate()
    return (this.level < template.getMaxLevel())
  }


  getUpgradeCost() {
    let template = this.getTemplate()
    return template.getCost(this.level)
  }


  getUpgradePrerequisite() {
    let template = this.getTemplate()
    return template.getPrerequisite(this.level)
  }


  isUpgradable() {
    let template = this.getTemplate()
    if (this.level >= template.getMaxLevel()) return false // max level already
    return template.isBuildable(this.level)
  }


  /**
   * @returns {setup.RoomInstance | null}
   */
  getUpgradeRoom() {
    const template = this.getTemplate().getSubRoomTemplate()
    if (template) {
      return new setup.RoomInstance({ template: template })
    } else {
      return null
    }
  }

  /**
   * @param {setup.RoomInstance} [room]
   * @returns {setup.RoomInstance | null}
   */
  upgrade(room) {
    if (!room && this.getLevel() > 0) {
      room = this.getUpgradeRoom()
    }

    if (this.level) State.variables.statistics.add('buildings_upgraded', 1)

    State.variables.fort.player.addUpgrade()

    let template = this.getTemplate()
    template.payCosts(this.level)
    this.level += 1

    let on_build = template.getOnBuild()
    if (on_build && on_build.length >= this.level) {
      setup.RestrictionLib.applyAll(on_build[this.level - 1], this)
    }

    if (this.level > 1) {
      setup.notify(`<<successtext 'Upgraded'>>: ${this.rep()} to level ${this.level}`)
    }

    return room
  }


  downgrade() {
    if (this.level <= 1) throw new Error(`Level too low!`)
    this.level -= 1

    State.variables.fort.player.removeUpgrade()

    setup.notify(`<<dangertext 'Downgraded'>>: ${this.rep()} to level ${this.level}`)
  }


  getTitleRep() {
    return this.getName()
  }


  rep() {
    return setup.repMessage(this, 'buildingcardkey')
  }

}
