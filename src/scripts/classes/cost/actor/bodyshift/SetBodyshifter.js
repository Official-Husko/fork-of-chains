
// make a unit a bodyshifter, with target as its clone body
setup.qcImpl.SetBodyshifter = class SetBodyshifter extends setup.Cost {
  constructor(actor_name, target_actor_name) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
  }

  text() {
    return `setup.qc.SetBodyshifter('${this.actor_name}', '${this.target_actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    State.variables.bodyshift.registerBodyshifter(unit, target)
  }

  explain(quest) {
    return `${this.actor_name} becomes a bodyshifter, with ${this.target_actor_name} as its other body`
  }
}
