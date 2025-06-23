import { IMPORTABLE } from "../../constants"

setup.rarity = {}

setup.Rarity = class Rarity extends setup.TwineClass {
  /**
   * @typedef {Object} RarityArgs
   * @property {string} key
   * @property {string} name
   * @property {string} description
   * @property {number} [frequency]    // how many times appear in a full deck?
   * @property {boolean} [is_forced]    // whether this rarity overrides all other
   * 
   * @param {RarityArgs} args
   */
  constructor({ key, name, description, frequency, is_forced }) {
    super()

    if (!key) throw new Error(`null key for rarity`)
    this.key = key

    if (!name) throw new Error(`null name for rarity ${key}`)
    this.name = name

    this.description = description

    this.frequency = frequency

    this.is_forced = is_forced
  }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {string}
   */
  getDescription() { return this.description }

  /**
   * @returns {string}
   */
  text() {
    return `setup.rarity.${this.key}`
  }

  getIconTriangleClass() {
    return `rarity-${this.key}`
  }

  getTextColorClass() {
    return `text-rarity-${this.key}`
  }

  getBorderColorClass() {
    return `border-rarity-${this.key}`
  }

  getImage() {
    return `img/rarity/${this.key}.svg`
  }

  getImageRep() {
    const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage()))}" />`
    return `<span class='trait' data-tooltip="${this.getName()}">${img}</span>`;
  }

  /**
   * @returns {string}
   */
  rep() {
    return this.getImageRep()
  }

  /**
   * @returns {number}
   */
  getFrequency() { return this.frequency }

  /**
   * @returns {boolean}
   */
  isForced() { return this.is_forced }

  /**
   * Returns a list of some generate-able rarity, from the "most common" to "least common".
   * For example, this could return [always, common], [always, rare, uncommon, common], ...
   * 
   * @returns {setup.Rarity[]}
   */
  static getRandomRarityOrderWeighted() {
    const rarities = Object.values(setup.rarity).filter(
      rarity => !rarity.isForced() && rarity.getFrequency()
    )
    rarities.sort((a, b) => b.getFrequency() - a.getFrequency())
    const max_frequency = setup.rarity.rare.getFrequency()
    const rarity_sampled = setup.rng.sampleArray(
      rarities.map(rarity => [rarity, Math.min(max_frequency, rarity.getFrequency())]), /* normalize = */ true)

    rarities.splice(rarities.indexOf(rarity_sampled))
    return Object.values(setup.rarity).filter(rarity => rarity.isForced()).concat(
      rarities
    )
  }

  /**
   * @param {setup.Rarity} rarity1 
   * @param {setup.Rarity} rarity2 
   */
  static RarityCmp(rarity1, rarity2) {
    const idx1 = Object.keys(setup.rarity).indexOf(rarity1.key)
    const idx2 = Object.keys(setup.rarity).indexOf(rarity2.key)
    return idx1 - idx2
  }
}

setup.rarity.always = new setup.Rarity({
  key: 'always',
  name: 'Always',
  description: `Will triggered/scouted whenever possible`,
  is_forced: true,
})

setup.rarity.common = new setup.Rarity({
  key: 'common',
  name: 'Common',
  description: `1 every 2 quests/events`,
  frequency: setup.RARITY_COMMON_FREQUENCY
})

setup.rarity.uncommon = new setup.Rarity({
  key: 'uncommon',
  name: 'Uncommon',
  description: `1 every 4 quests/events`,
  frequency: setup.RARITY_UNCOMMON_FREQUENCY
})

setup.rarity.rare = new setup.Rarity({
  key: 'rare',
  name: 'Rare',
  description: `1 every 8 quests/events`,
  frequency: setup.RARITY_RARE_FREQUENCY
})

setup.rarity.epic = new setup.Rarity({
  key: 'epic',
  name: 'Epic',
  description: `1 every 16 quests/events`,
  frequency: setup.RARITY_EPIC_FREQUENCY
})

setup.rarity.legendary = new setup.Rarity({
  key: 'legendary',
  name: 'Legendary',
  description: `1 every 32 quests/events`,
  frequency: setup.RARITY_LEGENDARY_FREQUENCY
})

setup.rarity.never = new setup.Rarity({
  key: 'never',
  name: 'Never',
  description: `Never gets scouted/triggered`,
  frequency: setup.RARITY_NEVER_FREQUENCY
})
