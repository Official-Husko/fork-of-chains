// @ts-nocheck


// make one of your units missing, e.g., by being moved into the missingslavers unit group
// and removed from your company.
setup.qcImpl.MissingUnitForever = class MissingUnitForever extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  static NAME = 'Lose a unit from your company forever'
  static PASSAGE = 'CostMissingUnitForever'

  text() {
    return `setup.qc.MissingUnitForever('${this.actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)

    if (setup.qcImpl.MissingUnit.checkMissingPlayer(unit, quest)) return

    unit.addHistory('went missing forever.', quest)
    State.variables.company.player.removeUnit(unit)
    setup.unitgroup.none.addUnit(unit)

    if (!unit.isYou()) {
      setup.notify('You will never see a|rep ever again...', { a: unit })
    }
  }

  undoApply(quest) {
    throw new Error(`Cannot be undone`)
  }

  explain(quest) {
    return `${this.actor_name} would be gone FOREVER and will never be seen again...`
  }
}
