// one of your non-busy slave escaped.
setup.qcImpl.EscapedSlaveRandom = class EscapedSlaveRandom extends setup.Cost {
  constructor() {
    super()

  }

  text() {
    return `setup.qc.EscapedSlaveRandom()`
  }

  apply(quest) {
    let slaves = State.variables.company.player.getUnits({ job: setup.job.slave, available: true })
    if (!slaves.length) return  // nobody can escape.
    let escaped = setup.rng.choice(slaves)

    if (setup.qcImpl.MissingUnit.checkMissingPlayer(escaped, quest)) return

    escaped.addHistory('escaped from your company.', quest)
    State.variables.company.player.removeUnit(escaped)
    setup.unitgroup.missingslaves.addUnit(escaped)
  }

  explain(quest) {
    return `A random slave escaped`
  }
}
