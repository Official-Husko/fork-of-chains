setup.Equipment_keygen = 1

setup.Equipment = class Equipment extends setup.TwineClass {
  static NONSEX_URL = 'img/special/equipment_nonsex.svg'
  static SEX_URL = 'img/special/equipment_sex.svg'

  static repNonSexIcon() {
    return setup.repImgIcon(setup.Equipment.NONSEX_URL, 'Equipments unrelated to sexual intercourse')
  }

  static repSexIcon() {
    return setup.repImgIcon(setup.Equipment.SEX_URL, 'Sex toys and sex-related equipments')
  }

  /**
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {setup.EquipmentSlot} slot 
   * @param {string[]} tags 
   * @param {number} value 
   * @param {number} sluttiness 
   * @param {Object<string, number>} skillmods 
   * 
   * {eq_gagged: 3} means need 3 of these kind of items to get this trait.
   * @param {Object<string, number>} traits 
   * 
   * @param {setup.Restriction[]} unit_restrictions 
   * @param {{image?: string, colorize?: boolean | string}} icon_settings 
   * @param {{description: string, flavor: string}} texts
   */
  constructor(key, name, slot, tags, value, sluttiness, skillmods, traits, unit_restrictions, icon_settings, texts) {
    super()

    this.order_key = setup.Equipment_keygen
    setup.Equipment_keygen += 1

    this.key = key
    this.name = name
    this.slot_key = slot.key
    this.tags = tags   // ['a', 'b']
    this.value = value
    this.sluttiness = sluttiness
    this.skillmods = setup.Skill.translate(skillmods)
    this.texts = texts
    if (!texts) {
      throw new Error(`Text object for equipment ${this.key} is missing.`)
    }

    this.icon_settings = icon_settings || {}

    if (icon_settings !== undefined && icon_settings instanceof Array) {
      throw new Error(`Invalid icon_settings for '${key}', expected an object`)
    }

    this.trait_key_mods = traits
    if (!traits || typeof traits !== 'object') {
      throw new Error(`Trait key mods must be objects for ${this.key}`)
    }
    for (const trait_key in traits) {
      if (!setup.trait[trait_key]) {
        throw new Error(`Could not find trait with key ${trait_key} for equipment ${this.key}`)
      }
    }

    if (!Array.isArray(unit_restrictions)) {
      throw new Error(`Unit restrictions must be an array for ${this.key}`)
    }
    if (unit_restrictions) {
      this.unit_restrictions = unit_restrictions
    } else {
      this.unit_restrictions = []
    }

    if (key in setup.equipment) throw new Error(`Equipment ${key} already exists`)
    setup.equipment[key] = this
  }

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

  getDefaultImageForSlot() {
    switch (this.slot_key) {
      case 'weapon': return 'weapon_sword'

      case 'eyes': return 'eyes_mask'
      case 'mouth': return 'mouth_bandana'
      case 'head': return 'head_helm'
      case 'neck': return 'neck_cloak'
      case 'arms': return 'arms_gloves'
      case 'torso': return 'torso_shirt'
      case 'nipple': return 'nipple_clamps'
      case 'rear': return 'rear_underwear'
      case 'genital': return 'arms_ring'
      case 'legs': return 'legs_pants'
      case 'feet': return 'feet_boots'
    }
  }

  /**
   * @returns {setup.Rarity}
   */
  getRarity() {
    const value = this.getValue()
    if (value >= setup.EQUIPMENT_PRICE_MASTER)
      return setup.rarity.legendary
    else if (value >= setup.EQUIPMENT_PRICE_GOODMASTER)
      return setup.rarity.epic
    else if (value >= setup.EQUIPMENT_PRICE_GOOD)
      return setup.rarity.rare
    else if (value >= setup.EQUIPMENT_PRICE_NORMAL)
      return setup.rarity.uncommon
    else
      return setup.rarity.common
  }

  getImageRep() {
    let classes = ''

    const has_custom_image = this.icon_settings.image
    const imagepath = 'img/equipment/' + (has_custom_image ? this.icon_settings.image : this.getDefaultImageForSlot()) + '.svg'

    if (this.icon_settings.colorize !== false) {
      if (typeof this.icon_settings.colorize === 'string') {
        classes = "colorize-" + this.icon_settings.colorize
      } else {
        let max_val = 0
        let max_i = 0
        for (let i = 0; i < this.skillmods.length; ++i) {
          if (this.skillmods[i] > max_val) {
            max_val = this.skillmods[i]
            max_i = i
          }
        }

        if (max_val > 0)
          classes = "colorize-" + setup.skill[max_i].keyword
        else
          classes = "colorize-white"
      }
    }

    classes += ` ${this.getRarity().getIconTriangleClass()}`

    const tooltip = `<<equipmentcardkey '${this.key}'>>`
    const url = setup.escapeHtml(setup.resolveImageUrl(imagepath))
    return `<span class="trait ${classes}" data-tooltip="${tooltip}"><img src="${url}"/></span>`
  }

  /**
   * @returns {string}
   */
  rep() {
    return setup.repMessageDict({
      instance: this,
      macroname: 'equipmentcardkey',
      icontext: this.getImageRep(),
      text_class: this.getRarity().getTextColorClass(),
    })
  }

  /**
   * @returns {string}
   */
  repFull() {
    let basic = this.rep()
    const explanation = setup.SkillHelper.explainSkillMods(this.getSkillMods())
    if (explanation) {
      basic += ' ' + explanation
    }
    const traits = this.repTraits()
    if (traits) {
      basic += ' ' + traits
    }
    return basic
  }

  /**
   * @returns {string}
   */
  repTraits() {
    const inner_fragments_front = []
    const inner_fragments_back = []
    const trait_mods = this.getTraitMods()
    for (const trait_key in trait_mods) {
      const trait = setup.trait[trait_key]
      const mod = trait_mods[trait_key]
      if (mod == 1) {
        inner_fragments_front.push(trait.rep())
      } else {
        inner_fragments_back.push(`[${trait.rep()} <span data-tooltip="You need at least ${mod} pieces of equipment with this to get the trait">(1/${mod})</span>]`)
      }
    }
    const all_fragments = inner_fragments_front.concat(inner_fragments_back)
    return all_fragments.join('')
  }

  /**
   * @returns {Object<string, number>}
   */
  getTraitMods() {
    return this.trait_key_mods
  }

  getTags() { return this.tags }

  getValue() { return this.value }

  getSellValue() {
    return Math.floor(this.getValue() * setup.MONEY_SELL_MULTIPLIER)
  }

  getSluttiness() { return this.sluttiness }

  getName() { return this.name }

  /**
   * @returns {string}
   */
  getDescription() {
    const texts = this.getTexts()
    return texts.description || ''
  }

  getSlot() { return setup.equipmentslot[this.slot_key] }

  getEquippedNumber() {
    let sets = State.variables.armory.getEquipmentSets()
    let slot = this.getSlot()
    let count = 0
    for (let i = 0; i < sets.length; ++i) {
      if (sets[i].getEquipmentAtSlot(slot) == this) ++count
    }
    return count
  }

  getSpareNumber() {
    return State.variables.armory.getEquipmentCount(this)
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getUnitRestrictions() {
    return this.unit_restrictions
  }

  isCanEquip(unit) {
    return setup.RestrictionLib.isUnitSatisfy(unit, this.getUnitRestrictions())
  }

  /**
   * Whether the equipment renders the bodypart useless
   * @returns {boolean}
   */
  isMakeBodypartUseless() {
    return this.getTags().includes('banuse')
  }

  /**
   * Whether this equipment covers the bodypart
   * @returns {boolean}
   */
  isCovering() {
    return this.getTags().includes('covering')
  }

  /**
   * @returns {boolean}
   */
  isSpecial() {
    // whether has any special, non-job requirements
    for (const requirement of this.getUnitRestrictions()) {
      if (!(requirement instanceof setup.qresImpl.Job)) {
        return true
      }
    }
    return false
  }

  text() {
    return this.texts
  }

  getTexts() {
    return this.texts
  }

  /**
   * @returns {boolean}
   */
  isBasic() {
    return this.getTags().includes('basic')
  }

  /**
   * @param {setup.Equipment} equipment1 
   * @param {setup.Equipment} equipment2 
   * @returns 
   */
  static Cmp(equipment1, equipment2) {
    return equipment1.order_key - equipment2.order_key
  }
}
