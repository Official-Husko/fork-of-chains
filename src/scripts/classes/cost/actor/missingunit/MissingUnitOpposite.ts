// @ts-nocheck


// make one of your units missing, e.g., by being moved into the missingslavers unit group
// and removed from your company. In this case, the unit will be re-hired,
// but ON THE OPPOSITE POOL. E.g., a slaver becomes a slave, while a slave becomes a slaver.
setup.qcImpl.MissingUnitOpposite = class MissingUnitOpposite extends setup.Cost {
  constructor(actor_name, origin_text) {
    super()

    this.actor_name = actor_name
    this.origin_text = origin_text
  }

  text() {
    return `setup.qc.MissingUnitOpposite('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)

    if (setup.qcImpl.MissingUnit.checkMissingPlayer(unit, quest)) return

    let job = unit.getJob()
    if (job == setup.job.slaver) {
      unit.addHistory('switched professions from slaver to slave.', quest)
    } else if (job == setup.job.slave) {
      unit.addHistory('switched professions from slave to slaver.', quest)
      setup.qc.AddTitle(this.actor_name, 'ex_slave').apply(quest)
    }
    State.variables.company.player.removeUnit(unit)
    let rebuy_cost = null
    if (job == setup.job.slaver) {
      setup.unitgroup.missingslaves.addUnit(unit)
      rebuy_cost = setup.qc.Slave
    } else if (job == setup.job.slave) {
      setup.unitgroup.missingslavers.addUnit(unit)
      rebuy_cost = setup.qc.Slaver
    }
    if (rebuy_cost) {
      let cost = rebuy_cost(this.actor_name, this.origin_text)
      cost.apply(quest)
    }
    unit.resetWeeksWithCompany()
  }

  explain(quest) {
    return `${this.actor_name} would be gone from your company, and immediately available as the opposite of your job (i.e., slave becomes slaver, slaver becomes slave), with background: ${this.origin_text}`
  }
}
