setup.qcImpl.SlaveOrderDrow = class SlaveOrderDrow extends setup.qcImpl.SlaveOrderTemplate {
  /**
   * @param {number} base_price 
   */
  constructor(base_price) {
    super()

    this.base_price = base_price
    this.trait_multi = 500
    this.value_multi = 0
    this.expires_in = 6

    this.name = "Order for a slave from V'errmyrdn"
    this.company_key = 'drow'
  }

  getCriteria(quest) {
    const disaster = []
    const critical = [setup.rng.choice(
      setup.TraitHelper.getAllTraitsOfTags(['per'])
    )]

    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.NoTrait(setup.trait.training_mindbreak),
    ]

    const criteria = new setup.UnitCriteria(
      null, /* key */
      "Slave Order from V'errmyrdn", /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }

  text() {
    return `setup.qc.SlaveOrderDrow(${this.base_price})`
  }
}
