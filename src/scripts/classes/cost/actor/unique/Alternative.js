/* Reset a unit level to level 1 then re-level back to current level/exp */
setup.qcImpl.Alternative = class Alternative extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Alternative('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    const exp = unit.getExp()
    const level = unit.getLevel()

    State.variables.notification.disable()
    unit.resetLevel()
    while (unit.getLevel() < level) unit.levelUp()
    unit.gainExp(exp)
    State.variables.notification.enable()
    setup.notify(`a|Reps skills have been respecced.`, {a: unit})
  }

  explain(quest) {
    return `Respec ${this.actor_name}`
  }
}
