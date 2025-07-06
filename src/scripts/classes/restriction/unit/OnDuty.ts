// @ts-nocheck

setup.qresImpl.OnDuty = class OnDuty extends setup.Restriction {
  /**
   * @param {string | setup.DutyTemplate} duty_template 
   */
  constructor(duty_template) {
    super()

    this.duty_template_key = setup.keyOrSelf(duty_template)
  }

  text() {
    return `setup.qres.OnDuty('${this.duty_template_key}')`
  }

  explain() {
    return `Unit must be on duty: ${setup.dutytemplate[this.duty_template_key].getName()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const duty = unit.getDuty()
    return duty && duty.getTemplate().key == this.duty_template_key
  }
}
