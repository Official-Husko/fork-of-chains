// @ts-nocheck

import { } from "./slaveorder"

// slave order that rewards item instead of money
setup.SlaveOrderItem = class SlaveOrderItem extends setup.SlaveOrder {
  /**
   * @param {string} name 
   * @param {setup.Company | string} source_company 
   * @param {setup.UnitCriteria} criteria 
   * @param {number} base_price 
   * @param {number} trait_multiplier 
   * @param {number} value_multiplier 
   * @param {number} expires_in 
   * @param {setup.Cost[]} fulfilled_outcomes 
   * @param {setup.Cost[]} unfulfilled_outcomes 
   * @param {*} destination_unit_group 
   * @param {setup.Item} item 
   * @param {number} maximum
   */
  constructor(
    name,
    source_company,
    criteria,
    base_price,
    trait_multiplier,
    value_multiplier,
    expires_in,
    fulfilled_outcomes,
    unfulfilled_outcomes,
    destination_unit_group,
    item,
    maximum,
  ) {
    super(
      name,
      source_company,
      criteria,
      base_price,
      trait_multiplier,
      value_multiplier,
      expires_in,
      fulfilled_outcomes,
      unfulfilled_outcomes,
      destination_unit_group,
    )
    this.item_key = item.key
    this.maximum = maximum
  }

  getMaximum() { return this.maximum }

  /**
   * @returns {setup.Item}
   */
  getItem() { return setup.item[this.item_key] }

  /**
   * @param {number} price 
   */
  fulfillMoney(price) {
    const items = Math.min(Math.floor(price / this.getItem().getValue()), this.getMaximum())
    const cost = setup.qc.Item(this.getItem())
    for (let i = 0; i < items; ++i) {
      cost.apply()
    }
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanFulfill(unit) {
    const value = this.getFulfillPrice(unit)
    if (value < this.getItem().getValue()) {
      return false
    }

    return super.isCanFulfill(unit)
  }
}
