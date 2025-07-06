// @ts-nocheck

export const EXPORTABLE = true

setup.SlaveOrder = class SlaveOrder extends setup.TwineClass {
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
    destination_unit_group,  // fulfilled slave moved to this unit group
  ) {
    super()

    this.key = State.variables.SlaveOrder_keygen
    State.variables.SlaveOrder_keygen += 1

    if (!name) throw new Error(`missing name for slave order`)
    this.name = name
    if (source_company) {
      this.source_company_key = setup.keyOrSelf(source_company)
    } else {
      this.source_company_key = null
    }
    if (!criteria) throw new Error(`missing criteria for ${name}`)

    this.criteria = setup.deepCopy(criteria)

    this.base_price = base_price

    this.trait_multiplier = trait_multiplier

    this.value_multiplier = value_multiplier

    this.expires_in = expires_in

    this.unit_key = null

    this.is_ignored = false

    if (destination_unit_group) {
      this.destination_unit_group_key = destination_unit_group.key
    } else {
      this.destination_unit_group_key = null
    }

    if (fulfilled_outcomes) this.fulfilled_outcomes = setup.deepCopy(fulfilled_outcomes)
    else this.fulfilled_outcomes = []

    if (unfulfilled_outcomes) this.unfulfilled_outcomes = setup.deepCopy(unfulfilled_outcomes)
    else this.unfulfilled_outcomes = []

    if (this.key in State.variables.slaveorder) throw new Error(`Duplicate slave order ${this.key}`)
    State.variables.slaveorder[this.key] = this

    State.variables.slaveorderlist._addSlaveOrder(this)
  }

  delete() { delete State.variables.slaveorder[this.key] }

  rep() {
    return setup.repMessage(this, 'slaveordercardkey')
  }

  doUnfulfill() {
    // unfulfilled, so pay the cost.
    let unfulfilled_outcomes = this.getUnfulfilledOutcomes()
    for (let i = 0; i < unfulfilled_outcomes.length; ++i) {
      unfulfilled_outcomes[i].apply(this)
    }
  }

  /**
   * @returns {setup.Unit}
   */
  getUnit = function () {
    if (!this.unit_key) return null
    return State.variables.unit[this.unit_key]
  }

  /**
   * @param {number} price 
   */
  fulfillMoney(price) {
    State.variables.company.player.addMoney(price)
  }

  /**
   * @param {setup.Unit} unit 
   */
  fulfill(unit) {
    State.variables.statistics.add('slave_order_fulfilled', 1)
    State.variables.statistics.setMax('slave_order_slave_value_max', unit.getSlaveValue())

    if (this.unit_key) throw new Error(`Already fulfilled`)
    this.unit_key = unit.key
    let price = this.getFulfillPrice(unit)

    State.variables.statistics.setMax('slave_order_money_max', price)
    State.variables.statistics.add('slave_order_money_sum', price)

    // first obtain all the outcomes
    this.fulfillMoney(price)

    let fulfilled_outcomes = this.getFulfilledOutcomes()
    for (let i = 0; i < fulfilled_outcomes.length; ++i) {
      fulfilled_outcomes[i].apply(this)
    }

    // next, book-keeping
    State.variables.slaveorderlist.archiveSlaveOrder(this)

    // add history to the unit
    unit.addHistory(` sold for ${price}g to fulfill ${this.getName()}`)

    // finally, remove unit from company, if it was ever there to begin with
    if (unit.isYourCompany()) {
      // remove from company
      State.variables.company.player.removeUnit(unit)
    } else {
      // remove from market
      const market = unit.getMarket()
      if (!market) throw new Error(`Unit must either be in your company or in the slave pens to be sold to slave order`)
      const market_object = market.getMarketObject(unit)
      market.removeObjectAndCheckDelete(market_object)
    }

    // last, move it to destination, if any
    let destination = this.getDestinationUnitGroup()
    if (destination) {
      destination.addUnit(unit)
    } else {
      setup.unitgroup.none.addUnit(unit)
    }
  }

  isFulfilled() {
    return this.unit_key
  }

  getFulfillPrice(unit) {
    let criteria = this.getCriteria()

    // special case: slave order ignores extra traits
    let mods = criteria.computeSuccessModifiers(unit, /* ignore extra traits = */ true)

    // just sum all
    let sum = (mods.crit - mods.disaster) + (mods.success - mods.failure)
    sum *= this.trait_multiplier

    sum += this.base_price

    sum += this.value_multiplier * unit.getSlaveValue()

    return Math.round(sum)
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isSatisfyRestrictions(unit) {
    if (unit.isYourCompany() && unit.isBusy()) return false

    let criteria = this.getCriteria()
    if (!criteria.isCanAssign(unit)) return false

    return true
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanFulfill(unit) {
    if (!this.isSatisfyRestrictions(unit)) return false

    if (unit.getParty()) return false

    let value = this.getFulfillPrice(unit)
    if (value <= 0) return false

    return true
  }

  getDestinationUnitGroup() {
    if (!this.destination_unit_group_key) return null
    return setup.unitgroup[this.destination_unit_group_key]
  }

  getSourceCompany() {
    if (!this.source_company_key) return null
    const company = State.variables.company[this.source_company_key]
    if (!company) throw new Error(`Missing source company for slave order with key: ${this.source_company_key}`)
    return company
  }

  getName() { return this.name }

  isExpired() { return this.getExpiresIn() <= 0 }

  getExpiresIn() { return this.expires_in }

  isCannotExpire() { return this.getExpiresIn() == setup.INFINITY }

  advanceWeek() {
    // cannot expire case:
    if (this.expires_in == setup.INFINITY) return

    this.expires_in -= 1
  }

  getFulfilledOutcomes() { return this.fulfilled_outcomes }
  getUnfulfilledOutcomes() { return this.unfulfilled_outcomes }
  getCriteria() { return this.criteria }

  /**
   * @returns {setup.DOM.Node}
   */
  explainFulfilled() {
    const money = []
    if (this.base_price) {
      money.push(setup.DOM.toString(setup.DOM.Util.money(this.base_price)))
    }
    if (this.trait_multiplier) {
      money.push(`${setup.DOM.toString(setup.DOM.Util.money(this.trait_multiplier))} x traits`)
    }
    if (this.value_multiplier) {
      money.push(`${this.value_multiplier.toFixed(2)} x value`)
    }

    let money_text = money.join(' + ')

    return html`
      ${money_text}
      ${setup.DOM.Card.cost(this.getFulfilledOutcomes(), this)}
    `
  }

  /**
   * @returns {boolean}
   */
  isIgnored() { return this.is_ignored }

  toggleIsIgnored() { this.is_ignored = !this.isIgnored() }

  /**
   * Get a random number for this slave order that remains the same always.
   */
  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }
}
