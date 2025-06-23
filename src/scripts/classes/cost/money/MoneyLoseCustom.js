
// give a fixed amount of money scaled according to the quest difficulty.
// eg.., 1500g is 1500g for lv40 quest, but becomes 600g for lv1 quest.
setup.qcImpl.MoneyLoseCustom = class MoneyLoseCustom extends setup.qcImpl.MoneyCustom {
  constructor(money) {
    super(-money)
  }

  static NAME = 'Lose Money'
  static PASSAGE = 'CostMoneyLoseCustom'
}
