
setup.qresImpl.NoItem = class NoItem extends setup.Restriction {
  constructor(item) {
    super()

    if (!item) throw new Error(`Item null in NoItem`)
    this.item_key = item.key
  }

  static NAME = 'Do not have an item'
  static PASSAGE = 'RestrictionNoItem'

  text() {
    return `setup.qres.NoItem(setup.item.${this.item_key})`
  }

  getItem() { return setup.item[this.item_key] }

  explain() {
    return `Do not have ${this.getItem().rep()}`
  }

  isOk() {
    return !State.variables.inventory.isHasItem(this.getItem())
  }
}
