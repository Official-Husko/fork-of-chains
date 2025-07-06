// @ts-nocheck

// slave must not be assigned to a bedchamber
setup.qresImpl.SlaveNoBedchamber = class SlaveNoBedchamber extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.SlaveNoBedchamber()`
  }

  explain() {
    return `Unit must NOT be a slave serving in some bedchamber`
  }

  isOk(unit) {
    if (!unit.isSlave()) return false
    return !unit.getBedchamber()
  }
}
