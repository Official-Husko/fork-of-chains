// @ts-nocheck


// slave must be assigned to a bedchamber
setup.qresImpl.SlaveHasBedchamber = class SlaveHasBedchamber extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.SlaveHasBedchamber()`
  }

  explain() {
    return `Unit must be a slave serving in some bedchamber`
  }

  isOk(unit) {
    if (!unit.isSlave()) return false
    return unit.getBedchamber()
  }
}
