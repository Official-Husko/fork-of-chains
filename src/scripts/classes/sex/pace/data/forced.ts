// @ts-nocheck

setup.SexPaceClass.Forced = class Forced extends setup.SexPace {
  constructor() {
    super(
      'forced',
      [ /* tags */
      ],
      'Forced',
      'Will try to bottom to avoid punishment',
      0,  /* base chance */
      {
        per_lunatic: 1,
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
      `a|Rep a|have resigned to a|their fate of being a sexual plaything, and a|hope to try a|their best to avoid punishment.`,
      `Fear has been deeply instilled into a|reps mind, who will do anything to avoid more punishment.`,
      `The sex might not be entirely enjoyable to a|rep yet, but in time the last remnant of resistance shall too be cleansed from a|their mind`,
    ]
  }

  repAdverb(unit, sex) {
    return setup.rng.choice([
      'hesitantly',
      'worriedly',
      'anxiously',
      'clumsily',
    ])
  }
}

setup.sexpace.forced = new setup.SexPaceClass.Forced()
