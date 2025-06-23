
// make one of your units missing, e.g., by being moved into the missingslavers unit group
// and removed from your company, but immediately repurchasable in prospect hall or slave pen.
// i.e., think of this as a hostage situation.
setup.qcImpl.MissingUnitRebuy = class MissingUnitRebuy extends setup.Cost {
  constructor(actor_name, price_mult) {
    super()

    this.actor_name = actor_name
    this.price_mult = price_mult
  }

  static NAME = 'Lose a unit from your company, but repurchasable immediately'
  static PASSAGE = 'CostMissingUnitRebuy'

  text() {
    return `setup.qc.MissingUnitRebuy('${this.actor_name}', ${this.price_mult})`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)

    const stacks = Math.ceil(unit.getSlaveValue() * this.price_mult / 5000)

    if (setup.qcImpl.MissingUnit.checkBlessingOfLife({ unit: unit, stacks: stacks })) return

    if (setup.qcImpl.MissingUnit.checkMissingPlayer(unit, quest)) return

    let job = unit.getJob()

    if (job == setup.job.slaver) {
      unit.addHistory('lost from your company but immediately sold back to your company.', quest)
    }

    State.variables.company.player.removeUnit(unit)
    let rebuy_cost = null
    if (job == setup.job.slave) {
      setup.unitgroup.missingslaves.addUnit(unit)
      rebuy_cost = setup.qc.Slave
    } else if (job == setup.job.slaver) {
      setup.unitgroup.missingslavers.addUnit(unit)
      rebuy_cost = setup.qc.Slaver
    }
    if (rebuy_cost) {
      let cost = rebuy_cost(this.actor_name, /* origin_text = */ '', /* is_mercenary = */ true, /* price mult = */ this.price_mult)
      cost.apply(quest)
    }
  }

  undoApply(quest) {
    throw new Error(`Cannot be undone`)
  }

  explain(quest) {
    return `${this.actor_name} would be gone from your company, but immediately repurchasable for ${this.price_mult} x their value`
  }
}
