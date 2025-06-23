
setup.qcImpl.SlaveOrderSeaborneRescueItHasToBeYouEasyToPleasePirate = class SlaveOrderSeaborneRescueItHasToBeYouEasyToPleasePirate extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = 4000
    this.value_multi = 1

    this.name = 'Easy-to-Please Pirate Order'
    this.company_key = 'outlaws'
    this.expires_in = 4
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSeaborneRescueItHasToBeYouEasyToPleasePirate()`
  }

  getCriteria(quest) {
    let chances = setup.UnitPoolTraitAlloc.getBaseTraitPreferences(setup.trait.gender_male).per.chances
    let randomtraits = setup.UnitPool.generateTraitsFromObj(chances, 7, 7)

    let critical = randomtraits.map(a => setup.trait[a])
    let disaster = []

    let gender = State.variables.settings.getGenderRandom(setup.job.slave)

    let req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(gender),
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Easy-to-Please Pirate Order', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
