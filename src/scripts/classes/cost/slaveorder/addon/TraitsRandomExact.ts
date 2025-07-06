// @ts-nocheck


setup.SlaveOrderAddonImpl.TraitsRandomExact = class TraitsRandomExact extends setup.SlaveOrderAddonBase {
  constructor(traits, num_crit, num_disaster, num_restriction) {
    super()
    if (traits.length < num_crit + num_disaster + num_restriction) {
      throw new Error(`Too few traits for TraitsRandomExact: ${traits} for ${num_crit} crit ${num_disaster} disaster ${num_restriction} restriction`)
    }
    this.trait_keys = traits.map(a => a.key)
    this.num_crit = num_crit
    this.num_disaster = num_disaster
    this.num_restriction = num_restriction
  }

  text() {
    let texts = this.trait_keys.map(a => `setup.trait.${a}`)
    return `setup.SlaveOrderAddon.TraitsRandomExact([<br/>${texts.join(',<br/>')}<br/>], ${this.num_crit}, ${this.num_disaster}, ${this.num_restriction})`
  }

  explain() {
    let traits = this.trait_keys.map(a => setup.trait[a].rep())
    return `Randomly: select ${this.num_crit} critical, ${this.num_disaster} disaster, and ${this.num_restriction} must-have traits from ${traits.join('')}`
  }


  apply(slave_order) {
    let traits = this.trait_keys.map(a => setup.trait[a])
    setup.rng.shuffleArray(traits)
    let criteria = slave_order.criteria
    for (let i = 0; i < this.num_crit; ++i) {
      criteria.crit_trait_map[traits[i].key] = true
    }
    for (let i = 0; i < this.num_disaster; ++i) {
      criteria.disaster_trait_map[traits[this.num_crit + i].key] = true
    }
    for (let i = 0; i < this.num_restriction; ++i) {
      criteria.restrictions.push(setup.qres.TraitExact(traits[this.num_crit + this.num_disaster + i]))
    }
  }
}
