// @ts-nocheck


setup.qresImpl.IsInjured = class IsInjured extends setup.Restriction {
  constructor(min_duration) {
    super()
    this.min_duration = min_duration
  }

  text() {
    return `setup.qres.IsInjured(${this.min_duration})`
  }

  explain() {
    if (!this.min_duration) {
      return `Unit must be injured`
    } else {
      return `Unit must be injured for at least ${this.min_duration} weeks`
    }
  }

  isOk(unit) {
    if (!this.min_duration) {
      return State.variables.hospital.isInjured(unit)
    } else {
      return State.variables.hospital.getInjury(unit) >= this.min_duration
    }
  }
}
