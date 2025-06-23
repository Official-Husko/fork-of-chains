setup.SexPoseClass.SixtyNine = class SixtyNine extends setup.SexPoseTop {
  constructor() {
    super(
      'sixtynine',
      [  /* tags */
      ],
      'Sixty-nine',
      'Give back the pleasure',
      {
        arms: {facing_key: 'downback', height_key: 'floor'},
        legs: {facing_key: 'downfront', height_key: 'floor'},
        tail: {facing_key: 'upfront', height_key: 'floor'},
        penis: {facing_key: 'downfront', height_key: 'floor'},
        breasts: {facing_key: 'downback', height_key: 'floor'},
        mouth: {facing_key: 'downback', height_key: 'floor'},
        vagina: {facing_key: 'upfront', height_key: 'floor'},
        anus: {facing_key: 'upfront', height_key: 'floor'},
      },
    )
  }

  getRestrictions() {
    return super.getRestrictions().concat([setup.qres.HasItem('sexmanual_sixtynine')])
  }

  /**
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribe(unit, sex) {
    const below = sex.getUnitAtPosition(setup.sexposition.center)
    const options = [
      `a|Rep a|get on top of b|rep, placing a|their a|cgenital right above b|their a|mouth.`,
      `a|Rep a|get on top of b|rep, with a|their head right above b|their a|cgenital.`,
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

setup.sexpose.sixtynine = new setup.SexPoseClass.SixtyNine()
