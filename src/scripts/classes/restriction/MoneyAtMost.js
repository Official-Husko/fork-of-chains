setup.qresImpl.MoneyAtMost = class MoneyAtMost extends setup.Restriction {
  constructor(money) {
    super()

    this.money = money
  }

  text() {
    return `setup.qres.MoneyAtMost(${this.money})`
  }

  explain() {
    return `Maximum money: ${this.money}`
  }

  isOk() {
    return State.variables.company.player.getMoney() <= this.money
  }
}
