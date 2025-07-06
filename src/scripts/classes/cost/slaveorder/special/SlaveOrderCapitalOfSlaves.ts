// @ts-nocheck


setup.qcImpl.SlaveOrderCapitalOfSlaves = class SlaveOrderCapitalOfSlaves extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = setup.MONEY_PER_SLAVER_WEEK * 2
    this.value_multi = 0.9

    this.name = 'Order from the Capital of Slaves'
    this.company_key = 'humandesert'
    this.expires_in = 8
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.subrace_humandesert.key
  }


  text() {
    return `setup.qc.SlaveOrderCapitalOfSlaves()`
  }


  getCriteria(quest) {
    // retrieve three random basic trainings, two advanced, one master.
    let basics = setup.rng.choicesRandom(setup.TraitHelper.TRAINING_BASIC_GENDERLESS, 2)
    let adv = setup.rng.choicesRandom(setup.TraitHelper.TRAINING_ADVANCED_GENDERLESS, 2)
    let mas = setup.rng.choicesRandom(setup.TraitHelper.TRAINING_MASTER_GENDERLESS, 1)

    let critical = [
      basics[0],
      basics[1],
      adv[0],
      adv[1],
      mas[0],
    ]
    let disaster = [
      setup.trait.training_none,
    ]

    let req = [
      setup.qres.Job(setup.job.slave),
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Capital of Slaves Order Slave', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
