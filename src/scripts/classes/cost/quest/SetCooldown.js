class SetCooldown extends setup.Cost {
  /**
   * @param {*} template
   * @param {number} cooldown 
   */
  constructor(template, cooldown) {
    super()
    if (!template) {
      this.template_key = null
    } else {
      this.template_key = setup.keyOrSelf(template)
    }

    this.cooldown = cooldown
  }

  /**
   * @returns {setup.QuestTemplate | setup.OpportunityTemplate | setup.Event | null}
   */
  getTemplate() {
    return null
  }

  apply(quest) {
    const template = this.getTemplate()
    if (!template && template != null) throw new Error(`Missing template for ${this.template_key}`)
    State.variables.calendar.setCooldown(this.getTemplate() || quest.getTemplate(), this.cooldown)
  }

  explain(quest) {
    const template = this.getTemplate()
    return `Cannot generate ${template ? template.getName() : 'this'} for the next ${this.cooldown} weeks`
  }
}


setup.qcImpl.SetCooldownQuest = class SetCooldownQuest extends SetCooldown {
  text() {
    return `setup.qc.SetCooldownQuest(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`
  }

  getTemplate() {
    if (this.template_key) {
      return setup.questtemplate[this.template_key]
    } else {
      return null
    }
  }
}


setup.qcImpl.SetCooldownOpportunity = class SetCooldownOpportunity extends SetCooldown {
  text() {
    return `setup.qc.SetCooldownOpportunity(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`
  }

  getTemplate() {
    if (this.template_key) {
      return setup.opportunitytemplate[this.template_key]
    } else {
      return null
    }
  }
}


setup.qcImpl.SetCooldownEvent = class SetCooldownEvent extends SetCooldown {
  text() {
    return `setup.qc.SetCooldownEvent(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`
  }

  getTemplate() {
    if (this.template_key) {
      return setup.event[this.template_key]
    } else {
      return null
    }
  }
}
