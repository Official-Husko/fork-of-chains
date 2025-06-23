
setup.qresImpl.NotInjured = class NotInjured extends setup.Restriction {
  constructor() {
    super()

  }

  static UNIT = true

  text() {
    return `setup.qres.NotInjured()`
  }

  explain() {
    return `Unit must NOT be injured`
  }

  isOk(unit) {
    return !State.variables.hospital.isInjured(unit)
  }
}
