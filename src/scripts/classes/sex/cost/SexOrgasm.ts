// @ts-nocheck

setup.qcImpl.SexOrgasm = class SexOrgasm extends setup.SexCost {
  /**
   * @param {string} actor_name
   */
  constructor(actor_name) {
    super()
    this.actor_name = actor_name
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const unit = action.getActorUnit(this.actor_name)
    this.sex.doOrgasm(unit)
  }

  explain() {
    return `${this.actor_name} orgasms`
  }
}
