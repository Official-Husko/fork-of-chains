// @ts-nocheck


setup.qcImpl.SlaveOrderSafariZone = class SlaveOrderSafariZone extends setup.qcImpl.SlaveOrderTemplate {
  constructor(value_multi) {
    super()
  
    this.base_price = setup.MONEY_PER_SLAVER_WEEK
    this.trait_multi = setup.MONEY_PER_SLAVER_WEEK * 5
    this.value_multi = value_multi
  
    let criteria = setup.CriteriaHelper.DisasterTraits(
      [
        setup.trait.eq_valuable,
        setup.trait.eq_veryvaluable,
      ].concat(setup.TraitHelper.TRAINING_ALL_INCL_MINDBREAK),
      setup.qu.slave,
    )
  
    this.criteria = criteria
    this.name = 'Order from Safari Zone'
    this.company_key = 'independent'
    this.expires_in = 6
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSafariZone(${this.value_multi})`
  }
}
