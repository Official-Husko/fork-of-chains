// @ts-nocheck


setup.qcImpl.Return = class Return extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Return('${this.actor_name}')`
  }

  /**
   * @param {object} quest 
   */
  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.leave.return(unit)
  }

  /**
   * @param {object} quest 
   */
  explain(quest) {
    return `${this.actor_name} will return from leave`
  }
}
