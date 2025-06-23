
setup.qresImpl.NotYou = class NotYou extends setup.Restriction {
  constructor() {
    super()

  }

  static NAME = 'Unit cannot be the player character (i.e, cannot be you)'
  static PASSAGE = 'RestrictionNotYou'
  static UNIT = true

  text() {
    return `setup.qres.NotYou()`
  }

  explain() {
    return `Unit cannot be you`
  }

  isOk(unit) {
    return unit != State.variables.unit.player
  }
}
