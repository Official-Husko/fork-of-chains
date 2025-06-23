
setup.qresImpl.Money = class Money extends setup.Restriction {
  constructor(money) {
    super()

    this.money = money
  }

  static NAME = 'Money minimum'
  static PASSAGE = 'RestrictionMoney'

  text() {
    return `setup.qres.Money(${this.money})`
  }

  explain() {
    return `Minimum money: ${this.money}`
  }

  isOk() {
    if (!this.money) return true
    return State.variables.company.player.getMoney() >= this.money
  }
}
