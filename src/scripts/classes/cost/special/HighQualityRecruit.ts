// @ts-nocheck

/**
 * Get a high quality recruit.
 */
setup.qcImpl.HighQualityRecruit = class HighQualityRecruit extends setup.Cost {
  /**
   * @param {string | setup.UnitGroup} unitgroup 
   * @param {setup.Job | string} job 
   * @param {number} tries 
   * @param {string} origin_text
   */
  constructor(unitgroup, job, tries, origin_text) {
    super()
    this.unitgroup_key = setup.keyOrSelf(unitgroup)
    this.job_key = setup.keyOrSelf(job)
    this.tries = tries
    this.origin_text = origin_text
    if (tries <= 0) {
      throw new Error(`Tries must be positive, not ${tries}`)
    }
  }

  text() {
    return `setup.qc.HighQualityRecruit('${this.unitgroup_key}', '${this.job_key}', ${this.tries}, '${setup.escapeJsString(this.origin_text)}')`
  }

  getJob() { return setup.job[this.job_key] }
  getUnitGroup() { return setup.unitgroup[this.unitgroup_key] }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const job = this.getJob()
    const preference = State.variables.settings.getGenderPreference(job)
    const ug = this.getUnitGroup()
    let unit = ug.getUnit(preference)
    for (let i = 0; i < this.tries - 1; ++i) {
      let new_unit = ug.getUnit(preference)
      if (new_unit.getSlaveValue() > unit.getSlaveValue()) {
        unit.delete()
        unit = new_unit
      } else {
        new_unit.delete()
      }
    }
    let qcclass
    if (job == setup.job.slaver) {
      qcclass = setup.qc.Slaver
    } else if (job == setup.job.slave) {
      qcclass = setup.qc.Slave
    } else {
      throw new Error(`Undetected job: ${this.job_key}`)
    }

    qcclass('recruit', '', /* is mercenary = */ true, /* markup = */ 1.25).apply({
      getName: () => this.origin_text,
      getActorUnit: () => unit,
    })
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Receive a high quality recruit from ${this.unitgroup_key} (${this.tries} tries) as ${this.job_key}`
  }
}
