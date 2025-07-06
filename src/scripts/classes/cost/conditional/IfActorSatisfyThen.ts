// @ts-nocheck


// DEPRECATED. Use setup.qc.IfThenElse in combination with setup.qres.Actor
setup.qcImpl.IfActorSatisfyThen = class IfActorSatisfyThen extends setup.Cost {
  constructor(actor_name, requirement, effect) {
    super()

    this.actor_name = actor_name
    this.requirement = requirement
    this.effect = effect
  }

  text() {
    return `### DEPRECATED. Use IfThenElse and Actor: restriction. ###`
  }

  isOk(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    if (this.requirement.isOk(unit)) {
      return this.effect.isOk(quest)
    } else {
      return true
    }
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    if (this.requirement.isOk(unit)) {
      return this.effect.apply(quest)
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `If (${this.requirement.explain()}) then ${this.effect.explain()}`
  }
}
