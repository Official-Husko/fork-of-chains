
// give a fixed amount of money scaled according to the quest difficulty.

import { ContentTemplate } from "../../content/ContentTemplate"

// eg.., 1500g is 1500g for lv40 quest, but becomes 600g for lv1 quest.
setup.qcImpl.MoneyCustom = class MoneyCustom extends setup.qcImpl.Money {
  constructor(money) {
    super(money)
  }

  static NAME = 'Gain Money'
  static PASSAGE = 'CostMoneyCustom'

  text() {
    return `setup.qc.MoneyCustom(${this.money})`
  }

  explain(quest) {
    if (quest) {
      return super.explain(quest)
    } else {
      return `Scaled money: ${setup.DOM.toString(setup.DOM.Util.money(this.money))}`
    }
  }

  getMoney(quest) {
    let base = this.money

    // scale based on level, if the quest is given
    if (quest && 'getTemplate' in quest) {
      let level = quest.getTemplate().getDifficulty().getLevel()

      // scale based on PLATEAU
      let diff1 = `normal${level}`
      let diff2 = `normal${setup.LEVEL_PLATEAU}`
      base = Math.round(base * setup.qdiff[diff1].getMoney() / setup.qdiff[diff2].getMoney())
    }

    return Math.max(base, 1)
  }
}
