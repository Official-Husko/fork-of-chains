// @ts-nocheck


setup.qcImpl.SlaveOrderHoundmastery = class SlaveOrderHoundmastery extends setup.qcImpl.SlaveOrderTemplate {
  constructor(required_trait) {
    super()

    this.base_price = 1
    this.trait_multi = 0
    this.value_multi = 0

    this.name = 'Order from the master of hounds'
    this.company_key = 'neko'
    this.expires_in = 16
    this.fulfilled_outcomes = [
      setup.qc.HideAll([
        setup.qc.VarAdd('houndmaster_pets_delivered', 1, 16),
      ], '???')
    ]
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
    this.trait_key = setup.keyOrSelf(required_trait)
  }

  text() {
    return `setup.qc.SlaveOrderHoundmastery(${this.value_multi})`
  }


  getCriteria(quest) {
    const critical = [
    ]
    const disaster = [
    ]

    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(this.trait_key),
      setup.qres.Trait(setup.trait.training_pet_advanced),
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Master of Hounds Order', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
