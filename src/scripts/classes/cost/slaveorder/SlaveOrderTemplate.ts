// @ts-nocheck

export const EXPORTABLE = true

// can also be used as reward. Eg.., Money(-20) as cost, Money(20) as reward.
/**
 * Base class for SlaveOrder costs
 */
setup.qcImpl.SlaveOrderTemplate = class SlaveOrderTemplate extends setup.Cost {
  constructor() {
    super()

    // Init with default values (subclasses can overwrite them)

    this.name = 'unknown'
    this.company_key = 'independent'

    this.criteria = setup.qu.slave

    this.base_price = 0
    this.trait_multi = 0
    this.value_multi = 0
    this.expires_in = 1

    /** @type {setup.Cost[]} */
    this.fulfilled_outcomes = []

    /** @type {setup.Cost[]} */
    this.unfulfilled_outcomes = []

    this.destination_unit_group_key = 'soldslaves'
  }

  getName(quest) { return this.name }
  getCompany(quest) { return State.variables.company[this.company_key] }
  getCriteria(quest) { return this.criteria }

  /**
   * @param {number} price 
   * @param {setup.QuestInstance} quest 
   */
  _adjustPrice(price, quest) {
    if (!quest) return price
    if (!('getTemplate' in quest)) return price
    if (!('getDifficulty' in quest.getTemplate())) return price
    let diff = quest.getTemplate().getDifficulty()
    if (diff.level >= setup.LEVEL_PLATEAU) return price
    // scale based on PLATEAU
    let diff1 = `normal${diff.level}`
    let diff2 = `normal${setup.LEVEL_PLATEAU}`
    return price * setup.qdiff[diff1].getMoney() / setup.qdiff[diff2].getMoney()
  }

  getBasePrice(quest) {
    return Math.round(this._adjustPrice(this.base_price, quest))
  }

  getTraitMulti(quest) {
    return Math.round(this._adjustPrice(this.trait_multi, quest))
  }

  getValueMulti(quest) {
    return this._adjustPrice(this.value_multi, quest)
  }

  getExpiresIn(quest) { return this.expires_in }
  getFulfilledOutcomes(quest) { return this.fulfilled_outcomes }
  getUnfulfilledOutcomes(quest) { return this.unfulfilled_outcomes }
  getDestinationUnitGroup(quest) { return setup.unitgroup[this.destination_unit_group_key] }


  apply(quest) {
    return new setup.SlaveOrder(
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
    )
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.getName(quest)}`
  }
}
