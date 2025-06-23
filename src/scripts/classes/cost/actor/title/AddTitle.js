
setup.qcImpl.AddTitle = class AddTitle extends setup.Cost {
  constructor(actor_name, title) {
    super()
    this.actor_name = actor_name
    this.title_key = setup.keyOrSelf(title)
  }

  text() {
    return `setup.qc.AddTitle('${this.actor_name}', '${this.title_key}')`
  }

  apply(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    const title = setup.title[this.title_key]
    if (State.variables.titlelist.isHasTitle(unit, title)) {
    } else {
      State.variables.titlelist.addTitle(unit, setup.title[this.title_key])
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|gain ${title.rep()}.`, { a: unit })
      }
    }
  }

  explain(quest) {
    let title = setup.title[this.title_key]
    return `${this.actor_name} gains ${title.rep()}`
  }
}
