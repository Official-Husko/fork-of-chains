setup.SexPaceClass.Resist = class Resist extends setup.SexPace {
  constructor() {
    super(
      'resist',
      [ /* tags */
      ],
      'Resist',
      'Will try to resist getting penetrated',
      0,  /* base chance */
      {
        per_lunatic: 1,
      },
    )
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawRepStart(unit, sex) {
    const location = sex.getLocation().repRoom(sex)
    return [
      `a|Reps begging falls on deaf ears as a|they a|is being dragged into the ${location}.`,
      `a|Rep a|beg to stop which only serve to delight a|their would-be sexual partners.`,
      `a|Rep a|thrash in a|their bonds as a|they a|is being dragged deeper into the ${location} for some fun time.`,
    ]
  }

  repAdverb(unit, sex) {
    return setup.rng.choice([
      'stressfully'
    ])
  }
}

setup.sexpace.resist = new setup.SexPaceClass.Resist()
