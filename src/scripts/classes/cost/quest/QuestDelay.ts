// @ts-nocheck


setup.qcImpl.QuestDelay = class QuestDelay extends setup.Cost {
  /**
   * @param {object | string} questpool
   * @param {number} quantity
   */
  constructor(questpool, quantity) {
    super()

    // if quantity is not provided, then just one
    if (quantity === undefined) quantity = 1

    if (setup.isString(questpool)) {
      this.questpool_key = questpool
    } else {
      this.questpool_key = questpool.key
    }
    this.quantity = quantity
  }

  text() {
    return `setup.qc.QuestDelay(setup.questpool.${this.questpool_key}, ${this.quantity})`
  }

  isOk() {
    throw new Error(`quest should not be a cost`)
  }

  apply(quest) {
    let questpool = setup.questpool[this.questpool_key]
    State.variables.questgen.queue(questpool, this.quantity)
    setup.notify(`Obtained ${this.quantity} new quests or opportunities from ${questpool.getName()}`)
  }

  undoApply() {
    throw new Error(`quest should not be a cost`)
  }

  explain() {
    let questpool = setup.questpool[this.questpool_key]
    return `${this.quantity} new quests from ${questpool.getName()}`
  }
}
