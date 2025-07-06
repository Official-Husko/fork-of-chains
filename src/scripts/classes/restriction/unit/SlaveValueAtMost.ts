// @ts-nocheck


setup.qresImpl.SlaveValueAtMost = class SlaveValueAtMost extends setup.Restriction {
  constructor(slavevalue) {
    super()

    this.slavevalue = slavevalue
  }

  static NAME = 'Slave value is at most this much'
  static PASSAGE = 'RestrictionSlaveValueAtMost'
  static UNIT = true

  text() {
    return `setup.qres.SlaveValueAtMost(${this.slavevalue})`
  }

  explain() {
    return `Unit's slave value is at most ${this.slavevalue}` 
  }

  isOk(unit) {
    return unit.getSlaveValue() <= this.slavevalue
  }
}
