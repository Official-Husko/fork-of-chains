// @ts-nocheck


setup.qcImpl.Item = class Item extends setup.Cost {
  /**
   * @param {setup.Item | string} item 
   * @param {number} [quantity]
   */
  constructor(item, quantity) {
    super()

    if (!item) throw new Error(`Null item`)
    this.item_key = setup.keyOrSelf(item)
    this.quantity = quantity || 1
  }

  text() {
    return `setup.qc.Item(setup.item.${this.item_key}, ${this.quantity})`
  }

  getItem() { return setup.item[this.item_key] }

  apply(quest) {
    for (let i = 0; i < this.quantity; ++i) {
      State.variables.inventory.addItem(this.getItem())
    }
  }

  explain() {
    return `Gain ${this.quantity}x ${this.getItem().rep()}`
  }
}
