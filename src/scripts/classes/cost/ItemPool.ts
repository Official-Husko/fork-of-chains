// @ts-nocheck


setup.qcImpl.ItemPool = class ItemPool extends setup.Cost {
  constructor(item_pool) {
    super()

    if (!item_pool) throw new Error(`Null item pool`)
    this.itempool_key = setup.keyOrSelf(item_pool)
  }

  text() {
    return `setup.qc.ItemPool(setup.itempool.${this.itempool_key})`
  }

  getItemPool() { return setup.itempool[this.itempool_key] }

  apply(quest) {
    State.variables.inventory.addItem(this.getItemPool().generateItem())
  }

  explain() {
    return `Gain item from ${this.getItemPool().rep()}`
  }
}
