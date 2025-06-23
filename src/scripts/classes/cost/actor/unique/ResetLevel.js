/* Reset a unit level to level 1 */
setup.qcImpl.ResetLevel = class ResetLevel extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.ResetLevel('${this.actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.resetLevel()
  }

  explain(quest) {
    return `reset the level of ${this.actor_name} to level 1`
  }
}
