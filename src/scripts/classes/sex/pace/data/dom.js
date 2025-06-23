setup.SexPaceClass.Dom = class Dom extends setup.SexPace {
  constructor() {
    super(
      'dom',
      [ /* tags */
      ],
      'Dominant',
      'Will try to top',
      1,  /* base chance */
      {
        per_chaste: -1,
        per_proud: 1,
        per_humble: -1,
        per_cruel: 1,
        per_kind: -1,
        per_aggressive: 2,
        per_dominant: 3,
        per_submissive: -3,
        per_evil: 1,
        per_honorable: -1,
        per_playful: 1,
        per_serious: -1,
        per_stubborn: -1,
        per_curious: 1,
      },
    )
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Sex} sex 
   * @returns {string | string[]}
   */
  rawRepStart(unit, sex) {
    return [
      `a|Rep a|is feeling strong and powerful, ready to control the entire intercourse.`,
      `a|Rep a|is feeling dominant right now.`,
      `As it happens, a|rep a|is feeling rather powerful right now. Woes be to whoever it is that a|they a|get to victimize today.`,
    ]
  }

  repAdverb(unit, sex) {
    return setup.rng.choice([
      'violently',
      'roughly',
      'mercilessly',
      'brutally',
      'forcefully',
    ])
  }
}

setup.sexpace.dom = new setup.SexPaceClass.Dom()
