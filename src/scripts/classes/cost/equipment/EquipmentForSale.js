
setup.qcImpl.EquipmentForSale = class EquipmentForSale extends setup.Cost {
  /**
   * @param {setup.EquipmentPool | string} equipment_pool 
   * @param {number} amount 
   * @param {number} [markup]
   */
  constructor(equipment_pool, amount, markup) {
    super()

    if (!equipment_pool) throw new Error(`Missing equipment pool for equipment for sale`)

    this.equipment_pool_key = setup.keyOrSelf(equipment_pool)
    this.markup = markup || 1.0

    if (!amount) {
      this.amount = 1
    } else {
      this.amount = amount
    }
  }

  text() {
    return `setup.qc.EquipmentForSale('${this.equipment_pool_key}', ${this.amount}, ${this.markup})`
  }

  apply(quest) {
    let market = this.getMarket()
    let pool = setup.equipmentpool[this.equipment_pool_key]
    for (let i = 0; i < this.amount; ++i) {
      let equipment = pool.generateEquipment()
      new setup.MarketObject(
        equipment,
        /* price = */ Math.round(equipment.getValue() * this.markup),
        setup.MARKET_OBJECT_EQUIPMENT_EXPIRATION,
        market,
        quest,
      )
    }
  }

  getMarket() { return State.variables.market.equipmentmarket }

  explain(quest) {
    return `${this.amount} new items in ${this.getMarket().rep()} at ${this.markup}x price`
  }
}
