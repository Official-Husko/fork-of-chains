
setup.qcImpl.AddRandomTraitWithTags = class AddRandomTraitWithTags extends setup.Cost {
  constructor(actor_name, trait_tags) {
    super()

    this.actor_name = actor_name
    this.trait_tags = trait_tags
  }

  text() {
    let texts = this.trait_tags.map(a => `'${a}'`)
    return `setup.qc.AddRandomTraitWithTags('${this.actor_name}', [${texts.join(', ')}])`
  }

  apply(quest) {
    let traits = setup.TraitHelper.getAllTraitsOfTags(this.trait_tags)
    if (!traits.length) return
    let trait = setup.rng.choice(traits)
    return setup.qc.Trait(this.actor_name, trait).apply(quest)
  }

  explain(quest) {
    return `${this.actor_name} gains a random ${this.trait_tags} trait`
  }
}
