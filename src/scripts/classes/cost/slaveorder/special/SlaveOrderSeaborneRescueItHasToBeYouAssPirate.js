
setup.qcImpl.SlaveOrderSeaborneRescueItHasToBeYouAssPirate = class SlaveOrderSeaborneRescueItHasToBeYouAssPirate extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = 6000
    this.value_multi = 1

    this.criteria = new setup.UnitCriteria(
      null, /* key */
      'Ass Pirate Order', /* title */
      [setup.trait.anus_tight, setup.trait.training_anal_basic, setup.trait.training_anal_advanced, setup.trait.training_anal_master],
      [],
      [
        setup.qres.Job(setup.job.slave),
        setup.qres.Or([
          setup.qres.Trait(setup.trait.training_anal_basic),
          setup.qres.Trait(setup.trait.anus_tight),
        ]),
      ],
      {}  /* skill effects */
    )

    this.name = 'Ass Pirate Order'
    this.company_key = 'outlaws'
    this.expires_in = 4
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSeaborneRescueItHasToBeYouAssPirate()`
  }
}
