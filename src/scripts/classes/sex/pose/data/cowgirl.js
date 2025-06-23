setup.SexPoseClass.CowGirl = class CowGirl extends setup.SexPoseTop {
  constructor() {
    super(
      'cowgirl',
      [  /* tags */
      ],
      'Cowgirl',
      'Let the sub do their work',
      {
        arms: {facing_key: 'front', height_key: 'medium'},
        legs: {facing_key: 'front', height_key: 'floor'},
        tail: {facing_key: 'back', height_key: 'floor'},
        penis: {facing_key: 'front', height_key: 'floor'},
        breasts: {facing_key: 'front', height_key: 'medium'},
        mouth: {facing_key: 'front', height_key: 'medium'},
        vagina: {facing_key: 'downback', height_key: 'floor'},
        anus: {facing_key: 'downback', height_key: 'floor'},
      }
    )
  }

  /**
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribe(unit, sex) {
    const below = sex.getUnitAtPosition(setup.sexposition.center)
    const options = [
      `a|Rep a|get on top of b|rep and sit a|their ass right above b|their b|genital.`,
      `a|Rep a|position a|themself above b|rep, sitting a|their ass right above b|their b|genital.`,
    ]
    return setup.Text.replaceUnitMacros(
      setup.rng.choice(options),
      {
        b: below,
      }
    )
  }

  rawDescribePosition(unit, sex) {
    return [
      `Sitting`,
      `Riding`,
    ]
  }
}

setup.sexpose.cowgirl = new setup.SexPoseClass.CowGirl()
