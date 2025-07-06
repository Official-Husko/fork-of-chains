// @ts-nocheck


setup.qcImpl.SlaveOrderSeaborneRescueItHasToBeYouNouveauRichePirate = class SlaveOrderSeaborneRescueItHasToBeYouNouveauRichePirate extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()
  
    this.base_price = 0
    this.trait_multi = 0
    this.value_multi = 1.5
  
    this.criteria = setup.CriteriaHelper.Name('Nouveau Riche Pirate Order', setup.qu.slave)
    this.name = 'Nouveau Riche Pirate Order'
    this.company_key = 'outlaws'
    this.expires_in = 4
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSeaborneRescueItHasToBeYouNouveauRichePirate()`
  }
}
