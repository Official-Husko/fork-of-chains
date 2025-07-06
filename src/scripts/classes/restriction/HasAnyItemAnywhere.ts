// @ts-nocheck

setup.qresImpl.HasAnyItemAnywhere = class HasAnyItemAnywhere extends setup.Restriction {
  /**
   * @param {Array<string | setup.Item>} items 
   */
  constructor(items) {
    super()

    this.item_keys = items.map(item => setup.keyOrSelf(item))
  }

  /**
   * @returns {setup.Item[]}
   */
  getItems() { return this.item_keys.map(key => setup.item[key]) }

  text() {
    return `setup.qres.HasAnyItem([${this.getItems().map(item => `"${item.key}"`).join(', ')}])`
  }

  explain() {
    return `Has any of these items anywhere: ${this.getItems().map(item => item.rep()).join('')}`
  }

  isOk() {
    for (const item of this.getItems()) {
      if (State.variables.inventory.isHasItemAnywhere(item)) return true
    }
    return false
  }
}
