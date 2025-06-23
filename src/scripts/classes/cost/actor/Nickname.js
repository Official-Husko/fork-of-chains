
// resets background trait to the given trait.
setup.qcImpl.Nickname = class Nickname extends setup.Cost {
  constructor(actor_name, nickname) {
    super()

    this.actor_name = actor_name
    this.nickname = nickname
  }

  text() {
    return `setup.qc.Nickname('${this.actor_name}', '${setup.escapeJsString(this.nickname)}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.nickname = this.nickname
  }

  explain(quest) {
    return `${this.actor_name} is nicknamed ${this.nickname}`
  }
}
