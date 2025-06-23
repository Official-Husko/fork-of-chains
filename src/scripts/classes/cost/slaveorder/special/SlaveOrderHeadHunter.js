
setup.qcImpl.SlaveOrderHeadHunter = class SlaveOrderHeadHunter extends setup.qcImpl.SlaveOrderTemplate {
  constructor(is_crit) {
    super()

    this.base_price = setup.MONEY_PER_SLAVER_WEEK * 1.5
    this.trait_multi = setup.MONEY_PER_SLAVER_WEEK
    this.value_multi = 1.0
    if (is_crit) this.value_multi = 2.0
    this.is_crit = is_crit

    this.name = 'Order from the Head Hunter Inc.'
    this.company_key = 'humankingdom'
    this.expires_in = 14
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = [setup.qc.MoneyMult(-3)]
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderHeadHunter(${this.is_crit})`
  }


  getCriteria(quest) {
    const chances = setup.UnitPoolTraitAlloc.getBaseTraitPreferences(setup.trait.gender_male).per.chances
    let randomtraits = setup.UnitPool.generateTraitsFromObj(chances, 5, 5)

    let critical = [
      setup.trait[randomtraits[0]],
      setup.trait[randomtraits[1]],
      setup.trait[randomtraits[2]],
    ]
    let disaster = [
      setup.trait[randomtraits[3]],
      setup.trait[randomtraits[4]],
    ]

    // retrieve a random training
    let trainings = setup.TraitHelper.TRAINING_BASIC_GENDERLESS
    let training = trainings[Math.floor(Math.random() * trainings.length)]
    critical.push(training)

    // retrieve a random race
    const races = [
      setup.trait.subrace_humankingdom,
      setup.trait.subrace_humanvale,
      setup.trait.race_elf,
      setup.trait.race_catkin,
      setup.trait.race_wolfkin,
    ]
    let race = races[Math.floor(Math.random() * races.length)]

    let req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(race),
      setup.qres.Trait(setup.trait.training_obedience_basic,)
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Head Hunter Inc Order Slave', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
