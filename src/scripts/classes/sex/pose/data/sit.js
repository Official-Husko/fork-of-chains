setup.SexPoseClass.Sit = class Sit extends setup.SexPoseFloor {
  constructor() {
    super(
      'sit',
      [  /* tags */
      ],
      'Sit',
      'Sitting on the ass',
      {
        arms: {facing_key: 'front', height_key: 'low'},
        legs: {facing_key: 'front', height_key: 'floor'},
        tail: {facing_key: 'back', height_key: 'floor'},
        penis: {facing_key: 'front', height_key: 'floor'},
        breasts: {facing_key: 'front', height_key: 'low'},
        mouth: {facing_key: 'front', height_key: 'medium'},
        vagina: {facing_key: 'front', height_key: 'floor'},
        anus: {facing_key: 'front', height_key: 'floor'},
      },
    )
  }

  getRestrictions() {
    return super.getRestrictions().concat([setup.qres.HasItem('sexmanual_sit')])
  }

  /**
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribe(unit, sex) {
    return [
      `a|Rep a|go down to sit.`,
      `a|Rep a|sit down.`,
    ]
  }

  rawDescribePosition(unit, sex) {
    return [
      `Sitting`,
    ]
  }
}

setup.sexpose.sit = new setup.SexPoseClass.Sit()
