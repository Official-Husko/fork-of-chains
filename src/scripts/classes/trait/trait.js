export const EXPORTABLE = true

setup.TraitHelper = {}

setup.Trait = class Trait extends setup.TwineClass {

  static keygen = 1

  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string} description 
   * @param {number} slave_value 
   * @param {Record<string, number>} skill_bonuses 
   * @param {string[]} tags 
   * @param {{ tier?: number, icon?: string, colors?: boolean, background?: string, minus?: boolean, plus?: boolean, cross?: boolean}} icon_settings 
   */
  constructor(key, name, description, slave_value, skill_bonuses, tags, icon_settings) {
    super()

    if (!key) throw new Error(`null key for trait`)
    this.key = key

    if (!name) throw new Error(`null name for trait ${key}`)
    this.name = name

    if (!description) throw new Error(`null name for trait ${key}`)
    this.description = description

    if (tags) {
      if (!Array.isArray(tags)) throw new Error(`${key} tags wrong: ${tags}`)
      this.tags = tags
    } else {
      this.tags = []
    }

    this.icon_settings = icon_settings || {}

    this.order_no = setup.Trait.keygen++

    this.trait_group_key = null

    this.skill_bonuses = setup.Skill.translate(skill_bonuses)

    this.is_has_skill_bonuses = false
    for (let i = 0; i < setup.skill.length; ++i) if (this.skill_bonuses[i]) {
      this.is_has_skill_bonuses = true
    }

    if (slave_value) this.slave_value = slave_value
    else this.slave_value = 0

    if (key in setup.trait) throw new Error(`Trait ${key} duplicated`)
    setup.trait[key] = this
  }

  /**
   * Called at end of each week from the unit.
   * 
   * @param {setup.Unit} unit 
   */
  advanceWeek(unit) { }

  // Deprecated. use getTexts()
  text() {
    return this.getTexts()
  }

  getTexts() {
    return setup.TRAIT_TEXTS[this.key]
  }

  /**
   * @returns {string}
   */
  getDescription() {
    return this.description
  }

  /**
   * @returns {string}
   */
  getDescriptionDisplay() {
    let base = this.description
    if (this.slave_value) {
      base = `${base} (worth: ${setup.DOM.toString(setup.DOM.Util.money(this.getSlaveValue()))})`
    }
    if (this.isHasSkillBonuses()) {
      base = `(${setup.SkillHelper.explainSkillMods(this.getSkillBonuses())}) ${base}`
    }
    return base
  }

  isHasSkillBonuses() {
    return this.is_has_skill_bonuses
  }

  getSkillBonuses() {
    return this.skill_bonuses
  }

  getImage() {
    return 'img/trait/' + (this.icon_settings.icon || this.key) + '.svg'
  }

  // warning: order matters! closer to beginning = more priority
  static ICON_BACKGROUNDS = {
    negative2: { effect: "trait-fx-invert" },
    negative: { effect: "trait-fx-invert" },
    positive3: { effect: "trait-fx-positive3" },
    positive2: { effect: "trait-fx-invert" },
    positive: { effect: "trait-fx-invert" },
    blessing: {},
    blessing_max: {},
    curse: {},
    curse_max: {},
    boon: {},
    trauma: {},
    skin: {},
    trmaster: { effect: "trait-fx-trmaster" },
    tradvanced: {},
    training: {},
    equipment: { effect: "trait-fx-invert" },
    magic: {},
    skill: {},
    per: { effect: "trait-fx-invert" },
    race: { effect: "trait-fx-invert" },
    subrace: {},
    bg: {},
    perkspecial: { effect: "trait-fx-invert" },
    perkbasic: {},
    perkstandard: { effect: "trait-fx-invert" },
  }

  /**
   * @returns {setup.Rarity}
   */
  getRarity() {
    const value = this.getSlaveValue()
    if (value >= setup.MONEY_TRAIT_LEGENDARY)
      return setup.rarity.legendary
    else if (value >= setup.MONEY_TRAIT_EPIC)
      return setup.rarity.epic
    else if (value >= setup.MONEY_TRAIT_RARE)
      return setup.rarity.rare
    else if (value >= setup.MONEY_TRAIT_MEDIUM)
      return setup.rarity.uncommon
    else if (value < 0)
      return setup.rarity.never
    else
      return setup.rarity.common
  }

  _getCssAttrs() {
    let style = ''
    let classes = "trait " + this.getRarity().getIconTriangleClass()

    if (this.icon_settings.tier)
      classes += " trait-tier" + this.icon_settings.tier

    if (this.icon_settings.minus)
      classes += " trait-minus"

    if (this.icon_settings.plus)
      classes += " trait-plus"

    if (this.icon_settings.cross)
      classes += " trait-cross"

    const tags = this.icon_settings.background ? [this.icon_settings.background] : this.tags
    for (const tag of Object.keys(setup.Trait.ICON_BACKGROUNDS)) {
      if (tags.includes(tag)) { // found
        const taginfo = setup.Trait.ICON_BACKGROUNDS[tag]
        style += `--trait-bg-image: url(${setup.resolveImageUrl('img/trait/backgrounds/' + tag + '.svg')});`
        if (!this.icon_settings.colors && taginfo.effect)
          classes += ' ' + taginfo.effect
        break
      }
    }

    return `class="${classes}" style="${style}"`
  }

  _rep(tooltip, tooltip_noclick) {
    let inner = tooltip ? setup.repImg({
      imagepath: this.getImage(),
      tooltip_content: `<<tooltiptrait '${this.key}'>>`,
      tooltip_noclick: tooltip_noclick
    }) : setup.repImg({
      imagepath: this.getImage()
    })
    const tags = this.icon_settings.background || this.tags.join(' ')
    return `<span ${this._getCssAttrs()}><span>${inner}</span></span>`
  }

  getImageRep() {
    return this._rep(false)
  }

  rep(tooltip_noclick) {
    return this._rep(true, tooltip_noclick)
  }

  /**
   * @returns {string}
   */
  repFull() {
    return `<span class='capitalize' data-tooltip="<<tooltiptrait '${this.key}'>>">${this._rep(/* tooltip = */ false)} ${this.getName()}</span>`
  }

  repNegative(tooltip_noclick) {
    return `<span class="negtraitcard">${this.rep(tooltip_noclick)}</span>`
  }

  repPositive(tooltip_noclick) {
    return `<span class="traitcardglow">${this.rep(tooltip_noclick)}</span>`
  }

  /**
   * @returns {string}
   */
  repSizeAdjective() {
    const text = this.text()
    if (text && text.size_adjective) {
      return setup.rng.choice(text.size_adjective)
    } else {
      return ''
    }
  }

  /**
   * @returns {string}
   */
  repAdjective() {
    const text = this.text()
    if (text && text.adjective) {
      return setup.rng.choice(text.adjective)
    } else {
      return ''
    }
  }

  /**
   * @returns {string}
   */
  repNounGood() { return setup.rng.choice(this.text().noungood) }

  /**
   * @returns {string}
   */
  repNounBad() { return setup.rng.choice(this.text().nounbad) }

  getName() { return this.name }

  getSlaveValue() {
    return this.slave_value
  }

  getTraitGroup() {
    return setup.traitgroup[this.trait_group_key]
  }

  /**
   * @returns {number}
   */
  getTraitLevel() {
    const my_index = this.getTraitGroup()._getTraitIndex(this)
    const null_index = this.getTraitGroup()._getTraitIndex(null)
    return my_index - null_index
  }

  getTags() { return this.tags }

  isHasTag(tag) {
    return this.getTags().includes(tag)
  }
  /**
   * @param {Array} tag_array
   * @returns boolean
   */
  isHasAnyTag(tag_array) {
    return this.getTags().includesAny(tag_array);
  }

  /**
   * @param {Array} tag_array
   * @returns boolean
   */
  isHasAllTags(tag_array){
    return this.getTags().includesAll(tag_array);
  }

  /**
   * @returns {setup.Trait[]}
   */
  getTraitCover() {
    let traitgroup = this.getTraitGroup()
    if (!traitgroup) return [this]
    return traitgroup.getTraitCover(this)
  }

  /**
   * @returns {boolean}
   */
  isNeedDick() {
    return this.getTags().includes('needdick')
  }

  /**
   * @returns {boolean}
   */
  isNeedVagina() {
    return this.getTags().includes('needvagina')
  }

  /**
   * @returns {boolean}
   */
  isNeedGenital() {
    return this.isNeedDick() || this.isNeedVagina()
  }

  /**
   * @returns {boolean}
   */
  isCorruption() {
    return this.getTags().includes('corruption') || this == setup.trait.corrupted || this == setup.trait.corruptedfull
  }

  /**
   * @returns {boolean}
   */
  isAttachable() {
    return !this.getTags().filter(tag => ['computed', 'temporary', 'equipment'].includes(tag)).length
  }

  isAttachableInContentCreator() {
    return this.isAttachable() && !this.getTags().includes('perk') && !this.getTags().includes('blessingcurse') && !(this == setup.trait.training_mindbreak)
  }

  /**
   * @param {setup.Trait} gender 
   * @returns {boolean}
   */
  isCompatibleWithGender(gender) {
    if (!gender.getTags().includes('gender')) throw new Error(`Gender in iscompatiblewithgender must be a gender, not ${gender.key}`)
    if (this.isNeedDick() && gender == setup.trait.gender_female) return false
    if (this.isNeedVagina() && gender == setup.trait.gender_male) return false
    return true
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isAttachableTo(unit) {
    if (!this.isAttachable()) return false
    const tags = this.getTags()
    if (tags.includes('training') && this != setup.trait.training_mindbreak && unit.isDefiant()) {
      // defiant slaves can't receive training except mindbreak. They can get mindbroken.
      // Mindbroken affects defiancy a little differently:
      // it will hide will_defiant, until they recover, which then resurface
      // it will NOT hide will_indomitable.
      return false
    }
    if (!unit.isHasDick() && this.isNeedDick()) return false
    if (!unit.isHasVagina() && this.isNeedVagina()) return false
    return true
  }
}

