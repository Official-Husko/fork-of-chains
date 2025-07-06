// @ts-nocheck


setup.qresImpl.You = class You extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.You()`
  }

  explain() {
    return `Unit must be you`
  }

  isOk(unit) {
    return unit == State.variables.unit.player
  }
}
