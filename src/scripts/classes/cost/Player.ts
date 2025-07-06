// @ts-nocheck


setup.qcImpl.Player = class Player extends setup.Cost {
  constructor(cost) {
    super()

    this.cost = cost
  }

  text() {
    return `setup.qc.Player(${this.cost.text()})`
  }

  isOk(quest) {
    throw new Error(`not cost`)
  }

  apply(quest) {
    this.cost.apply({
      getActorUnit: () => State.variables.unit.player
    })
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `Player gets: ${this.cost.explain()}`
  }
}
