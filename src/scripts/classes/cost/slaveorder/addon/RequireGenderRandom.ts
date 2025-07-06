// @ts-nocheck


// requires either male or female.
// will try to follow preferences whenever possible.
setup.SlaveOrderAddonImpl.RequireGenderRandom = class RequireGenderRandom extends setup.SlaveOrderAddonBase {
  constructor(job) {
    super()
    this.job_key = job.key
  }

  text() {
    return `setup.SlaveOrderAddon.RequireGenderRandom()`
  }

  explain() {
    return `Requires the slave to be of a random gender`
  }

  apply(slave_order) {
    let criteria = slave_order.criteria
    let gender = State.variables.settings.getGenderRandom(setup.job[this.job_key])
    criteria.restrictions.push(setup.qres.Trait(gender))
  }
}
