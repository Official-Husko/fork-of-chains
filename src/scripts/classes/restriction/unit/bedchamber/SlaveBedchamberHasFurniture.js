
setup.qresImpl.SlaveBedchamberHasFurniture = class SlaveBedchamberHasFurniture extends setup.Restriction {
  constructor(item) {
    super()

    if (!item) throw new Error(`Item null in SlaveBedchamberHasFurniture`)
    this.item_key = item.key
  }

  text() {
    return `setup.qres.SlaveBedchamberHasFurniture(setup.item.${this.item_key})`
  }

  getItem() { return setup.item[this.item_key] }

  explain() {
    return `Unit is a slave in a bedchamber with ${this.getItem().rep()}`
  }

  isOk(unit) {
    let bedchamber = unit.getBedchamber()
    if (!bedchamber) return false
  
    let item = this.getItem()
    return (item instanceof setup.Furniture) && bedchamber.getFurniture(item.getSlot()) == item
  }
}
