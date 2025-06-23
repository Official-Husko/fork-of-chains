// gives one of the costs as reward, at random, based on the quest's seed value.
setup.qcImpl.OneRandomSeed = class OneRandomSeed extends setup.Cost {
  /**
   * @param {setup.Cost[]} costs 
   */
  constructor(costs) {
    super()

    this.costs = costs
  }

  text() {
    let texts = []
    for (let i = 0; i < this.costs.length; ++i) {
      texts.push(this.costs[i].text())
    }
    return `setup.qc.OneRandomSeed([\n${texts.join(',\n')}\n])`
  }

  getSeededCost(quest) {
    return this.costs[quest.getSeed() % this.costs.length]
  }

  /**
   * @param {setup.QuestInstance} quest 
   */
  apply(quest) {
    const cost = this.getSeededCost(quest)
    return cost.apply(quest)
  }

  explain(quest) {
    if (quest) {
      const cost = this.getSeededCost(quest)
      return cost.explain(quest)
    }
    let texts = []
    for (let i = 0; i < this.costs.length; ++i) {
      texts.push(this.costs[i].explain())
    }
    return `<div class='card lorecard'> A random (SEEDED) effect out of:<br/>${texts.join('<br/>')}</div>`
  }

  getLayout() {
    return {
      css_class: "card lorecard",
      blocks: [
        {
          passage: "CostOneRandomSeedHeader",
          // addpassage: "QGAddCostActual",
          listpath: ".costs"
        },
      ]
    }
  }

  isOk(quest) {
    const cost = this.getSeededCost(quest)
    return cost.isOk(quest)
  }

  undoApply(quest) {
    const cost = this.getSeededCost(quest)
    cost.undoApply(quest)
  }

}
