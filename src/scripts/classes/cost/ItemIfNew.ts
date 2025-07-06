// @ts-nocheck

setup.qcImpl.ItemIfNew = class ItemIfNew extends setup.Cost {
  /**
   * @param {setup.Item} item 
   */
  constructor(item) {
    super()

    if (!item) throw new Error(`Null item`)
    this.item_key = setup.keyOrSelf(item)
  }

  text() {
    return `setup.qc.ItemIfNew(setup.item.${this.item_key})`
  }

  getItem() { return setup.item[this.item_key] }

  apply(quest) {
    const item = this.getItem()
    if (!State.variables.inventory.isHasItem(item)) {
      setup.qc.Item(this.getItem()).apply(quest)
    }
  }

  explain() {
    return `Gain ${this.getItem().rep()} unless you already have it`
  }
}
