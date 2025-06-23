
setup.qcImpl.RemoveTag = class RemoveTag extends setup.Cost {
  constructor(actor_name, tag_name) {
    super()

    this.actor_name = actor_name
    this.tag_name = tag_name
  }

  static NAME = 'Remove a tag / flag from a unit.'
  static PASSAGE = 'CostRemoveTag'
  static UNIT = true

  text() {
    return `setup.qc.RemoveTag('${this.actor_name}', '${this.tag_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.removeTag(this.tag_name)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name} loses a tag: "${this.tag_name}"`
  }
}
