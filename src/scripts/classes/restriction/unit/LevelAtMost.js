
setup.qresImpl.LevelAtMost = class LevelAtMost extends setup.Restriction {
  constructor(level) {
    super()

    this.level = level
  }

  static NAME = 'Level at most this much'
  static PASSAGE = 'RestrictionLevelAtMost'
  static UNIT = true

  text() {
    return `setup.qres.LevelAtMost(${this.level})`
  }

  explain() {
    return `Unit's level is at most ${this.level}` 
  }

  isOk(unit) {
    return unit.getLevel() <= this.level
  }
}
