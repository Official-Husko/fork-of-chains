setup.qresImpl.FortLevelAtLeast = class FortLevelAtLeast extends setup.Restriction {
  constructor(level) {
    super()

    this.level = level
  }

  text() {
    return `setup.qres.FortLevelAtLeast(${this.level})`
  }

  isOk(template) {
    const level = State.variables.fortgrid.getTotalExpansions()
    return level >= this.level
  }

  explain() {
    return `Have expanded fort at least ${this.level} times`
  }
}
