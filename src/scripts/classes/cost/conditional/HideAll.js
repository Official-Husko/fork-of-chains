/**
 * Hide the costs from the user by masking its description.
 */
setup.qcImpl.HideAll = class HideAll extends setup.Cost {
  /**
   * @param {Array.<setup.Cost>} costs
   * @param {string} explanation_text
   */
  constructor(costs, explanation_text) {
    super()

    this.costs = costs
    this.explanation_text = explanation_text
    if (!Array.isArray(costs)) throw new Error(`First element of setup.qc.HideAll must be array, not ${costs}`)
  }

  text() {
    return `setup.qc.HideAll([\n${this.costs.map(a => a.text()).join(',\n')}\n], "${setup.escapeJsString(this.explanation_text)}")`
  }

  /**
   * @param {object} quest
   */
  apply(quest) {
    for (let i = 0; i < this.costs.length; ++i) {
      this.costs[i].apply(quest)
    }
  }

  /**
   * @param {object} quest
   */
  explain(quest) {
    return this.explanation_text
  }

  getLayout() {
    return {
      css_class: "bedchambercard",
      blocks: [
        {
          passage: "CostHideAllHeader",
          listpath: ".costs"
        },
      ]
    }
  }
}
