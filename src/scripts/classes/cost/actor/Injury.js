
setup.qcImpl.Injury = class Injury extends setup.Cost {
  constructor(actor_name, injury_amt) {
    super()

    this.actor_name = actor_name
    this.injury_amt = injury_amt
  }

  static NAME = 'Injure Unit'
  static PASSAGE = 'CostInjury'
  static UNIT = true

  text() {
    return `setup.qc.Injury('${this.actor_name}', ${this.injury_amt})`
  }


  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.hospital.injureUnit(unit, this.injury_amt)
  }

  undoApply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.hospital.healUnit(unit, this.injury_amt)
  }

  explain(quest) {
    return `${this.actor_name} injured for ${this.injury_amt} week` + (this.injury_amt === 1 ? '' : 's')
  }
}
