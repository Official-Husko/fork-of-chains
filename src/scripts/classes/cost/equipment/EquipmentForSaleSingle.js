
setup.qcImpl.EquipmentForSaleSingle = class EquipmentForSaleSingle extends setup.Cost {
  /**
   * 
   * @param {setup.Equipment | string} equipment 
   */
  constructor(equipment) {
    super()

    if (!equipment) throw new Error(`Missing equipment for equipment for sale`)

    this.equipment_key = setup.keyOrSelf(equipment)
  }

  apply(quest) {
    const market = this.getMarket()
    const equipment = setup.equipment[this.equipment_key]
    new setup.MarketObject(
      equipment,
      /* price = */ equipment.getValue(),
      setup.MARKET_OBJECT_EQUIPMENT_EXPIRATION,
      market,
      quest,
    )
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  getMarket() { return State.variables.market.equipmentmarket }

  explain(quest) {
    const equipment = setup.equipment[this.equipment_key]
    return `${this.getMarket().rep()} now sells ${equipment.rep()}`
  }
}
