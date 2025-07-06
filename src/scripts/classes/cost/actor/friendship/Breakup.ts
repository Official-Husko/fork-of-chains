// @ts-nocheck

/**
 * Breaks up two units if they were lovers.
 */
setup.qcImpl.Breakup = class Breakup extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} target_actor_name 
   */
  constructor(actor_name, target_actor_name) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
  }

  text() {
    return `setup.qc.Breakup('${this.actor_name}', '${this.target_actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    if (unit.getLover() == target) {
      State.variables.friendship.breakup(unit, target)
    }
  }

  explain(quest) {
    return `${this.actor_name} and ${this.target_actor_name} breaks up, if they were lovers`
  }
}
