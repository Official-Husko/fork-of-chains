// @ts-nocheck


setup.qresImpl.HasUnitWithTagAndJob = class HasUnitWithTagAndJob extends setup.Restriction {
  constructor(tag_name, job) {
    super()

    this.job_key = job.key
    this.tag_name = tag_name
  }

  static NAME = 'Exists a unit with the given job and tag'
  static PASSAGE = 'RestrictionHasUnitWithTagAndJob'
  static UNIT = true

  text() {
    return `setup.qres.HasUnitWithTagAndJob('${this.tag_name}', setup.job.${this.job_key})`
  }

  explain() {
    let tagname = this.tag_name
    return `Must have a unit with job: ${this.job_key} and tag/flag : "${tagname}"`
  }

  isOk() {
    let units = State.variables.company.player.getUnits({job: setup.job[this.job_key]})
    for (let i = 0; i < units.length; ++i) {
      if (units[i].isHasTag(this.tag_name)) return true
    }
    return false
  }
}
