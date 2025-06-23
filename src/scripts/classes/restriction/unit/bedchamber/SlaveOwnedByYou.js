
// whether the slave is your own private slave
setup.qresImpl.SlaveOwnedByYou = class SlaveOwnedByYou extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.SlaveOwnedByYou()`
  }

  explain() {
    return `Unit must be owned directly by you in your bedchamber`
  }

  isOk(unit) {
    if (!unit.isSlave()) return false
    let bedchamber = unit.getBedchamber()
    return bedchamber && bedchamber.getSlaver() == State.variables.unit.player
  }
}
