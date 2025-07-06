// @ts-nocheck

// slave order that reward items instead of money
import "./SlaveOrderTemplate";

setup.qcImpl.SlaveOrderItem = class SlaveOrderItem extends setup.qcImpl.SlaveOrderTemplate {
  /**
   * @param {setup.Item | string} item 
   * @param {number} maximum
   */
  constructor(item, maximum) {
    super()

    this.item_key = setup.keyOrSelf(item)
    this.maximum = maximum
  }

  text() {
    return `setup.qc.SlaveOrderItem('${this.item_key}')`
  }

  /**
   * @returns {setup.Item}
   */
  getItem() {
    return setup.item[this.item_key]
  }

  apply(quest) {
    return new setup.SlaveOrderItem(
      this.getName(quest),
      this.getCompany(quest),
      this.getCriteria(quest),
      this.getBasePrice(quest),
      this.getTraitMulti(quest),
      this.getValueMulti(quest),
      this.getExpiresIn(quest),
      this.getFulfilledOutcomes(quest),
      this.getUnfulfilledOutcomes(quest),
      this.getDestinationUnitGroup(quest),
      this.getItem(),
      this.maximum,
    )
  }
}
