setup.qresImpl.SexBedchamberUsable = class SexBedchamberUsable extends setup.SexRestriction {
  /**
   * @param {setup.Bedchamber} bedchamber
   */
  constructor(bedchamber) {
    super()
    this.bedchamber_key = setup.keyOrSelf(bedchamber)
  }

  explain() {
    const bedchamber = State.variables.bedchamber[this.bedchamber_key]
    return `${bedchamber.rep()} is usable`
  }

  /**
   * @param {setup.SexInstance} sex
   */
  isOk(sex) {
    const bedchamber = State.variables.bedchamber[this.bedchamber_key]
    return sex.getUnits().includes(bedchamber.getSlaver())
  }
}


