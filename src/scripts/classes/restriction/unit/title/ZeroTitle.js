setup.qresImpl.ZeroTitle = class ZeroTitle extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.ZeroTitle()`
  }

  explain() {
    return `Unit does not have any title`
  }

  isOk(unit) {
    return State.variables.titlelist.getAllTitles(unit).length == 0
  }
}
