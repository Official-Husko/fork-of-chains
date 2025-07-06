// @ts-nocheck

// Explicit dependency, otherwise Item is still undefined
import "../inventory/item.js"

// effects: [cost1, cost2, cost3, ...]
// actor name is: 'unit'

// Can't be made into a class because it "inherits" from item
setup.Furniture = class Furniture extends setup.Item {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string} description 
   * @param {number} value 
   * @param {setup.FurnitureSlot} slot 
   * @param {string[]} tags 
   * @param {Object<string, number>} skillmods 
   * @param {Object} texts 
   */
  constructor(key, name, description, value, slot, tags, skillmods, texts) {
    super({
      key: key,
      name: name,
      description: description,
      item_class: setup.itemclass.furniture,
      value: value,
      tags: tags,
    })

    this.skillmods = setup.Skill.translate(skillmods)
    this.slot_key = slot.key
    this.texts = texts
    if (!texts) throw new Error(`Missing text for furniture: ${this.key}`)
  }

  getTexts() { return this.texts }

  getBedchamberText() {
    return this.getTexts()?.bedchamber || ''
  }

  /**
   * @returns {setup.FurnitureSlot}
   */
  getSlot() { return setup.furnitureslot[this.slot_key] }

  /**
   * @returns {number[]}
   */
  getSkillMods() {
    return this.skillmods
  }

  /**
   * @param {setup.Skill} skill 
   * @returns {number}
   */
  getSkillMod(skill) {
    return this.getSkillMods()[skill.key]
  }

  /**
   * @returns {setup.Skill | null}
   */
  getMainSkill() {
    const skill_mods = this.getSkillMods()
    const max_value = Math.max(...skill_mods)
    if (max_value <= 0) {
      return null
    }
    const index = skill_mods.indexOf(max_value)
    return setup.skill[index]
  }

  /**
   * @returns {setup.Rarity}
   */
  getRarity() {
    const value = this.getValue()
    if (value >= setup.FURNITURE_PRICE_MASTER)
      return setup.rarity.legendary
    else if (value >= setup.FURNITURE_PRICE_GOODMASTER)
      return setup.rarity.epic
    else if (value >= setup.FURNITURE_PRICE_GOOD)
      return setup.rarity.rare
    else if (value >= setup.FURNITURE_PRICE_NORMAL)
      return setup.rarity.uncommon
    else
      return setup.rarity.common
  }

  getImageRep() {
    const image_path_raw = this.getSlot().getImage()
    const main_skill = this.getMainSkill()

    let classes = ''
    if (main_skill) {
      classes = `colorize-${main_skill.keyword}`
    } else {
      classes = "colorize-white"
    }

    classes += ` ${this.getRarity().getIconTriangleClass()}`

    const tooltip = `<<itemcardkey '${this.key}'>>`
    const url = setup.escapeHtml(setup.resolveImageUrl(image_path_raw))
    return `<span class="trait ${classes}" data-tooltip="${tooltip}"><img src="${url}"/></span>`
  }

  /**
   * @returns {string}
   */
  repFull() {
    let basic = this.rep()
    const explanation = setup.SkillHelper.explainSkills(this.getSkillMods())
    if (explanation) {
      basic += ' ' + explanation
    }
    return basic
  }

  /**
   * @returns {boolean}
   */
  isBasic() { return this.getTags().includes('basic') }
}
