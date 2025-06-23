
setup.qcImpl.SlaveOrderSeaborneRescueItHasToBeYouDemon = class SlaveOrderSeaborneRescueItHasToBeYouDemon extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 15000
    this.trait_multi = 0
    this.value_multi = 0

    this.criteria = new setup.UnitCriteria(
      null, /* key */
      'Pirate Captain Order (First Mate)', /* title */
      [],
      [],
      [
        setup.qres.Job(setup.job.slave),
        setup.qres.Trait(setup.trait.race_demon),
      ],
      {}  /* skill effects */
    )

    this.name = 'Pirate Captain Order (First Mate)'
    this.company_key = 'outlaws'
    this.expires_in = 12
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSeaborneRescueItHasToBeYouDemon()`
  }
}
