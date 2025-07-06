// @ts-nocheck

setup.SexActionClass.CalmDown = class CalmDown extends setup.SexAction {
  getTags() { return super.getTags().concat(['nobodypart', 'normal',]) }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        arousal: -setup.Sex.AROUSAL_MEDIUM,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced, setup.sexpace.resist],
        restrictions: [
          setup.qres.SexArousalAtLeast(setup.Sex.AROUSAL_MIN_TRIGGER),
        ],
      },
    ]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getDiscomfortBase(unit, sex) {
    let base_discomfort = super.getDiscomfortBase(unit, sex)

    // chastity give discomfort for erection.
    if (!unit.isCanPhysicallyOrgasm()) {
      const arousal = sex.getArousal(unit)
      let chance = (arousal - setup.Sex.AROUSAL_MIN_TRIGGER) / (
        setup.Sex.AROUSAL_MAX_TRIGGER - setup.Sex.AROUSAL_MIN_TRIGGER
      )
      if (chance > 0) {
        base_discomfort += setup.Sex.DISCOMFORT_LARGE * chance
      }
    }

    return base_discomfort
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'Calm down'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Calm down, reducing arousal.`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    const topic = setup.Text.Banter._getTopic()
    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const location = sex.getLocation()
    const gaze = location.repGazeAt(sex)

    let t
    const eq = me.getEquipmentAt(setup.equipmentslot.genital)
    if (eq && !me.isCanPhysicallyOrgasm()) {
      const eqrep = eq.rep()
      if (me.isInChastity()) {
        // chastity cage
        t = [
          `At feeling a|their a|dick uncomfortably hardening against a|their ${eqrep}, a|rep hurriedly a|try a|their best to reduce a|their arousal by thinking about ${topic} instead.`,
          `a|Reps a|dick painfully hardens against a|their ${eqrep}, and the sudden pain destroys some of the arousal.`,
          `a|Reps budding arousal is destroyed as a|their hardening a|dick is painfully constricted by a|their ${eqrep}.`,
          `The ${eqrep} makes erection painful for a|them, and a|they a|do a|their best to forget about the sex and think about ${topic} instead.`,
          `a|Reps ${eqrep} forbids a|them from cumming and punish a|their hardon with pain, so a|they a|try to calm down and forget about all the sex.`,
        ]
      } else {
        // dick plug etc
        t = [
          `a|Reps ${eqrep} prevents a|them from climaxing, so a|they a|try to reduce a|their arousal by thinking about ${topic}.`,
          `Since a|their ${eqrep} prevents a|them from climaxing, a|they a|try to calm down and think about ${topic} instead.`,
          `a|Rep a|focus a|their thoughts on ${gaze} instead, hoping it will reduce a|their arousal since a|they can't orgasm with the ${eqrep} attached.`,
        ]
      }
    } else if (me.isObedient() && !me.isAllowedOrgasm()) {
      t = [
        `Since a|rep a|is not allowed to orgasm by a|their slave rule, a|they a|try to reduce a|their growing arousal by thinking about ${topic} instead.`,
        `a|Rep a|is an obedient slave, and a|they try to comply as much as a|they can with the rule forbidding a|them from climaxing by thinking about ${topic} instead.`,
        `Not wanting to break a|their no-orgasm rule, a|rep a|try to reduce a|their arousal by gazing at ${gaze} instead.`,
        `a|Reps slave rules forbid a|them from orgasming, and the obedient a|race a|try a|their best to calm a|themself.`,
      ]
    } else {
      t = [
        `a|Rep a|try to calm down and forget about all the sex, doing a|their best to think about ${topic} instead.`,
        `a|Rep a|try to calm a|themself, focusing a|their thoughts on ${gaze} instead.`,
        `a|Rep a|try to lower a|their arousal by doing a|their best to distract a|themself by thinking about ${topic}.`,
        `a|Rep a|calm a|themself by switching a|their thoughts from sex to ${gaze}.`,
      ]
    }

    return setup.rng.choice(t)
  }

}