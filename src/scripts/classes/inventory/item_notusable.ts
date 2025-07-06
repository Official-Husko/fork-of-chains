// @ts-nocheck


// effects: [cost1, cost2, cost3, ...]
// actor name is: 'unit'
setup.ItemNotUsable = class ItemNotUsable extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * description: string
   * value: number
   * tags: string[]
   * }} args
   */
  constructor({ key, name, description, value, tags }) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.notusableitem,
      value: value,
      tags: tags,
    })
  }
}
