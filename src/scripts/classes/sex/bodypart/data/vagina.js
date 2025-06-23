setup.SexBodypartClass.Vagina = class Vagina extends setup.SexBodypart {
  constructor() {
    super(
      'vagina',
      [  /* tags */
      ],
      'Vagina',
      'Vagina',
    )
  }

  repSimple(unit) {
    return setup.rng.choice(['vagina', 'pussy', 'cunt',])
  }

  /**
   * @param {number} size 
   * @returns {string}
   */
  static holeSizeAdjective(size) {
    if (size >= 6) {
      return setup.trait.vagina_gape.repSizeAdjective()
    } else if (size >= 4) {
      return setup.trait.vagina_loose.repSizeAdjective()
    } else {
      return setup.trait.vagina_tight.repSizeAdjective()
    }
  }

  repSizeAdjective(unit, sex) {
    return setup.SexBodypartClass.Vagina.holeSizeAdjective(this.getSize(unit, sex))
  }

  getTraitSizeModifierMap() {
    return {
      training_vagina_basic: setup.Sex.BODYPART_SIZE_TRAINING_BASIC,
      training_vagina_advanced: setup.Sex.BODYPART_SIZE_TRAINING_ADVANCED,
      training_vagina_master: setup.Sex.BODYPART_SIZE_TRAINING_MASTER,
      default: 0,
    }
  }

  getTraitSizeMap() {
    return {
      vagina_tight: 2,
      vagina_loose: 4,
      vagina_gape: 6,
    }
  }

  getEquipmentSlots() {
    return [
      setup.equipmentslot.legs,
      setup.equipmentslot.rear,
      setup.equipmentslot.genital,
    ]
  }

  giveArousalMultiplier(me, sex) {
    return setup.SexUtil.calculateTraitMultiplier(me, {
      training_vagina_basic: setup.Sex.TRAIT_MULTI_LOW,
      training_vagina_advanced: setup.Sex.TRAIT_MULTI_MEDIUM,
      training_vagina_master: setup.Sex.TRAIT_MULTI_HIGH,

      training_mindbreak: -setup.Sex.TRAIT_MULTI_LOW,
    })
  }

  receiveArousalMultiplier(me, sex) {
    // vagina is the same
    return this.giveArousalMultiplier(me, sex)
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getHasRestrictions() {
    return [
      setup.qres.AnyTrait([setup.trait.vagina_tight, setup.trait.vagina_loose, setup.trait.vagina_gape], true),
    ]
  }

  /**
   * Whether this bodypart is flexible towards facing
   * @returns {boolean}
   */
  isFlexible() { return true }

  repLabia(unit, sex) {
    return 'labia'
  }

  repVaginal(unit, sex) {
    return 'vaginal'
  }

  repCunnilingus(unit, sex) {
    // only relevant for anus / vagina.
    return 'cunnilingus'
  }
}

setup.sexbodypart.vagina = new setup.SexBodypartClass.Vagina()
