setup.SexPoseClass.Missionary = class Missionary extends setup.SexPoseTop {
  constructor() {
    super(
      'missionary',
      [  /* tags */
      ],
      'Missionary',
      'Locked together',
      {
        arms: {facing_key: 'downfront', height_key: 'floor'},
        legs: {facing_key: 'downback', height_key: 'floor'},
        tail: {facing_key: 'upback', height_key: 'floor'},
        penis: {facing_key: 'downback', height_key: 'floor'},
        breasts: {facing_key: 'downfront', height_key: 'floor'},
        mouth: {facing_key: 'downfront', height_key: 'floor'},
        vagina: {facing_key: 'upback', height_key: 'floor'},
        anus: {facing_key: 'upback', height_key: 'floor'},
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
      `a|Rep a|lie on top of b|rep, a|their a|cbreasts colliding with b|their b|cbreasts.`,
      `a|Rep a|position a|themself on top of b|rep.`,
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
      `Lying down`,
    ]
  }
}

setup.sexpose.missionary = new setup.SexPoseClass.Missionary()
