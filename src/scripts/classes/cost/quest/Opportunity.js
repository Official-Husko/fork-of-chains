
setup.qcImpl.Opportunity = class Opportunity extends setup.Cost {
  constructor(opportunity_template, default_assignment) {
    super()

    if (!opportunity_template) throw new Error(`Undefined oporunity`)

    this.template_key = setup.keyOrSelf(opportunity_template)
    this.default_assignment = default_assignment
  }

  text() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentTextHelper(this.default_assignment)
    return `setup.qc.Opportunity('${this.template_key}', ${assignment_text})`
  }

  apply(quest) {
    let template = setup.opportunitytemplate[this.template_key]
    const assignment = setup.qcImpl.QuestDirect.getDefaultAssignment(
      this.default_assignment, quest
    )
    let opportunity = setup.QuestPool.instantiateOpportunity(template, assignment)
    if (!opportunity) {
      console.log(`Something wrong when trying to generate opportunity ${template.key}`)
      setup.notify(`Something wrong when trying to generate opportunity ${template.getName()}. Please save your game and report this bug, while attaching the save file.`)
    } else {
      setup.notify(`New opportunity: ${opportunity.rep()}`)
    }
  }

  explain() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentExplainHelper(this.default_assignment)
    return `New opportunity: ${setup.opportunitytemplate[this.template_key].rep()} ${assignment_text}`
  }
}
