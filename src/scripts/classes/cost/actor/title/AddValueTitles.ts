// @ts-nocheck

setup.qcImpl.AddValueTitles = class AddValueTitles extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {number} amount 
   */
  constructor(actor_name, amount) {
    super()
    this.actor_name = actor_name
    this.amount = amount
  }

  text() {
    return `setup.qc.AddValueTitles('${this.actor_name}', ${this.amount})`
  }

  apply(quest) {
    let target = this.amount
    const values = [
      80000,
      40000,
      20000,
      10000,
      5000,
    ]
    for (const value of values) {
      if (target >= value) {
        setup.qc.AddTitle(this.actor_name, `value_add_${value}`).apply(quest)
      }
    }
  }

  explain(quest) {
    return `${this.actor_name} gains titles to increase its value by at most ${this.amount}g`
  }
}
