
setup.qcImpl.SlaveOrderMenial = class SlaveOrderMenial extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()
  
    this.trait_multi = 0
    this.value_multi = 0
  
    this.criteria = new setup.UnitCriteria(
      null, /* key */
      'Menial Slave Order', /* title */
      [],  /* critical, */
      [],  /* disaster, */
      [  /* restrictions */
        setup.qres.Job(setup.job.slave),
      ],
      {}  /* skill effects */
    )
    this.name = 'Order for a menial slave from a nearby mine'
    this.company_key = 'independent'
    this.expires_in = setup.INFINITY
  
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  getFulfilledOutcomes(quest) {
    return [new setup.qcImpl.SlaveOrderMenial()]
  }

  explain(quest) {
    return `Another menial slave order`
  }

  text() {
    return `setup.qc.SlaveOrderMenial()`
  }

  getBasePrice(quest) {
    let level = Math.min(State.variables.unit.player.getLevel(), setup.LEVEL_PLATEAU)
    let diff = setup.qdiff[`normal${level}`]
    return Math.round(setup.SLAVE_ORDER_MENIAL_MULTI * diff.getMoney())
  }
}
