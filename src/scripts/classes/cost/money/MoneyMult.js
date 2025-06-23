
// money multipled by setup.MONEY_PER_SLAVER_WEEK = 500
setup.qcImpl.MoneyMult = class MoneyMult extends setup.qcImpl.Money {
  constructor(multi) {
    super(multi * setup.MONEY_PER_SLAVER_WEEK)
  }
}
