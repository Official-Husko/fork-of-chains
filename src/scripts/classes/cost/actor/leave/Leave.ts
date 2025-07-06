// @ts-nocheck


setup.qcImpl.Leave = class Leave extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} reason 
   * @param {number} [duration]  (omitted = infinite)
   */
  constructor(actor_name, reason, duration) {
    super()

    this.actor_name = actor_name
    this.reason = reason
    this.duration = duration
  }

  text() {
    return `setup.qc.Leave('${this.actor_name}', "${setup.escapeJsString(this.reason)}", ${this.duration})`
  }

  /**
   * @param {object} quest 
   */
  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.leave.leave(unit, this.reason, this.duration)
  }

  /**
   * @param {object} quest 
   */
  explain(quest) {
    const reason = this.reason
    if (this.duration) {
      return `${this.actor_name} will be on leave from the company for ${this.duration} weeks because ${this.actor_name} ${reason}`
    } else {
      return `${this.actor_name} will be on leave from the company because ${this.actor_name} ${reason}`
    }
  }
}
