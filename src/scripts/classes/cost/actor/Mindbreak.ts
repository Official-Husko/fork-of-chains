// @ts-nocheck

// mindbreak this unit
setup.qcImpl.Mindbreak = class Mindbreak extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Mindbreak('${this.actor_name}')`
  }

  apply(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    if (!unit.isMindbroken()) {
      setup.qc.RemoveTraitsWithTag(this.actor_name, 'training').apply(quest)
      setup.qc.TraitReplace(this.actor_name, setup.trait.training_mindbreak).apply(quest)
    }
  }

  explain(quest) {
    return `${this.actor_name} is mindbroken`
  }
}
