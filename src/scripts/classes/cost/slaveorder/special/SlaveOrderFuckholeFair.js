
setup.qcImpl.SlaveOrderFuckholeFair = class SlaveOrderFuckholeFair extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()
  
    this.base_price = 0
    this.trait_multi = 0
  
    this.criteria = setup.qu.slave
    this.name = 'Order for a slave from a contact you meet at the fuckhole fair'
    this.company_key = 'humanvale'
    this.expires_in = 4
  
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderFuckholeFair()`
  }

  getValueMulti(quest) {
    return setup.lowLevelMoneyMulti()
  }
}
