setup.SexBodypartClass.Breasts = class Breasts extends setup.SexBodypart {
  constructor() {
    super(
      'breasts',
      [  /* tags */
      ],
      'Breasts',
      'Breasts',
    )
  }

  /**
   * @param {setup.Unit} unit 
   */
  repSimple(unit) {
    if (unit.isHasBreasts()) {
      return setup.rng.choice(['breasts', 'tits', 'bosoms', 'boobs',])
    } else {
      return setup.rng.choice(['chest', 'pecs',])
    }
  }

  getTraitSizeMap() {
    return {
      breast_tiny: 1,
      breast_small: 2,
      breast_medium: 3,
      breast_large: 4,
      breast_huge: 5,
      breast_titanic: 6,

      // flat
      default: 0,
    }
  }

  /**
   * @param {number} size 
   * @returns {string}
   */
  static breastsSizeAdjective(size) {
    if (size >= 6) {
      return setup.trait.breast_titanic.repSizeAdjective()
    } else if (size >= 5) {
      return setup.trait.breast_huge.repSizeAdjective()
    } else if (size >= 4) {
      return setup.trait.breast_large.repSizeAdjective()
    } else if (size >= 3) {
      return setup.trait.breast_medium.repSizeAdjective()
    } else if (size >= 2) {
      return setup.trait.breast_small.repSizeAdjective()
    } else if (size >= 1) {
      return setup.trait.breast_tiny.repSizeAdjective()
    } else {
      return setup.rng.choice([`flat`, `non-existent`,])
    }
  }

  repSizeAdjective(unit, sex) {
    return setup.SexBodypartClass.Breasts.breastsSizeAdjective(this.getSize(unit, sex))
  }

  getEquipmentSlots() {
    return [
      setup.equipmentslot.torso,
    ]
  }

  giveArousalMultiplier(me, sex) {
    if (me.isHasBreasts()) {
      return setup.SexUtil.calculateTraitMultiplier(me, {
        breast_titanic: setup.Sex.TRAIT_MULTI_HIGH,
        breast_huge: setup.Sex.TRAIT_MULTI_MEDIUM,
        breast_large: setup.Sex.TRAIT_MULTI_LOW,
        breast_small: -setup.Sex.TRAIT_MULTI_LOW,
        breast_tiny: -setup.Sex.TRAIT_MULTI_MEDIUM,
      })
    } else {
      return setup.SexUtil.calculateTraitMultiplier(me, {
        muscle_verystrong: setup.Sex.TRAIT_MULTI_MEDIUM,
        muscle_extremelystrong: setup.Sex.TRAIT_MULTI_LOW,
      })
    }
  }

  receiveArousalMultiplier(me, sex) {
    return 1.0
  }

  isCanUseCovered() { return true }

  static TITFUCK = {
    titfuck: 'titfuck',
    pecjob: 'pecjob',
  }

  getMinBreastTraitForTitfuck() {
    return setup.trait.breast_medium
  }

  getMinMuscleTraitForPecjob() {
    return setup.trait.muscle_verystrong
  }

  /**
   * @param {setup.Unit} me 
   * @param {setup.Unit} them 
   * @returns {string | null}
   */
  getTitfuck(me, them) {
    if (me.isHasDick() && them.isHasTrait(this.getMinBreastTraitForTitfuck())) {
      return setup.SexBodypartClass.Breasts.TITFUCK.titfuck
    } else if (me.isHasDick() && !them.isHasBreasts() && them.isHasTrait(this.getMinMuscleTraitForPecjob())) {
      return setup.SexBodypartClass.Breasts.TITFUCK.pecjob
    } else {
      return null
    }
  }

  /**
   * @param {setup.Unit} me 
   * @param {setup.Unit} them 
   * @returns {string | null}
   */
  repTitfuck(me, them) {
    const titfuck = this.getTitfuck(me, them)
    return titfuck
  }

  // push, press, squeeze, ...
  /**
   * @param {setup.Unit} me 
   * @param {setup.Unit} them 
   * @returns {string | null}
   */
  repPush(me, them) {
    const titfuck = this.getTitfuck(me, them)
    if (titfuck == setup.SexBodypartClass.Breasts.TITFUCK.titfuck) {
      return setup.rng.choice([
        `push`, `press`, `squeeze`,
      ])
    } else if (titfuck == setup.SexBodypartClass.Breasts.TITFUCK.pecjob) {
      return setup.rng.choice([
        `press`, `squeeze`,
      ])
    } else {
      throw new Error(`Unrecognized titfuck option: ${titfuck}`)
    }
  }
}

setup.sexbodypart.breasts = new setup.SexBodypartClass.Breasts()
