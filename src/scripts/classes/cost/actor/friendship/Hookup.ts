// @ts-nocheck

/**
 * Hooks up two units as lovers, breaking their existing lovers if any
 */
setup.qcImpl.Hookup = class Hookup extends setup.Cost {
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
    return `setup.qc.Hookup('${this.actor_name}', '${this.target_actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    if (unit.getLover() == target) {
      // if already lovers, do nothing
      return
    }

    if (unit.getLover()) {
      State.variables.friendship.breakup(unit, unit.getLover())
    }

    if (target.getLover()) {
      State.variables.friendship.breakup(target, target.getLover())
    }

    State.variables.friendship.hookup(unit, target)
  }

  explain(quest) {
    return `${this.actor_name} and ${this.target_actor_name} becomes lovers, breaking up with their previous ones`
  }
}
