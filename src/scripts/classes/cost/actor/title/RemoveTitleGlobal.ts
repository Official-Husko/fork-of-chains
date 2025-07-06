// @ts-nocheck


setup.qcImpl.RemoveTitleGlobal = class RemoveTitleGlobal extends setup.Cost {
  constructor(title) {
    super()

    if (setup.isString(title)) {
      this.title_key = title
    } else {
      this.title_key = title.key
    }
    if (!this.title_key) throw new Error(`Remove Title Global missing title: ${title}`)
  }

  text() {
    return `setup.qc.RemoveTitleGlobal('${this.title_key}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let title = setup.title[this.title_key]
    for (let unitkey in State.variables.unit) {
      let unit = State.variables.unit[unitkey]
      if (State.variables.titlelist.isHasTitle(unit, title)) {
        State.variables.titlelist.removeTitle(unit, title)
        if (unit.isYourCompany()) {
          setup.notify(`a|Rep a|lose ${title.rep()}`, {a: unit})
        }
      }
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let title = setup.title[this.title_key]
    return `All units loses ${title.rep()}`
  }
}
