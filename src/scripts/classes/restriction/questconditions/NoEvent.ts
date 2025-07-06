// @ts-nocheck


setup.qresImpl.NoEvent = class NoEvent extends setup.Restriction {
  constructor(template) {
    super()

    if (!template) throw new Error(`Missing template for NoEvent`)
    if (setup.isString(template)) {
      this.template_key = template
    } else {
      this.template_key = template.key
    }
  }

  text() {
    return `setup.qres.NoEvent('${this.template_key}')`
  }

  isOk(template_arg) {
    let template = setup.event[this.template_key]
    return !State.variables.eventpool.isEventScheduled(template)
  }

  apply(quest) {
    throw new Error(`Not a reward`)
  }

  undoApply(quest) {
    throw new Error(`Not a reward`)
  }

  explain() {
    let template = setup.event[this.template_key]
    return `Event not scheduled: ${template.getName()}`
  }
}
