// @ts-nocheck

// gives one of the costs as reward, at random.
setup.qcImpl.OneRandom = class OneRandom extends setup.Cost {
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
    return `setup.qc.OneRandom([\n${texts.join(',\n')}\n])`
  }

  isOk(quest) {
    for (let i = 0; i < this.costs.length; ++i) {
      // @ts-ignore
      if (!this.costs[i].isOk(quest)) return false
    }
    return true
  }

  apply(quest) {
    let cost = setup.rng.choice(this.costs)
    return cost.apply(quest)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let texts = []
    for (let i = 0; i < this.costs.length; ++i) {
      texts.push(this.costs[i].explain())
    }
    return `<div class='card lorecard'> A random effect out of:<br/>${texts.join('<br/>')}</div>`
  }

  getLayout() {
    return {
      css_class: "card lorecard",
      blocks: [
        {
          passage: "CostOneRandomHeader",
          // addpassage: "QGAddCostActual",
          listpath: ".costs"
        },
      ]
    }
  }
}
