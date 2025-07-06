// @ts-nocheck

setup.ItemLorebook = class ItemLorebook extends setup.Item {
  /**
   * @param {{
   * key: string
   * name: string
   * lore: string
   * tags: string[]
   * }} args
   */
  constructor({ key, name, lore, tags }) {
    const lore_instance = setup.lore[lore]
    if (!lore_instance) {
      throw new Error(`Lore ${lore} not found for lorebook ${key}`)
    }
    const desc = `Unlocks the ${lore_instance.getName()} lore`
    super({
      key: key,
      name: name,
      description: desc,
      item_class: setup.itemclass.lorebook,
      tags: tags,
    })

    // add this book as a requirement to see the lore.
    lore_instance.restrictions.push(
      setup.qres.HasItem(this)
    )
  }
}
