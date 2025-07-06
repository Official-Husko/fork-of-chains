// @ts-nocheck


setup.ItemQuest = class ItemQuest extends setup.Item {
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
      item_class: setup.itemclass.questitem,
      tags: tags,
    })
  }
}

