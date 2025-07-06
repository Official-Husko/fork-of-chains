// @ts-nocheck


setup.qresImpl.LevelAtLeast = class LevelAtLeast extends setup.Restriction {
  constructor(level) {
    super()

    this.level = level
  }

  static NAME = 'Level at least this much'
  static PASSAGE = 'RestrictionLevelAtLeast'
  static UNIT = true

  text() {
    return `setup.qres.LevelAtLeast(${this.level})`
  }

  explain() {
    return `Unit's level is at least ${this.level}` 
  }

  isOk(unit) {
    return unit.getLevel() >= this.level
  }
}
