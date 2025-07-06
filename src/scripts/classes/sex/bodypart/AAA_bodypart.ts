// @ts-nocheck

setup.SexBodypartClass = {}
setup.sexbodypart = class { }

/**
 * A bodypart that takes part in sex actions
 */
setup.SexBodypart = class SexBodypart extends setup.TwineClassCustom {
  /**
   * @param {string} key 
   * @param {string[]} tags 
   * @param {string} title 
   * @param {string} description 
   */
  constructor(key, tags, title, description) {
    super()
    this.key = key
    this.tags = tags
    this.title = title
    this.description = description
  }

  /* =========================
      DATA
  ========================= */

  /**
   * Multiplier for arousal that this bodypart owner gives to the partner
   * @param {setup.Unit} me
   * @param {setup.SexInstance} sex
   * @returns {number}
   */
  giveArousalMultiplier(me, sex) {
    return 1.0
  }

  /**
   * Multiplier for arousal that this bodypart owner receives from the partner
   * @param {setup.Unit} me
   * @param {setup.SexInstance} sex
   * @returns {number}
   */
  receiveArousalMultiplier(me, sex) {
    return 1.0
  }

  /* =========================
      BASIC
  ========================= */

  /**
   * @returns {string}
   */
  getTag() { return this.key }

  // get the corresponding equipment slots that block this bodypart.
  /**
   * @returns {setup.EquipmentSlot[]}
   */
  getEquipmentSlots() {
    return []
  }

  /**
   * Can this bodypart penetrate another? Filled manually for efficiency
   * @param {setup.SexBodypart} bodypart 
   * @returns {boolean}
   */
  isCanPenetrate(bodypart) {
    return false
  }

  /**
   * Whether this penetration is considered a submissive act
   * @param {setup.SexBodypart} bodypart 
   * @returns {boolean}
   */
  isSubmissivePenetration(bodypart) {
    return false
  }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexBodypartClass` }

  /**
   * @returns {string[]}
   */
  getTags() { return this.tags }

  /**
   * @returns {string}
   */
  getTitle() { return this.title }

  /**
   * @returns {string}
   */
  getDescription() { return this.description }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   */
  isHasBodypart(unit, sex) { return setup.RestrictionLib.isUnitSatisfy(unit, this.getHasRestrictions()) }

  /**
   * @returns {setup.Restriction[]}
   */
  getHasRestrictions() {
    return []
  }

  /**
   * Whether this bodypart is flexible towards facing
   * @returns {boolean}
   */
  isFlexible() { return false }

  /**
   * Whether this bodypart is completely directionless and disregard facing altogether
   */
  isDirectionless() { return false }

  /**
   * Whether this bodypart is usable even when covered.
   * @returns {boolean}
   */
  isCanUseCovered() { return false }

  /**
   * How much difference in height can this bodypart tolerate for checking interaction?
   * @returns {number}
   */
  heightTolerance() { return 0 }

  /**
   * Return trait: number for determining size
   * @returns {Object<string, number>}
   */
  getTraitSizeMap() { return {} }

  /**
   * How large is this unit's member? Returns 0-6.
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} [sex]
   * @returns {number}
   */
  getSize(unit, sex) {
    return setup.SexUtil.sumTraitMultipliers(unit, this.getTraitSizeMap())
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} [sex]
   * @returns {string}
   */
  repSizeAdjective(unit, sex) {
    return ``
  }

  /**
   * Get modifier to size from trainings, etc.
   * @returns {Object<string, number>}
   */
  getTraitSizeModifierMap() { return {} }

  /**
   * Get modifier to size from trainings, etc.
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} [sex]
   * @returns {number}
   */
  getTraitSizeModifier(unit, sex) {
    return setup.SexUtil.sumTraitMultipliers(unit, this.getTraitSizeMap())
  }

  /**
   * Only for orifices: mouth, anus, vagina
   * Return the first half of a sentence, e.g., : "a is a masterful anal slut and "
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} [sex]
   * @returns {string}
   */
  repSizeModifier(unit, sex) {
    const mod = this.getTraitSizeModifier(unit, sex)
    const vaginal = this.repVaginal(unit, sex)
    let t
    if (unit.isSlaver()) {
      t = [
        `As a free slaver, a|rep a|have not undergone any specific ${vaginal} training, and `,
        `Given that a|rep a|is not a slave, a|they a|do not have any particular training for the use of a|their ${vaginal} orifice, and `,
        `Without any prior training of taking it up a|their ${this.repSimple(unit)}, `,
        `a|Rep a|is not a slave, and has never undergone training for ${vaginal} sex, and `,
        `While a|rep a|have certainly had plenty of sex before, a|they never undergo specialized ${vaginal} sex training, and `,
        `As a slaver, a|rep a|is not a trained ${vaginal} slut, and `,
      ]
    } else if (mod == setup.Sex.BODYPART_SIZE_TRAINING_MASTER) {
      t = [
        `a|Rep a|is a masterful ${vaginal} slut and `,
        `As a dedicated and masterful ${vaginal} slut, `,
        `Boasting a wealth of experience in ${vaginal} sex, `,
        `Having been extremely extensively trained in ${vaginal} sex, `,
        `With a|their masterful knowledge of ${vaginal} sex, `,
        `As a dedicated and borderline addicted ${vaginal} slut, `,
      ]
    } else if (mod == setup.Sex.BODYPART_SIZE_TRAINING_ADVANCED) {
      t = [
        `With their advanced training in ${vaginal} sex, `,
        `Since a|rep a|have plenty of experience with ${vaginal} sex, `,
        `As an experienced ${vaginal} slut, `,
        `As a properly trained ${vaginal} slave, `,
        `Having completed an extensive training for ${vaginal} use, `,
        `Boasting advanced ${vaginal} sex knowledge, `,
      ]
    } else if (mod == setup.Sex.BODYPART_SIZE_TRAINING_BASIC) {
      t = [
        `a|Rep a|have basic knowledge in ${vaginal} sex and `,
        `Thanks to a|their basic knowledge in ${vaginal} sex, `,
        `a|Rep a|have undergone basic training in ${vaginal} sex, and `,
        `With a|their basic understanding of ${vaginal} sex, `,
        `While a|rep is still inexperienced, a|they a|have basic ${vaginal} sex knowledge, and `,
        `Despite still being inexperienced, a|reps basic ${vaginal} training kicks in, and `,
      ]
    } else {
      t = [
        `a|Rep has never undergone any ${vaginal} sex, and `,
        `As a complete newcomer when it comes to ${vaginal} sex, `,
        `Given a|their absolute zero training in ${vaginal} sex, `,
        `Being fully unprepared for ${vaginal} sex, `,
        `With zero prior training in taking it ${vaginal}ly, `,
        `Boasting no knowledge of ${vaginal} sex, `,
      ]
    }
    return setup.SexUtil.convert(t, { a: unit }, sex)
  }

  /**
   * How well does my bodypart fits inside them? Returns:
   * 0: very well
   * 1: ok
   * 2: not good
   * 3: very bad
   * @param {setup.Unit} me 
   * @param {setup.Unit} them 
   * @param {setup.SexBodypart} their_bodypart 
   * @param {setup.SexInstance} [sex]
   * @returns {number}
   */
  getAccomodatingValue(me, them, their_bodypart, sex) {
    let my_size = this.getSize(me, sex) + this.getTraitSizeModifier(me, sex)
    let their_size = their_bodypart.getSize(them, sex) + their_bodypart.getTraitSizeModifier(them, sex)
    if (my_size < their_size) {
      return 0
    } else if (my_size < their_size + 2) {
      return 1
    } else if (my_size < their_size + 4) {
      return 2
    } else {
      return 3
    }
  }

  /**
   * @returns {string}
   */
  getImage() {
    return `img/sexbodypart/${this.key}.svg`
  }

  /**
   * @returns {string}
   */
  getImageRep() {
    return `<span class='colorize-white'>${setup.repImgIcon(this.getImage(), this.getTitle())}</span>`
  }

  /**
   * @returns {string}
   */
  repsimple() { return this.getImageRep() }

  /**
   * @param {setup.SexHeight} my_height 
   * @param {setup.SexBodypart} their_bodypart 
   * @param {setup.SexHeight} their_height 
   * @returns {boolean}
   */
  _isCanInteractWithHeight(my_height, their_bodypart, their_height) {
    return Math.abs(
      my_height.getHeightValue() - their_height.getHeightValue()
    ) <= Math.max(this.heightTolerance(), their_bodypart.heightTolerance())
  }

  /**
   * @param {setup.SexPosition} my_position 
   * @param {setup.SexFacing} my_facing 
   * @param {setup.SexBodypart} their_bodypart 
   * @param {setup.SexPosition} their_position 
   * @param {setup.SexFacing} their_facing 
   * @returns {boolean}
   */
  _isCanInteractWithPositionFacing(my_position, my_facing, their_bodypart, their_position, their_facing) {
    if (!my_position.isAdjacentTo(their_position)) return false

    const topcenter = [setup.sexposition.top, setup.sexposition.center]
    // @ts-ignore
    if (topcenter.includes(my_position) && topcenter.includes(their_position)) {
      // top down
      const mp = my_position.normalizeFacing(my_facing)
      const tp = their_position.normalizeFacing(their_facing)

      if (my_position == setup.sexposition.top) {
        // I am on top

        // front body matches
        const myflexfront = (
          this.isDirectionless() ||
          mp == setup.sexfacing.downfront ||
          (this.isFlexible() && mp.isFrontIsh())
        )

        const theirflexfront = (
          their_bodypart.isDirectionless() ||
          tp == setup.sexfacing.upfront ||
          (their_bodypart.isFlexible() && tp.isFrontIsh())
        )

        if (myflexfront && theirflexfront) return true

        // back body matches
        const myflexback = (
          this.isDirectionless() ||
          mp == setup.sexfacing.downback ||
          (this.isFlexible() && !mp.isFrontIsh())
        )

        const theirflexback = (
          this.isDirectionless() ||
          tp == setup.sexfacing.upback ||
          (their_bodypart.isFlexible() && !tp.isFrontIsh())
        )

        if (myflexback && theirflexback) return true
      } else {
        // I am on bottom

        // front body matches
        const myflexfront = (
          this.isDirectionless() ||
          mp == setup.sexfacing.upfront ||
          (this.isFlexible() && mp.isFrontIsh())
        )

        const theirflexfront = (
          this.isDirectionless() ||
          tp == setup.sexfacing.downfront ||
          (their_bodypart.isFlexible() && tp.isFrontIsh())
        )
        if (myflexfront && theirflexfront) return true

        // back body matches
        const myflexback = (
          this.isDirectionless() ||
          mp == setup.sexfacing.upback ||
          (this.isFlexible() && !mp.isFrontIsh())
        )

        const theirflexback = (
          this.isDirectionless() ||
          tp == setup.sexfacing.downback ||
          (their_bodypart.isFlexible() && !tp.isFrontIsh())
        )
        if (myflexback && theirflexback) return true
      }

      // failed top/down
      return false
    }

    // Only remaining case is adjacent horizontally.
    const mp = my_position.normalizeFacing(my_facing)
    const tp = their_position.normalizeFacing(their_facing)
    if (my_position.isLeftOf(their_position)) {
      // i am to the left, so my back vs their front
      const mine = (
        this.isDirectionless() ||
        mp == setup.sexfacing.back ||
        (this.isFlexible() && !mp.isFrontIsh())
      )
      const theirs = (
        their_bodypart.isDirectionless() ||
        tp == setup.sexfacing.front ||
        (their_bodypart.isFlexible() && tp.isFrontIsh())
      )

      if (mine && theirs) return true

    } else {
      // i am to the right, so my front vs their back
      const mine = (
        this.isDirectionless() ||
        mp == setup.sexfacing.front ||
        (this.isFlexible() && mp.isFrontIsh())
      )
      const theirs = (
        their_bodypart.isDirectionless() ||
        tp == setup.sexfacing.back ||
        (their_bodypart.isFlexible() && !tp.isFrontIsh())
      )

      if (mine && theirs) {
        return true
      }
    }
    return false
  }

  /**
   * @param {setup.SexPosition} my_position 
   * @param {{facing: setup.SexFacing, height: setup.SexHeight}} my_facingheight 
   * @param {setup.SexBodypart} their_bodypart 
   * @param {setup.SexPosition} their_position 
   * @param {{facing: setup.SexFacing, height: setup.SexHeight}} their_facingheight 
   * @returns {boolean}
   */
  isCanInteractWith(my_position, my_facingheight, their_bodypart, their_position, their_facingheight) {
    return (
      this._isCanInteractWithHeight(
        my_facingheight.height, their_bodypart, their_facingheight.height
      ) &&
      this._isCanInteractWithPositionFacing(
        my_position,
        my_facingheight.facing,
        their_bodypart,
        their_position,
        their_facingheight.facing,
      )
    )
  }

  /* =========================
      TEXT
  ========================= */

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rep(unit, sex) {
    if (sex.getCoveringEquipment(unit, this)) {
      const title = this.getTitle().toLowerCase()
      return setup.rng.choice([
        `obscured ${title}`,
        `covered ${title}`,
        `hidden ${title}`,
      ])
    } else {
      let base_text = this.getTitle().toLowerCase()
      if (this == setup.sexbodypart.anus) {
        base_text = `a|anus`
      } else if (this == setup.sexbodypart.breasts) {
        base_text = `a|cbreasts`
      } else if (this == setup.sexbodypart.penis) {
        base_text = `a|cdick`
      } else if (this == setup.sexbodypart.tail) {
        base_text = `a|tail`
      } else if (this == setup.sexbodypart.vagina) {
        base_text = `a|vagina`
      }
      return setup.Text.replaceUnitMacros(base_text, { a: unit })
    }
  }

  /**
   * Describe unit bodypart teasing to penetrate another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawDescribeTease(unit, target, target_bodypart, sex) { return '' }

  /**
   * Describe unit bodypart start to penetrate another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  describeTease(unit, target, target_bodypart, sex) {
    return setup.SexUtil.convert(
      this.rawDescribeTease(unit, target, target_bodypart, sex), { a: unit, b: target }, sex)
  }

  /**
   * Describe unit bodypart finish penetrating another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawDescribeEnd(unit, target, target_bodypart, sex) { return '' }

  /**
   * Describe unit bodypart finish penetrating another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  describeEnd(unit, target, target_bodypart, sex) {
    return setup.SexUtil.convert(
      this.rawDescribeEnd(unit, target, target_bodypart, sex), { a: unit, b: target }, sex)
  }

  /**
   * Gives a verb for this bodypart penetrating another. E.g., "penetrating b|anus"
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawVerbPenetrate(unit, target, target_bodypart, sex) { return '' }

  /**
   * Describe unit bodypart start to penetrate another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  verbPenetrate(unit, target, target_bodypart, sex) {
    return setup.SexUtil.convert(
      this.rawVerbPenetrate(unit, target, target_bodypart, sex), { a: unit, b: target }, sex)
  }

  /**
   * Gives a sentence describing extra flavor text when this bodypart penetrating another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawPenetrateFlavorSentence(unit, target, target_bodypart, sex) { return '' }

  /**
   * Describe unit bodypart start to penetrate another.
   * @param {setup.Unit} unit
   * @param {setup.Unit} target
   * @param {setup.SexBodypart} target_bodypart
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repPenetrateFlavorSentence(unit, target, target_bodypart, sex) {
    return setup.SexUtil.convert(
      this.rawPenetrateFlavorSentence(unit, target, target_bodypart, sex), { a: unit, b: target }, sex)
  }

  /**
   * Simple no-modifier name, e.g., tail
   * @param {setup.Unit} unit 
   * @returns {string}
   */
  repSimple(unit) {
    return ``
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repLabia(unit, sex) {
    // only relevant for anus / vagina.
    return 'labia'
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repVaginal(unit, sex) {
    // only relevant for anus / vagina.
    return 'anal'
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repCunnilingus(unit, sex) {
    // only relevant for anus / vagina.
    return 'cunnilingus'
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repTip(unit, sex) {
    // dick, tail
    return `tip`
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  repFuck(unit, sex) {
    // dick, tail
    return `fuck`
  }

  /* =========================
      STATIC
  ========================= */

  /**
   * @returns {setup.SexBodypart[]}
   */
  static getAllBodyparts() {
    return Object.values(setup.sexbodypart)
  }

  /**
   * @param {PenetrationInfo[]} penetrations 
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  static describePenetrationEnds(penetrations, sex) {
    const sentences = []
    for (const penetration of penetrations) {
      const target = sex.getBodypartPenetrationTarget(penetration.unit, penetration.bodypart)
      sentences.push(penetration.bodypart.describeEnd(
        penetration.unit, target.unit, target.bodypart, sex
      ))
    }
    return sentences.join(' ')
  }
}
