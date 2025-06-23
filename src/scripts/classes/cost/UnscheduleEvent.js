
// schedules an event that will trigger in {weeks} weeks. 0 = will trigger same week.
setup.qcImpl.UnscheduleEvent = class UnscheduleEvent extends setup.Cost {
  constructor(template) {
    super()

    if (!template) throw new Error(`Missing event for UnscheduleEvent`)

    if (setup.isString(template)) {
      this.template_key = template
    } else {
      this.template_key = template.key
    }
  }

  text() {
    return `setup.qc.UnscheduleEvent('${this.template_key}')`
  }

  isOk() {
    throw new Error(`rm event should not be a cost`)
  }

  apply(quest) {
    let template = setup.event[this.template_key]
    SugarCube.State.variables.eventpool.unscheduleEvent(template)
  }

  undoApply() {
    throw new Error(`rm event should not be a cost`)
  }

  explain() {
    let template = setup.event[this.template_key]
    if (!template) throw new Error(`UnscheduleEvent ${this.template_key} is missing`)
    return `Unschedule event ${template.getName()} from schedule, if it was scheduled`
  }
}
