// @ts-nocheck


setup.qresImpl.SlaveValueAtLeast = class SlaveValueAtLeast extends setup.Restriction {
  constructor(slavevalue) {
    super()

    this.slavevalue = slavevalue
  }

  static NAME = 'Slave value is at least this much'
  static PASSAGE = 'RestrictionSlaveValueAtLeast'
  static UNIT = true

  text() {
    return `setup.qres.SlaveValueAtLeast(${this.slavevalue})`
  }

  explain() {
    return `Unit's slave value is at least ${this.slavevalue}` 
  }

  isOk(unit) {
    return unit.getSlaveValue() >= this.slavevalue
  }
}
