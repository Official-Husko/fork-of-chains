setup.ItemUsable = class ItemUsable extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * description: string
   * value: number
   * restrictions: setup.Restriction[]
   * effects: setup.Cost[]
   * tags: string[]
   * }} args
   */
  constructor({ key, name, description, value, restrictions, effects, tags }) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.usablefreeitem,
      value: value,
      tags: tags,
    })

    // restrictions to use this
    this.restrictions = restrictions

    // whats the effect?
    this.effects = effects
  }

  getPrerequisites() { return this.restrictions }

  isUsable() {
    return setup.RestrictionLib.isPrerequisitesSatisfied(/* obj = */ null, this.restrictions)
  }

  use() {
    setup.RestrictionLib.applyAll(this.effects, this)

    // remove item from inventory after use.
    State.variables.inventory.removeItem(this)
  }

}
