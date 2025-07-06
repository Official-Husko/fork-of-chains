// @ts-nocheck


// remove all traits with a particular tag
setup.qcImpl.RemoveTraitsWithTag = class RemoveTraitsWithTag extends setup.Cost {
  constructor(actor_name, trait_tag) {
    super()

    this.actor_name = actor_name
    this.trait_tag = trait_tag
  }

  text() {
    return `setup.qc.RemoveTraitsWithTag('${this.actor_name}', '${this.trait_tag}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.removeTraitsWithTag(this.trait_tag)
  }

  explain(quest) {
    return `${this.actor_name} lose all ${this.trait_tag} traits`
  }
}
