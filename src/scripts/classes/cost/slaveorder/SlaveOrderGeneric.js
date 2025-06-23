
setup.qcImpl.SlaveOrderGeneric = class SlaveOrderGeneric extends setup.qcImpl.SlaveOrderTemplate {
  constructor(
    name,
    company,
    expires_in,
    base_price_mult,
    trait_mult,
    value_mult,
    fulfilled,
    unfulfilled
  ) {
    super()
  
    this.base_price = setup.MONEY_PER_SLAVER_WEEK * base_price_mult
    this.trait_multi = setup.MONEY_PER_SLAVER_WEEK * trait_mult
    this.value_multi = value_mult
  
    this.criteria = setup.qu.slave,
    this.name = name
    this.company_key = setup.keyOrSelf(company)
    this.expires_in = expires_in
    this.fulfilled_outcomes = []
    if (fulfilled) this.fulfilled_outcomes = fulfilled
    this.unfulfilled_outcomes = []
    if (unfulfilled) this.unfulfilled_outcomes = unfulfilled
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }
}
