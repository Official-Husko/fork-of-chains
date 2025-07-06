// @ts-nocheck


setup.qcImpl.AddTag = class AddTag extends setup.Cost {
  constructor(actor_name, tag_name) {
    super()

    this.actor_name = actor_name
    this.tag_name = tag_name
  }

  static NAME = 'Add a tag / flag to a unit.'
  static PASSAGE = 'CostAddTag'
  static UNIT = true

  text() {
    return `setup.qc.AddTag('${this.actor_name}', '${this.tag_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.addTag(this.tag_name)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name} gains a tag: "${this.tag_name}"`
  }
}
