setup.qresImpl.OpportunityOnCooldown = class OpportunityOnCooldown extends setup.Restriction {
  constructor(template) {
    super()

    if (!template) throw new Error(`Missing template for OpportunityOnCooldown`)
    this.template_key = setup.keyOrSelf(template)
  }

  text() {
    return `setup.qres.OpportunityOnCooldown('${this.template_key}')`
  }

  isOk() {
    let template = setup.opportunitytemplate[this.template_key]
    return State.variables.calendar.isOnCooldown(template)
  }

  explain() {
    let template = setup.opportunitytemplate[this.template_key]
    return `Opportunity on cooldown: ${template.getName()}`
  }
}
