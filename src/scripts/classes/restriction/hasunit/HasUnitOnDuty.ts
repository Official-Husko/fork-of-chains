// @ts-nocheck


setup.qresImpl.HasUnitOnDuty = class HasUnitOnDuty extends setup.Restriction {
  /**
   * @param {string | setup.DutyTemplate} duty_template 
   */
  constructor(duty_template) {
    super()

    this.duty_template_key = setup.keyOrSelf(duty_template)
  }

  text() {
    return `setup.qres.HasUnitOnDuty('${this.duty_template_key}')`
  }

  explain() {
    return `Must EXIST available unit on duty: ${setup.dutytemplate[this.duty_template_key].getName()}`
  }

  isOk() {
    return !!State.variables.dutylist.getUnitIfAvailable(this.duty_template_key)
  }
}
