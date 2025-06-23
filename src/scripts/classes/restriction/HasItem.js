
setup.qresImpl.HasItem = class HasItem extends setup.Restriction {
  constructor(item) {
    super()

    if (!item) throw new Error(`Item null in HasItem`)
    this.item_key = setup.keyOrSelf(item)
  }

  text() {
    return `setup.qres.HasItem(setup.item.${this.item_key})`
  }

  getItem() { return setup.item[this.item_key] }

  explain() {
    return `${this.getItem().rep()}`
  }

  isOk() {
    return State.variables.inventory.isHasItem(this.getItem())
  }
}
