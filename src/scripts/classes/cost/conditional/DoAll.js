
setup.qcImpl.DoAll = class DoAll extends setup.Cost {
  /**
   * @param {Array.<setup.Cost>} costs
   * @param {number=} probability
   */
  constructor(costs, probability) {
    super()

    this.costs = costs
    this.probability = probability
    if (!Array.isArray(costs)) throw new Error(`First element of setup.qc.DoAll must be array, not ${costs}`)
  }

  text() {
    return `setup.qc.DoAll([\n${this.costs.map(a => a.text()).join(',\n')}\n], ${this.probability})`
  }

  /**
   * @param {object} quest
   */
  apply(quest) {
    if (this.probability === undefined || Math.random() < this.probability) {
      for (let i = 0; i < this.costs.length; ++i) {
        this.costs[i].apply(quest)
      }
    }
  }

  /**
   * @param {object} quest
   */
  explain(quest) {
    let _prob = ''
    if (this.probability !== undefined) _prob = ` (with ${(this.probability * 100).toFixed(1)}% chance)`
    return `<div class='bedchambercard'>Do all:${_prob}<br/> ${this.costs.map(a => a.explain(quest)).join('<br/>')}</div>`
  }

  getLayout() {
    return {
      css_class: "bedchambercard",
      blocks: [
        {
          passage: "CostDoAllHeader",
          listpath: ".costs"
        },
      ]
    }
  }

  isOk(quest) {
    if (this.probability) throw new Error(`DoAll with probability is not a cost`)
    for (const cost of this.costs) {
      if (!(cost.isOk(quest))) return false
    }
    return true
  }

  undoApply(quest) {
    if (this.probability) throw new Error(`DoAll with probability is not undo-able`)
    for (const cost of this.costs) {
      cost.undoApply(quest)
    }
  }

}
