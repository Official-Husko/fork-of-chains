// @ts-nocheck


setup.qcImpl.Quest = class Quest extends setup.Cost {
  constructor(questpool, quantity) {
    super()

    // if quantity is not provided, then just one
    if (quantity === undefined) quantity = 1

    this.questpool_key = questpool.key
    this.quantity = quantity
  }

  static NAME = 'Gain a quest from a quest pool'
  static PASSAGE = 'CostQuest'

  text() {
    return `setup.qc.Quest(setup.questpool.${this.questpool_key}, ${this.quantity})`
  }

  isOk() {
    throw new Error(`quest should not be a cost`)
  }

  apply(quest) {
    let questpool = setup.questpool[this.questpool_key]
    let generated = 0
    for (let i = 0; i < this.quantity; ++i) {
      if (questpool.generateQuest()) generated += 1
    }
    if (generated) {
      setup.notify(`Obtained ${generated} new quests or opportunities from ${questpool.getName()}`)
    }
  }

  undoApply() {
    throw new Error(`quest should not be a cost`)
  }

  explain() {
    let questpool = setup.questpool[this.questpool_key]
    return `${this.quantity} new quests from ${questpool.getName()} (immediately)`
  }
}
