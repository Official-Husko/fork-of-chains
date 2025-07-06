// @ts-nocheck


setup.qresImpl.HasFamilyWithJob = class HasFamilyWithJob extends setup.Restriction {
  constructor(job) {
    super()

    this.job_key = job.key
  }

  static NAME = 'Has a family member with the given job'
  static PASSAGE = 'RestrictionHasFamilyWithJob'
  static UNIT = true

  text() {
    return `setup.qres.HasFamilyWithJob(setup.job.${this.job_key})`
  }

  explain() {
    return `${setup.job[this.job_key].rep()}`
  }

  isOk(unit) {
    let family = State.variables.family.getFamily(unit)
    for (let familykey in family) {
      if (State.variables.unit[familykey].getJob().key == this.job_key) return true
    }
    return false
  }
}
