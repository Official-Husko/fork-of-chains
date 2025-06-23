
// remove this tag from ALL units
setup.qcImpl.RemoveTagGlobal = class RemoveTagGlobal extends setup.Cost {
  constructor(tag_name) {
    super()

    this.tag_name = tag_name
  }

  static NAME = 'Remove a tag / flag from ALL unit.'
  static PASSAGE = 'CostRemoveTagGlobal'

  text() {
    return `setup.qc.RemoveTagGlobal('${this.tag_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    for (let unitkey in State.variables.unit) {
      State.variables.unit[unitkey].removeTag(this.tag_name)
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let tagname = this.tag_name
    return `All units loses: "${tagname}"`
  }
}
