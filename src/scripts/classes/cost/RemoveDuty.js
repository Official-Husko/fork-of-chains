setup.qcImpl.RemoveDuty = class RemoveDuty extends setup.Cost {
  /**
   * @param {string | setup.DutyTemplate} duty_template 
   */
  constructor(duty_template) {
    super()

    this.duty_template_key = setup.keyOrSelf(duty_template)
  }

  text() { return `setup.qc.RemoveDuty('${this.duty_template_key}')` }

  getDutyTemplate() {
    const duty_template = setup.dutytemplate[this.duty_template_key]
    if (!duty_template) {
      throw new Error(`Unknown duty: ${this.duty_template_key}`)
    }
    return duty_template
  }

  apply(quest) {
    const duty = State.variables.dutylist.getDuty(this.getDutyTemplate())
    if (duty) {
      setup.notify(`The following duty is no longer available: ${duty.getName()}`)
      State.variables.dutylist.removeDuty(duty)
    } else {
      console.log(`Trying to remove duty ${this.getDutyTemplate().getName()} but nothing found. If this happens during quest testing, you can ignore this error.`)
    }
  }

  explain() {
    return `Lose duty: ${this.getDutyTemplate().getName()}`
  }
}
