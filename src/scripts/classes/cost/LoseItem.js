
setup.qcImpl.LoseItem = class LoseItem extends setup.Cost {
  /**
   * 
   * @param {setup.Item | string} item 
   * @param {number} [quantity]
   */
  constructor(item, quantity) {
    super()

    if (!item) throw new Error(`Null item pool`)
    this.item_key = setup.keyOrSelf(item)
    this.quantity = quantity || 1
  }

  text() {
    return `setup.qc.LoseItem('${this.item_key}', ${this.quantity})`
  }

  getItem() {
    return setup.item[this.item_key]
  }

  isOk() {
    return State.variables.inventory.countItem(this.getItem()) >= this.quantity
  }

  apply(quest) {
    for (let i = 0; i < this.quantity; ++i) {
      if (State.variables.inventory.isHasItem(this.getItem())) {
        State.variables.inventory.removeItem(this.getItem())
      }
    }
  }

  undoApply() {
    for (let i = 0; i < this.quantity; ++i) {
      State.variables.inventory.addItem(this.getItem())
    }
  }

  explain() {
    return `Lose ${this.quantity}x ${this.getItem().rep()}`
  }
}
