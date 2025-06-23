setup.ItemTechnology = class ItemTechnology extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * description: string
   * tags: string[]
   * }} args
   */
  constructor({ key, name, description, tags }) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.technologyitem,
      tags: tags,
    })
  }
}
