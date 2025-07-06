// @ts-nocheck


// whether the slave is usable by you at the moment (home and no conflicting requirements)
setup.qresImpl.SlaveUsableByYou = class SlaveUsableByYou extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.SlaveUsableByYou()`
  }

  explain() {
    return `Unit must be usable by you`
  }

  isOk(unit) {
    return unit.isUsableBy(State.variables.unit.player)
  }
}
