
setup.qcImpl.RemoveTitle = class RemoveTitle extends setup.Cost {
  constructor(actor_name, title) {
    super()

    this.actor_name = actor_name
  
    if (setup.isString(title)) {
      this.title_key = title
    } else {
      this.title_key = title.key
    }
  }

  text() {
    return `setup.qc.RemoveTitle('${this.actor_name}', '${this.title_key}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let title = setup.title[this.title_key]
    if (!State.variables.titlelist.isHasTitle(unit, title)) {
    } else {
      State.variables.titlelist.removeTitle(unit, title)
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|lose ${title.rep()}.`, {a: unit})
      }
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let title = setup.title[this.title_key]
    return `${this.actor_name} loses ${title.rep()}`
  }
}
