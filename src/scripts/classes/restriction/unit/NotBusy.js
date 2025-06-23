
setup.qresImpl.NotBusy = class NotBusy extends setup.Restriction {
  constructor() {
    super()

  }

  static NAME = 'Unit not busy'
  static PASSAGE = 'RestrictionNotBusy'
  static UNIT = true

  text() {
    return `setup.qres.NotBusy()`
  }

  explain() {
    return `Unit is [<<successtextlite 'IDLE'>>]`
  }

  isOk(unit) {
    return !unit.isBusy()
  }
}
