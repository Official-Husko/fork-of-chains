setup.ItemSexManual = class ItemSexManual extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * description: string
   * tags: []
   * }} param0 
   */
  constructor({ key, name, description, tags }) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.sexmanual,
      tags: tags,
    })
  }
}