setup.Trait_Cmp = function (trait1, trait2) {
  if (trait1.order_no < trait2.order_no) return -1
  if (trait1.order_no > trait2.order_no) return 1
  return 0
}

/**
 * @param {string[]} tags 
 * @returns {setup.Trait[]}
 */
setup.TraitHelper.getAllTraitsOfTags = function (tags) {
  if (!Array.isArray(tags)) throw new Error(`getAllTraitsOftags must be called with array`)
  let traits = []
  for (let traitkey in setup.trait) {
    let trait = setup.trait[traitkey]
    let ok = true
    for (let i = 0; i < tags.length; ++i) {
      if (!trait.isHasTag(tags[i])) {
        ok = false
        break
      }
    }
    if (ok) traits.push(trait)
  }
  return traits
}

/**
 * // returns all traits that can actually be added to units. Ignore temporary/computed traits.
 * @returns {setup.Trait[]}
 */
setup.TraitHelper.getAttachableTraits = function () {
  return Object.values(setup.trait).filter(trait => trait.isAttachable())
}

/**
 * // returns all traits that can actually be added to units minus those that are added in a special way. Ignore temporary/computed traits.
 * @returns {setup.Trait[]}
 */
setup.TraitHelper.getAttachableTraitsInContentCreator = function () {
  return Object.values(setup.trait).filter(trait => trait.isAttachableInContentCreator())
}

