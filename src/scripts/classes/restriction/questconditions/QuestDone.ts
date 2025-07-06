// @ts-nocheck


setup.qresImpl.QuestDone = class QuestDone extends setup.Restriction {
  constructor(template) {
    super()

    if (!template) {
      this.template_key = null
    } else {
      this.template_key = setup.keyOrSelf(template)
    }
  }

  text() {
    if (this.template_key) {
      return `setup.qres.QuestDone('${this.template_key}')`
    } else {
      return `setup.qres.QuestDone(null)`
    }
  }

  isOk(quest) {
    let template
    if (this.template_key) {
      template = setup.questtemplate[this.template_key]
    } else {
      template = quest
    }
    return State.variables.statistics.isHasSuccess(template)
  }

  explain() {
    if (this.template_key) {
      const template = setup.questtemplate[this.template_key]
      return `Have ever completed quest: ${template.getName()}`
    } else {
      return `Have ever completed this quest`
    }
  }
}
