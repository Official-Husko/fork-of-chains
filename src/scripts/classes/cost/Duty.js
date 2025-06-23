setup.qcImpl.Duty = class Duty extends setup.Cost {
  /**
   * @param {string | setup.DutyTemplate} duty_template 
   */
  constructor(duty_template) {
    super()

    this.duty_template_key = setup.keyOrSelf(duty_template)
  }

  apply(quest) {
    /**
     * @type {setup.DutyTemplate}
     */
    const template = setup.dutytemplate[this.duty_template_key]

    let duty_instance_class
    if (template.isHasPrestigeAmount()) {
      duty_instance_class = setup.DutyInstancePrestigeSlave
    } else {
      duty_instance_class = setup.DutyInstance
    }

    const duty = new duty_instance_class(
      { duty_template: setup.dutytemplate[this.duty_template_key] }
    )
    State.variables.dutylist.addDuty(duty)
  }

  explain() {
    `Gain ${setup.Article(setup.dutytemplate[this.duty_template_key].getName())} slot`
  }
}
