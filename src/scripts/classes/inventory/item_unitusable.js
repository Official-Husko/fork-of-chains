// effects: [cost1, cost2, cost3, ...]
// actor name is: 'unit'
setup.ItemUnitUsable = class ItemUnitUsable extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * description: string
   * value: number
   * unit_restrictions: setup.Restriction[]
   * effects: setup.Cost[]
   * tags: string[]
   * }} args
   */
  constructor({ key, name, description, value, unit_restrictions, effects, tags }) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.usableitem,
      value: value,
      tags: tags,
    })

    // who can this be used on?
    this.unit_restrictions = unit_restrictions

    // whats the effect?
    this.effects = effects
  }

  getActorUnit(actor_name) {
    if (actor_name != 'unit') throw new Error(`Unknown actor name ${actor_name}`)
    if (!this.temporary_unit_key) throw new Error(`temporary unit not set`)
    return State.variables.unit[this.temporary_unit_key]
  }

  getUnitRestrictions() {
    return this.unit_restrictions
  }

  isUsable() {
    return true
  }

  isUsableOn(unit) {
    return setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, this.getUnitRestrictions())
  }

  use(unit) {
    this.temporary_unit_key = unit.key
    setup.RestrictionLib.applyAll(this.effects, this)
    delete this.temporary_unit_key

    // remove item from inventory after use.
    State.variables.inventory.removeItem(this)
  }

  static make_perk_potions() {
    const potions = {}

    for (const trait of setup.TraitHelper.getAllTraitsOfTags(['perkstandard']).filter(
      trait => !trait.getTags().includes('perkbasic'))) {

      /**
       * @type {setup.Perk}
       */ // @ts-ignore
      const perk = trait

      /**
       * @type {setup.Restriction[]}
       */
      const restrictions = [
        setup.qres.Job(setup.job.slaver),
        setup.qres.Not(setup.qres.HasPerkChoice(perk)),
      ]
      restrictions.push(...perk.getPerkChoiceRestrictions())

      const pot = new setup.ItemUnitUsable({
        key: `potion_${perk.key}`,
        name: `Potion of ${setup.title_case(perk.getName())}`,
        description: `Make a unit able to learn the <<rep setup.trait.${perk.key}>> perk.`,
        value: setup.PERK_POTION_STANDARD_PRICE,
        unit_restrictions: restrictions,
        effects: [
          setup.qc.PerkChoice('unit', perk, /* no learn = */ true),
        ],
        tags: [],
      })
      potions[pot.key] = 1
    }

    new setup.ItemPool(
      'perk_potions',
      potions,
    )
  }
}
