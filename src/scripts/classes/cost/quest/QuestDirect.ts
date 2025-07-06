// @ts-nocheck

setup.qcImpl.QuestDirect = class QuestDirect extends setup.Cost {
  /**
   * @param {setup.QuestTemplate | string} template
   */
  constructor(template, default_assignment) {
    super()

    if (template) {
      this.template_key = setup.keyOrSelf(template)
    } else {
      this.template_key = null
    }

    this.default_assignment = default_assignment
  }

  text() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentTextHelper(this.default_assignment)
    return `setup.qc.QuestDirect('${this.template_key}', ${assignment_text})`
  }

  /**
   * @returns {setup.QuestTemplate}
   */
  getQuestTemplate(quest) {
    return setup.questtemplate[this.template_key]
  }

  apply(quest) {
    const template = this.getQuestTemplate(quest)
    if (!template) throw new Error(`Quest template is missing`)

    const assignment = setup.qcImpl.QuestDirect.getDefaultAssignment(
      this.default_assignment, quest
    )

    const newquest = setup.QuestPool.instantiateQuest(template, assignment)

    if (!newquest) {
      console.log(`Something wrong when trying to generate quest ${template.key}`)
      setup.notify(`Something wrong when trying to generate quest ${template.getName()}. Please save your game and report this bug, while attaching the save file.`)
    } else {
      setup.notify(`New quest: ${newquest.rep()}`)
    }
  }

  explain(quest) {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentExplainHelper(this.default_assignment)
    let template = setup.questtemplate[this.template_key]
    if (!template) throw new Error(`Quest ${this.template_key} is missing`)
    return `New quest: ${template.getName()} ${assignment_text}`
  }

  /**
   * @param {object} default_assignment 
   * @param {object} quest 
   */
  static getDefaultAssignment(default_assignment, quest) {
    if (!default_assignment) return {}

    const assignment = {}
    for (const actor_name in default_assignment) {
      const target_actor_name = default_assignment[actor_name]
      assignment[actor_name] = quest.getActorUnit(target_actor_name)
    }
    return assignment
  }

  /**
   * @param {object} default_assignment 
   * @returns {string}
   */
  static assignmentTextHelper(default_assignment) {
    if (!default_assignment) return `null`
    let base = `{\n`
    for (const actor_key in default_assignment) {
      base += `${actor_key}: "${default_assignment[actor_key]}",\n`
    }
    base += `}`
    return base
  }

  /**
   * @param {object} default_assignment 
   * @returns {string}
   */
  static assignmentExplainHelper(default_assignment) {
    if (!default_assignment) return ``

    let base = `with (`
    for (const actor_key in default_assignment) {
      base += `${actor_key}=${default_assignment[actor_key]}, `
    }
    base += `)`
    return base
  }
}



setup.qcImpl.QuestDirectSelf = class QuestDirectSelf extends setup.qcImpl.QuestDirect {
  constructor(default_assignment) {
    super(/* quest template = */ null, default_assignment)
  }

  /**
   * @returns {setup.QuestTemplate}
   */
  getQuestTemplate(quest) {
    return quest.getTemplate()
  }

  text() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentTextHelper(this.default_assignment)
    return `setup.qc.QuestDirectSelf(${assignment_text})`
  }

  explain(quest) {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentExplainHelper(this.default_assignment)
    return `New quest: this quest again. ${assignment_text}`
  }
}

