
import "../util/common.js"

// load SVG as raw string (cannot be loaded at runtime from localhost...)
import worldmap_regions_svg from "../../assets/worldmap-regions.svg"

setup.Lore = class Lore extends setup.TwineClass {
  /**
   * Describes a piece of game lore, such as location, region, or an important person.
   * @param {string} key 
   * @param {string} name
   * @param {Array.<string>} tags
   * @param {Array.<setup.Restriction>} restrictions
   */
  constructor(key, name, tags, restrictions) {
    super()

    this.key = key
    this.tags = tags
    this.name = name
    this.description_passage = `LORE_${key}`
    this.restrictions = restrictions

    if (!Story.has(this.description_passage)) {
      throw new Error(`Passage ${this.description_passage} not found for lore ${key}!`)
    }

    if (key in setup.lore) throw new Error(`Duplicate lore ${key}`)
    setup.lore[key] = this
  }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {Array.<string>}
   */
  getTags() { return this.tags }

  /**
   * @returns {string}
   */
  getDescriptionPassage() { return this.description_passage }

  /**
   * @returns {Array.<setup.Restriction>}
   */
  getRestrictions() { return this.restrictions }

  /**
   * @returns {boolean}  Is this piece of lore visible in the Library?
   */
  isVisible() {
    return setup.RestrictionLib.isPrerequisitesSatisfied(/* object = */ null, this.getRestrictions())
  }

  /**
   * @param {boolean} [is_uppercase]
   * @returns {string}
   */
  rep(is_uppercase) {
    if (!is_uppercase) {
      return setup.repMessage(this, 'lorecardkey')
    } else {
      return setup.repMessage(this, 'lorecardkey', undefined, this.getName().toUpperFirst())
    }
  }

  /**
   * Returns lore.rep() if the lore exists, or an error message if it does not.
   * @param {string} lore_key 
   * @param {boolean} [is_uppercase]
   * @returns {string}
   */
  static repLore(lore_key, is_uppercase) {
    const lore = setup.lore[lore_key]
    if (!lore) throw new Error(`Lore ${lore_key} not found!`)
    return lore.rep(is_uppercase)
  }

  static WORLDMAP_REGIONS_SVG = worldmap_regions_svg.replace('EDITOR_STYLES', 'EDITOR_STYLES_DISABLED')
    .replace('xlink:href="..%5C..%5Cdist%5Cimg%5Cnoembed%5Cmap.jpg"',
      `xlink:href="${setup.escapeHtml(setup.resolveImageUrl('img/noembed/map.jpg'))}"`
    )
}
