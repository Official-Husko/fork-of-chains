// @ts-nocheck


/* Purify a unit, restoring skin trait of the given class, or a random one if class is not given */
setup.qcImpl.Purify = class Purify extends setup.Cost {
  constructor(actor_name, trait_tag) {
    super()

    if (trait_tag && !setup.TraitHelper.getAllTraitsOfTags([trait_tag]).length) {
      throw new Error(`Trait tag ${trait_tag} invalid for purification.`)
    }

    this.actor_name = actor_name
    this.trait_tag = trait_tag
  }

  static NAME = 'Purify unit from a corruption'
  static PASSAGE = 'CostPurify'
  static UNIT = true

  text() {
    if (this.trait_tag) {
      return `setup.qc.Purify('${this.actor_name}', ${this.trait_tag})`
    } else {
      return `setup.qc.Purify('${this.actor_name}')`
    }
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.purify(this.trait_tag)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `purify ${this.actor_name}'s ${this.trait_tag || "random aspect"}`
  }
}
