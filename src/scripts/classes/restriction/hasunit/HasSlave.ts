// @ts-nocheck


setup.qresImpl.HasSlave = class HasSlave extends setup.Restriction {
  constructor() {
    super()

  }

  static NAME = 'Have at least one slave'
  static PASSAGE = 'RestrictionHasSlave'

  text() {
    return `setup.qres.HasSlave()`
  }


  explain() {
    return `Has a slave`
  }

  isOk() {
    let units = State.variables.company.player.getUnits({job: setup.job.slave})
    return units.length > 0
  }
}
