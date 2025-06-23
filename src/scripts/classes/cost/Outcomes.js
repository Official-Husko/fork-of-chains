// Get all outcomes from another result, e.g., all outcomes from success.
setup.qcImpl.Outcomes = class Outcomes extends setup.Cost {
  /**
   * @param {string} result 
   */
  constructor(result) {
    super()

    if (!(['crit', 'success', 'failure', 'disaster'].includes(result))) {
      throw new Error(`Outcomes must be either crit, success, failure, or disaster, NOT ${result}`)
    }
    this.result = result
  }

  text() {
    return `setup.qc.Outcomes("${this.result}")`
  }

  /**
   * @param {setup.QuestInstance} quest 
   */
  apply(quest) {
    const index = setup.QuestTemplate.resultIndex(this.result)
    // ignore experience, avoid doubling them.
    const costs = quest.getTemplate().getOutcomes()[index][1].filter(cost => !(cost instanceof setup.qcImpl.Exp))
    setup.RestrictionLib.applyAll(costs, quest)
  }

  explain() {
    return `Apply all outcomes from this quest on result: "${this.result}"`
  }
}
