
setup.qcImpl.AddHistory = class AddHistory extends setup.Cost {
  constructor(actor_name, history) {
    super()

    this.actor_name = actor_name
    this.history = history
  }

  text() {
    return `setup.qc.AddHistory('${this.actor_name}', "${this.history}")`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.addHistory(this.history, quest, true)
    if (unit.isYourCompany()) {
      const parsed = setup.Text.replaceUnitMacros(this.history, {a: unit})
      setup.notify(`An important moment for a|rep as a|they ${parsed}`, {a: unit})
    }
  }

  explain(quest) {
    return `${this.actor_name} gains a history: "${this.history}"`
  }
}
