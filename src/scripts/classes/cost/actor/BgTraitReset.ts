// @ts-nocheck


// resets background trait to the given trait.
setup.qcImpl.BgTraitReset = class BgTraitReset extends setup.Cost {
  constructor(actor_name, trait) {
    super()

    this.actor_name = actor_name
    this.trait_key = trait.key
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  static NAME = 'Replace Background Trait'
  static PASSAGE = 'CostBgTraitReset'
  static UNIT = true

  text() {
    return `setup.qc.BgTraitReset('${this.actor_name}', setup.trait.${this.trait_key})`
  }

  apply(quest) {
    let trait = setup.trait[this.trait_key]
    let rm1 = setup.qc.RemoveTraitsWithTag(this.actor_name, 'bg')
    let pb = setup.qc.Trait(this.actor_name, trait)
    rm1.apply(quest)
    pb.apply(quest)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name}'s background is reset to ${setup.trait[this.trait_key].rep()}`
  }
}
