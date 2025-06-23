// A copies B's body, but not the other way around
setup.qcImpl.BodyswapOneDirection = class BodyswapOneDirection extends setup.Cost {
  constructor(actor_name, target_actor_name) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
  }

  text() {
    return `setup.qc.BodyswapOneDirection('${this.actor_name}', '${this.target_actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    setup.qcImpl.Bodyswap.doBodySwap(unit, target, /* force bodyswap = */ false, /* one dir = */ true)
    unit.addHistory(`copied ${target.getName()}'s body`)
  }

  explain(quest) {
    return `${this.actor_name} copies ${this.target_actor_name}'s body`
  }
}
